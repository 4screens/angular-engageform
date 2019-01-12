import Bootstrap from '../../bootstrap'
import Case from '../case'
import { CaseType } from '../case-type.enum'
import PageProperties from '../page-properties'
import PageSentProperties from '../page-sent.interface'

export default class InputCase extends Case {
  type = CaseType.Input

  title: string
  correct: boolean
  incorrect: boolean
  expectedValue: string
  value: string
  error: string

  constructor(page: PageProperties, data: any) {
    super(page, data)

    this.title = data.label
    this.expectedValue = data.type
    this.value = ''
  }

  send() {
    var data: PageSentProperties = <PageSentProperties>{}
    data.inputs = []
    var sent = this.load()

    for (var sentId in sent) {
      if (sent.hasOwnProperty(sentId)) {
        data.inputs.push({
          _id: sentId,
          value: sent[sentId]
        })
      }
    }

    return super.makeSend(data).then(() => {
      return data
    }).catch((data) => {
      if (data.code === 406) {
        data.textKey = 'INCORRECT_INPUT'
        data.message = 'Incorrect inputs sent. Try again.'
        this.save(<PageSentProperties>{})
      }

      return Bootstrap.$q.reject(data)
    })
  }

  validate(): boolean {
    this.correct = false
    this.incorrect = false

    if (this.page.settings.requiredAnswer && !this.value) {
      this.error = 'Answer is required'
      this.incorrect = true
    } else {
      this.error = ''
      this.correct = true
    }

    if (this.correct) {
      var sent = this.load()
      sent[this.id] = this.value
      this.save(sent)

      return true
    }

    return false
  }
}
