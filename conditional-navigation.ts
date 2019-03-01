import { head } from 'lodash'
import Quiz from './src/api/quiz.interface'
import {
  ConditionConnection,
  ConditionIs,
  DefaultRule, EntryRule, ExitRule,
  isDefaultRule,
  isEntryRule,
  isExitRule,
  isFormCondition,
  QuestionLogic
} from './src/api/skip-logic.interface'
import Engageform from './src/engageform/engageform'
import { Navigation } from './src/navigation'
import Case from './src/page/case'
import Page from './src/page/page'
import { PageType } from './src/page/page-type.enum'
import { Maybe } from './src/types'

type AnswersTypes = string | number | { [key: string]: string } | null

class Logic {
  private entryRules = this.logic.rules.filter(isEntryRule)
  private exitRules = this.logic.rules.filter(isExitRule)
  private defaultRule = head<DefaultRule>(this.logic.rules.filter(isDefaultRule))!

  constructor(private logic: QuestionLogic, private answers: Map<string, AnswersTypes>) {}

  hasEntryRules() {
    return this.entryRules.length > 0
  }

  hasExitRules() {
    return this.exitRules.length > 0
  }

  resolveEntryDestination(): string {
    return this.resolveDestination(this.entryRules)
  }
  resolveExitDestination(): string {
    return this.resolveDestination(this.exitRules)
  }

  private resolveDestination(rules: Array<EntryRule | ExitRule>): string {
    const destination =
      rules
        .map(({destination, conditionsConnection, conditions}) => {
          const passedConditions = conditions.map((condition) => {
            let answer = this.answers.get(condition.to)
            if (!answer) {
              return false
            }
            if (isFormCondition(condition)) {
              answer = (answer as { [index: string]: string })[condition.field]
            }
            switch (condition.is) {
              case ConditionIs.Equal:
                return answer === condition.value
              case ConditionIs.NotEqual:
                return answer !== condition.value
              case ConditionIs.GreaterThan:
                return answer > condition.value
              case ConditionIs.GreaterThanOrEqual:
                return answer >= condition.value
              case ConditionIs.LessThan:
                return answer < condition.value
              case ConditionIs.LessThanOrEqual:
                return answer <= condition.value
              case ConditionIs.Between:
                return condition.value[0] >= answer && answer <= condition.value[1]
              case ConditionIs.Blank:
                return !Boolean(answer)
              case ConditionIs.NotBlank:
                return Boolean(answer)
              case ConditionIs.Contain:
                return (answer as string).indexOf(condition.value) >= 0
              case ConditionIs.NotContain:
                return (answer as string).indexOf(condition.value) === -1
              default:
                return false
            }
          })
          const combinator = conditionsConnection === ConditionConnection.Or ? 'some' : 'every'
          return passedConditions[combinator](v => v) ? destination : null
        })
        .filter(Boolean)[0]
    return destination || this.defaultRule.destination
  }
}

export default class ConditionalNavigation extends Navigation {
  static fromEnageformAndData(engageform: Engageform, data: Quiz): Navigation {
    return new ConditionalNavigation(engageform, data)
  }

  private logic: { [key: string]: Logic } = {}

  constructor(engageform: Engageform, data: Quiz) {
    super(engageform)
    const parsedLogic = (JSON.parse((data as any)._logic) || [])
    parsedLogic.forEach((logic: QuestionLogic) => {
      this.logic[logic.questionId] = new Logic(logic, this._engageform.answers)
    })
  }

  protected move(vcase?: Case) {
    const page = this._engageform.current
    const currentLogic = this.logic[page.id]
    let step: Maybe<number>
    let nextPage: Maybe<Page>

    if (!this.isPossiblyConditionalPage(page)) {
      nextPage = this._engageform.getPageByIndex(0)
    } else if (!currentLogic || !currentLogic.hasExitRules()) {
      nextPage = this._engageform.getPageByIndex(this.position + 1)
    } else {
      nextPage = this._engageform.getPageById(currentLogic.resolveExitDestination())
    }

    if (nextPage) {
      nextPage = this.checkEntryConditionForPage(nextPage)
    }

    // Checking again, since the page might become empty after checking the entry rules.
    if (nextPage) {
      step = this._engageform.getPageIndex(nextPage) - this._engageform.getPageIndex(page)
    }

    return super.move(vcase, step)
  }

  private checkEntryConditionForPage(page: Page): Maybe<Page> {
    const nextLogic = this.logic[page.id]
    if (nextLogic && nextLogic.hasEntryRules()) {
      const nextId = nextLogic.resolveEntryDestination()
      const next = this._engageform.getPageById(nextId)
      if (next) {
        return this.checkEntryConditionForPage(next)
      } else {
        return next
      }
    }
    return page
  }

  private isPossiblyConditionalPage(page: Page): boolean {
    return [PageType.Form, PageType.MultiChoice, PageType.PictureChoice, PageType.Rateit].includes(page.type)
  }
}
