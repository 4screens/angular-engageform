import {head} from 'lodash'
import Quiz from './api/quiz.interface'
import {
  BaseRule,
  ConditionConnection,
  ConditionIs,
  DefaultRule,
  EntryRule,
  ExitRule,
  isDefaultRule,
  isEntryRule,
  isExitRule,
  isFormCondition,
  QuestionLogic, RuleType
} from './api/skip-logic.interface'
import Engageform from './engageform/engageform'
import {Navigation} from './navigation'
import Case from './page/case'
import Page from './page/page'
import {PageType} from './page/page-type.enum'
import {Maybe} from './types'

type AnswersTypes = string | string[] | number | { [key: string]: string } | null

class Logic {
  private readonly entryRules: Array<EntryRule>
  private readonly exitRules: Array<ExitRule>
  private readonly defaultRule: DefaultRule
  private readonly answers: Map<string, AnswersTypes>

  constructor(private logic: QuestionLogic, answers: Map<string, AnswersTypes>) {
    this.entryRules = this.processNonDefaultRules(logic.rules[RuleType.Entry], isEntryRule)
    this.exitRules = this.processNonDefaultRules(logic.rules[RuleType.Exit], isExitRule)
    this.defaultRule = head<DefaultRule>(logic.rules[RuleType.Default].filter(isDefaultRule))!
    this.answers = answers
  }

  get defaultRuleValue() {
    return this.defaultRule
  }

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

  private processNonDefaultRules<T extends EntryRule | ExitRule>(rules: BaseRule[], predicate: (rule: BaseRule) => rule is T): T[] {
    return rules ? rules
      .filter(predicate)
      .map(this.dropEmptyConditions)
      .filter(this.hasConditions) : []
  }

  private dropEmptyConditions<R extends EntryRule | ExitRule>(rule: R): R {
    return {
      ...rule,
      conditions: rule.conditions.filter(condition => Boolean(condition.to))
    }
  }

  private hasConditions({conditions}: EntryRule | ExitRule): boolean {
    return conditions.length > 0
  }

  private resolveDestination(rules: Array<EntryRule | ExitRule>): string {
    const destination =
      rules
        .map(({destination, conditionsConnection, conditions}) => {
          const passedConditions = conditions.map((condition) => {
            let answers = this.answers.get(condition.to)
            if (!answers) {
              return false
            }
            if (isFormCondition(condition)) {
              answers = (answers as { [index: string]: string })[condition.field]
            }

            if (Array.isArray(answers)) {

              let result = false;

              for(var ans of answers) {
                switch (condition.is) {
                  case ConditionIs.Equal:
                    result = result || (ans.toString() === condition.value.toString())
                    break
                  case ConditionIs.NotEqual:
                    result = result || (ans.toString() !== condition.value)
                    break
                  case ConditionIs.Blank:
                    result = result || (!Boolean(ans))
                    break
                  case ConditionIs.NotBlank:
                    result = result || (Boolean(ans))
                    break
                  case ConditionIs.Contain:
                    result = result || ( (ans.toString() as string).indexOf(condition.value) >= 0 )
                    break
                  case ConditionIs.NotContain:
                    result = result || ( (ans.toString() as string).indexOf(condition.value) === -1 )
                    break
                }
              }

              return result;

            }else{
              switch (condition.is) {
                case ConditionIs.Equal:
                  return answers.toString() === condition.value.toString()
                case ConditionIs.NotEqual:
                  return answers.toString() !== condition.value.toString()
                case ConditionIs.GreaterThan:
                  return answers > condition.value
                case ConditionIs.GreaterThanOrEqual:
                  return answers >= condition.value
                case ConditionIs.LessThan:
                  return answers < condition.value
                case ConditionIs.LessThanOrEqual:
                  return answers <= condition.value
                case ConditionIs.Between:
                  return condition.value[0] >= answers && answers <= condition.value[1]
                case ConditionIs.Blank:
                  return !Boolean(answers)
                case ConditionIs.NotBlank:
                  return Boolean(answers)
                case ConditionIs.Contain:
                  return (answers.toString() as string).indexOf(condition.value) >= 0
                case ConditionIs.NotContain:
                  return (answers.toString() as string).indexOf(condition.value) === -1
                default:
                  return false
              }
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
    const parsedLogic = (data as any).skipLogic || {};
    Object.keys(parsedLogic).forEach((logic: string) => {
      this.logic[logic] = new Logic(parsedLogic[logic], this._engageform.answers)
    })
  }

  prev($event: any) {
    const previousPage = this.visitedPages.pop()
    const step = this._engageform.getPageIndex(this._engageform.current) - this._engageform.getPageIndex(previousPage!)
    super.prev($event, step)
  }

  protected move(vcase?: Case) {
    const page = this._engageform.current
    const currentLogic = this.logic && page ? this.logic[page.id]: undefined

    let step: Maybe<number>
    let nextPage: Maybe<Page>

    //by default we want to go next page
    nextPage = this._engageform.getPageByIndex(this.position)

    //if exitrule is set then we want to to the pointed by exit rule
    if (currentLogic && currentLogic.hasExitRules()) {
      let possibleNextPage = this._engageform.getPageById(currentLogic.resolveExitDestination())
      //if exitrule points to next page then we override default next page
      if (possibleNextPage) {
        nextPage = possibleNextPage
      }
    }

    if (nextPage) {
      nextPage = this.checkEntryConditionForPage(nextPage)
    }

    // Checking again, since the page might become empty after checking the entry rules.
    if (nextPage) {
      let nextIdx = page ? this._engageform.getPageIndex(nextPage) : 1
      if (nextIdx < 0) {
        let endPageIdx = page ? this._engageform.getEndPageIndex(nextPage) : 1
        this._engageform.skipLogicSelectedEndPage = endPageIdx
        return super.move( undefined,-1)
      } else {
        return super.move(vcase, (nextIdx - this._engageform.getPageIndex(page)))
      }
    }

    //by default we want to go next page - but we never should go here!
    return super.move(vcase, 1)
  }

  private checkEntryConditionForPage(page: Page): Maybe<Page> {
    const nextLogic = this.logic && page ? this.logic[page.id] : undefined

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
