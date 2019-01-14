import Page from '../page'
import { PageType } from '../page-type.enum'
import EngageformProperties from '../../engageform/engageform-properties'
import QuizQuestion from '../../api/quiz-question.interface'

export default class StartPage extends Page {
  readonly type = PageType.StartPage

  button: string

  isCoverPage = true

  constructor(engageform: EngageformProperties, data: QuizQuestion) {
    super(engageform, data)

    if (data.coverPage && data.coverPage.buttonText !== undefined) {
      this.button = data.coverPage.buttonText
    }
  }
}
