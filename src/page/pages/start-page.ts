import QuizQuestion from '../../api/quiz-question.interface'
import Engageform from '../../engageform/engageform'
import { MaybeString } from '../../types'
import Page from '../page'
import { PageType } from '../page-type.enum'

export default class StartPage extends Page {
  readonly type = PageType.startPage
  readonly isCoverPage = true

  button: MaybeString


  constructor(engageform: Engageform, data: QuizQuestion) {
    super(engageform, data)

    if (data.coverPage && data.coverPage.buttonText !== undefined) {
      this.button = data.coverPage.buttonText
    }
  }
}
