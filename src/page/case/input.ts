import Bootstrap from '../../bootstrap'
import { MaybeNumber, MaybeString, WithId } from '../../types'
import Case from '../case'
import { CaseType } from '../case-type.enum'
import Page from '../page'
import PageSentProperties from '../page-sent.interface'

export default class InputCase extends Case {
  readonly type = CaseType.Input
  expectedValue: MaybeString;
  value = '';

  constructor(page: Page, data: WithId & { label: string, type: string }) {
    super(page, data)
    this.title = data.label
    this.expectedValue = data.type
  }

  send() {
    const data: PageSentProperties = {
      inputs: []
    } as PageSentProperties
    const sent = this.load()

    for (const sentId in sent) {
      if (sent.hasOwnProperty(sentId)) {
        data.inputs!.push({
          _id: sentId,
          // @ts-ignore // FIXME: What's wrong here?
          value: sent[sentId]
        })
      }
    }

    return super.makeSend(data)
      .then(() => data)
      .catch((data) => {
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

    if (this.page.settings.requiredAnswer && this.value == undefined) {
      this.error = 'Answer is required'
      this.incorrect = true
    } else {
      this.error = ''
      this.correct = true
    }

    if (this.correct) {
      const sent = this.load()
      // @ts-ignore // FIXME: What's wrong here?
      sent[this.id] = this.value
      this.save(sent)

      return true
    }

    return false
  }
}
