import QuizQuestion from '../../api/quiz-question.interface'
import Engageform from '../../engageform/engageform'
import { MaybeBoolean, MaybeString } from '../../types'
import Page from '../page'
import { PageType } from '../page-type.enum'

export default class Poster extends Page {
  readonly type = PageType.Poster
  private button: MaybeString
  private exitLink: MaybeBoolean
  private exitLinkNewWindow: MaybeBoolean
  private link: MaybeString

  constructor(engageform: Engageform, data: QuizQuestion) {
    super(engageform, data)
    if (data.coverPage) {
      this.button = data.coverPage.buttonText
      this.exitLink = data.coverPage.exitLink
      this.exitLinkNewWindow = data.coverPage.exitLinkNewWindow
      this.link = data.coverPage.link
    }
  }
}
