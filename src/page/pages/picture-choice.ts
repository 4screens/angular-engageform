import QuizQuestion from '../../api/quiz-question.interface'
import Engageform from '../../engageform/engageform'
import Case from '../case'
import ImageCase from '../case/image'
import Page from '../page'
import PageSentProperties from '../page-sent.interface'
import { PageType } from '../page-type.enum'

export default class PictureChoice extends Page {
  readonly type = PageType.PictureChoice
  selectedItemsCount = 0
  selectedItemsIds: string[] = []

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
    return new ImageCase(this, answer)
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

      var selected = undefined;

      if(sent.selectedCaseIds){
        selected = sent.selectedCaseIds.filter(function(val: string){
          return vcase.id === val;
        })
      }

      if (selected && selected.length > 0) {
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
      var correct = undefined;

      if(sent.correctCaseIds){
        correct = sent.correctCaseIds.filter(function(val: string){
          return vcase.id === val;
        })
      }

      if (correct) {
        vcase.correct = true
      } else {
        vcase.incorrect = true
      }
    })

    this.selectedItemsIds =  this.cases
      .filter(function(val){
        return val.selected;
      })
      .map(c => c.id);

    this.selectedItemsCount = this.selectedItemsIds.length

  }
}
