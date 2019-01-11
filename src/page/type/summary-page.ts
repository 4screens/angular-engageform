import Page from '../page'
import { PageType } from '../page-type.enum'
import EndStats from '../../api/end-stats'
import EngageformProperties from '../../engageform/engageform-properties'
import QuizQuestion from '../../api/quiz-question'
import { Type } from '../../engageform/engageform-type.enum'

export default class SummaryPage extends Page {
  type = PageType.SummaryPage
  stats: EndStats[]

  constructor(engageform: EngageformProperties, data: QuizQuestion) {
    super(engageform, data)

    if (data.text) {
      this.title = data.text
    } else {
      if (engageform.type === Type.Outcome) {
        this.title = 'Outcomes'
      } else {
        this.title = 'Scores'
      }
    }

    this.stats = data.stats
  }
}
