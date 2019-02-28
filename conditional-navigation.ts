import Quiz from './src/api/quiz.interface'
import {
  ConditionConnection,
  ConditionIs,
  DefaultRule,
  EntryRule,
  ExitRule, FormConditions, isFormCondition,
  QuestionLogic,
  RuleType
} from './src/api/skip-logic.interface'
import Engageform from './src/engageform/engageform'
import { Navigation } from './src/navigation'
import Case from './src/page/case'
import Page from './src/page/page'
import { PageType } from './src/page/page-type.enum'

type AnswersTypes = string | number | { [key: string]: string } | null

class Logic {
  private entryRules: EntryRule[]
  private exitRules: ExitRule[]
  private defaultRule: DefaultRule

  constructor(private logic: QuestionLogic, private answers: Map<string, string | number | { [key: string]: string }>) {
    this.entryRules = logic.rules.filter(rule => rule.type === RuleType.Entry) as EntryRule[]
    this.exitRules = this.logic.rules.filter(rule => rule.type === RuleType.Exit) as ExitRule[]
    this.defaultRule = this.logic.rules.filter(rule => rule.type === RuleType.Default)[0] as DefaultRule
  }

  hasExitRules() {
    return this.exitRules.length > 0
  }

  resolveExitDestinationFor(answer: AnswersTypes): string {
    const destination =
      this.exitRules
        .map(({destination, conditionsConnection, conditions}) => {
          const passedConditions = conditions.map((condition) => {
            let answer = this.answers.get(condition.to)
            if (!answer) {
              return false
            }
            if (isFormCondition(condition)) {
              answer = (answer as {[index: string]: string})[condition.field]
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
          if (conditionsConnection === ConditionConnection.Or) {
            return passedConditions.some(v => v) ? destination : null
          } else {
            return passedConditions.every(v => v) ? destination : null
          }
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

    // FIXME: there might be an entry condition for the first question so it needs to be handled.
    if (!this.isPossiblyConditionalPage(page)) {
      return super.move(vcase)
    }

    const currentLogic = this.logic[page.id]

    if (!currentLogic) {
      return super.move(vcase, 1)
    }

    if (currentLogic.hasExitRules()) {
      const currentAnswer = this.extractAnswerFromPage(page)
      const nextPageId = currentLogic.resolveExitDestinationFor(currentAnswer)
      console.log('RESOLVED', nextPageId)
    }

    return super.move(vcase, 1)
  }

  private extractAnswerFromPage(page: Page): AnswersTypes {
    const answer: any = this._engageform.answers.get(page.id)
    if (!answer) {
      return null
    } else switch (page.type) {
      case PageType.Rateit:
        return answer.selectedValue
      case PageType.PictureChoice:
      case PageType.MultiChoice:
        return answer.selectedCaseId!
      case PageType.Form:
        return answer
      default:
        return null
    }
  }

  private isPossiblyConditionalPage(page: Page): boolean {
    return [PageType.Form, PageType.MultiChoice, PageType.PictureChoice, PageType.Rateit].includes(page.type)
  }
}
