import Quiz from './src/api/quiz.interface'
import { QuestionLogic } from './src/api/skip-logic.interface'
import Engageform from './src/engageform/engageform'
import { Navigation } from './src/navigation'
import Case from './src/page/case'
import Page from './src/page/page'
import { PageType } from './src/page/page-type.enum'

export default class ConditionalNavigation extends Navigation {
  static fromEnageformAndData(engageform: Engageform, data: Quiz): Navigation {
    return new ConditionalNavigation(engageform, data)
  }

  logic: { [key: string]: QuestionLogic } = {}

  constructor(engageform: Engageform, data: Quiz) {
    super(engageform)
    const parsedLogic = (JSON.parse((data as any)._logic) || [])
    parsedLogic.forEach((logic: QuestionLogic) => {
      this.logic[logic.questionId] = logic
    })
    console.log('LOGIC', this.logic)
    console.log(this)
  }

  protected move(vcase?: Case) {
    const page = this._engageform.current
    if (!this.isPossiblyConditionalPage(page)) {
      return super.move(vcase)
    }

    const currentLogic = this.logic[page.id]
    const currentAnswer = this.extractAnswerFromPage(page)
    console.log(currentLogic, currentAnswer)

    return super.move(vcase, 1)
  }

  private extractAnswerFromPage(page: Page): string | number | {[key: string]: string} | null {
    const answer: any = this._engageform.answers.get(page.id)
    if (!answer) {
      return null
    } else switch(page.type) {
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
