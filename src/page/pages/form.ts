import Bootstrap from '../../bootstrap'
import Case from '../case'
import { PageType } from '../page-type.enum'
import Page from '../page'
import EngageformProperties from '../../engageform/engageform-properties'
import QuizQuestion from '../../api/quiz-question.interface'
import InputCase from '../case/input'
import PageSentProperties from '../page-sent.interface'
import Result from '../../api/result.interface'

export default class Form extends Page {
  readonly type = PageType.Form
  count = 0

  constructor(engageform: EngageformProperties, data: QuizQuestion) {
    super(engageform, data)

    if (!data.forms) {
      return
    }

    this.cases = data.forms.inputs.map((input) => {
      return this.createCase(input)
    })

    if (this.cases.length) {
      this.sent().then(sent => {
        this.selectAnswer(sent)
      })
    }
  }

  createCase(input: any): Case {
    return new InputCase(this, input)
  }

  send(vcase: Case): ng.IPromise<PageSentProperties> {
    var deferred = Bootstrap.$q.defer()
    var validated = true

    this.cases.map((input) => {
      if (!input.validate()) {
        validated = false
      }
    })

    if (validated) {
      this.filled = true
      this.engageform.sendAnswerCallback(
        this.engageform.title || this.engageform.id,
        this.engageform.current ? this.engageform.current.title || this.engageform.current.id : null,
        this.cases[0]
      )
      deferred.resolve(this.cases[0].send())
    } else {
      this.filled = false
      deferred.resolve(<PageSentProperties>{})
    }

    return deferred.promise
  }

  selectAnswer(sent: any) {
    this.cases.map((vcase: Case) => {
      vcase.value = sent[vcase.id] || ''

      // In results mode, there might be data containing user inputs, so set it as the case value.
      if (sent.inputs) {
        sent.inputs.forEach((inputData: { _id: string, value: string }) => {
          if (inputData._id === vcase.id) {
            vcase.value = inputData.value
          }
        })
      }
    })
  }

  setResults(results: Result) {
    this.count = results.count
  }
}
