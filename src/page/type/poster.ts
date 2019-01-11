import Page from '../page'
import { PageType } from '../page-type.enum'
import EngageformProperties from '../../engageform/engageform-properties'
import QuizQuestion from '../../api/quiz-question'

export default class Poster extends Page {
  type = PageType.Poster
  private button: string
  private exitLink: boolean
  private link: string

  constructor(engageform: EngageformProperties, data: QuizQuestion) {
    super(engageform, data)
    if (data.coverPage) {
      this.button = data.coverPage.buttonText
      this.exitLink = data.coverPage.exitLink
      this.link = data.coverPage.link
    }
  }
}
