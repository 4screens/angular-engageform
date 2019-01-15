import Engageform from '../../engageform/engageform'
import Case from '../case'
import Page from '../page'
import { PageType } from '../page-type.enum'
import QuizQuestion from '../../api/quiz-question.interface'
import { TextCase } from '../case/text'
import PageSentProperties from '../page-sent.interface'

export default class MultiChoice extends Page {
  readonly type = PageType.MultiChoice

  constructor(engageform: Engageform, data: QuizQuestion) {
    super(engageform, data)

    if (!data.answers) {
      return
    }

    this.cases = data.answers.map((answer) => {
      return this.createCase(answer)
    })

    if (this.cases.length) {
      this.sent().then(sent => {
        this.selectAnswer(sent)
      })
    }
  }

  createCase(answer: any): Case {
    return new TextCase(this, answer)
  }

  refreshAnswer(sent: PageSentProperties, question: QuizQuestion): PageSentProperties {
    question.answers.map((answer: any) => {
      if (sent.results) {
        sent.results[answer._id] = answer.percent
      }
    })

    return sent
  }

  selectAnswer(sent: any) {
    this.cases.map((vcase: Case) => {
      vcase.selected = false
      vcase.correct = false
      vcase.incorrect = false

      if (vcase.id === sent.selectedCaseId) {
        this.engageform.sendAnswerCallback(
          this.engageform.title || this.engageform.id,
          this.engageform.current ? this.engageform.current.title || this.engageform.current.id : null,
          vcase
        )
        this.filled = true
        vcase.selected = true
      }

      if (sent.results) {
        vcase.result = sent.results[vcase.id] || 0
      }

      // Mark case as correct or incorrect.
      if (vcase.id === sent.correctCaseId) {
        vcase.correct = true
      } else {
        vcase.incorrect = true
      }
    })
  }
}
