import QuizQuestionAnswer from '../../api/quiz-question-answer.interface'
import Bootstrap from '../../bootstrap'
import { MaybeNumber, MaybeString, WithId } from '../../types'
import Case from '../case'
import { CaseType } from '../case-type.enum'
import Page from '../page'
import PageSentProperties from '../page-sent.interface'

export default class ImageCase extends Case {
  private static mediaWidth = 300
  readonly type = CaseType.Image
  media: MaybeString;
  mediaWidth: MaybeNumber;
  mediaHeight: MaybeNumber;
  mediaUrl: MaybeString;

  constructor(page: Page, data: WithId & {text: string, imageFile: string, imageData: {containerRatio: number, containerHeight: number}, imageFileUrl: string}) {
    super(page, data)

    this.title = data.text
    this.media = Bootstrap.cloudinary.prepareImageUrl(
      data.imageFile,
      ImageCase.mediaWidth,
      data.imageData
    )
    this.mediaUrl = data.imageFileUrl;
    this.mediaWidth = ImageCase.mediaWidth
    if (data.imageData && data.imageData.containerRatio) {
      this.mediaHeight = Math.round(ImageCase.mediaWidth * data.imageData.containerRatio)
    } else {
      this.mediaHeight = Math.round(data.imageData.containerHeight || 0)
    }
  }

  send() {
    if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
      return Bootstrap.$q.reject({textKey: 'CHANGING_NOT_ALLOWED', message: 'Changing answer is not allowed'})
    }

    return super.makeSend({selectedAnswerId: this.id}).then((res: QuizQuestionAnswer) => {
      const data: PageSentProperties = {
        selectedCaseId: res.selectedAnswerId,
        correctCaseId: res.correctAnswerId
      }

      for (const caseId in res.stats) {
        if (res.stats.hasOwnProperty(caseId)) {
          data.results = data.results || {}
          if (/.{24}/.test(caseId)) {
            data.results[caseId] = res.stats[caseId]
          }
        }
      }

      super.save(data)
      this.page.selectAnswer(data)

      return data
    })
  }
}
