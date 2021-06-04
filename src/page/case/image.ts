import QuizQuestionAnswer from '../../api/quiz-question-answer.interface'
import Bootstrap from '../../bootstrap'
import { MaybeNumber, MaybeString, WithId } from '../../types'
import Case from '../case'
import { CaseType } from '../case-type.enum'
import Page from '../page'
import PageSentProperties from '../page-sent.interface'
import {PageType} from "../page-type.enum";
import MultiChoice from "../pages/multi-choice";
import PictureChoice from "../pages/picture-choice";

export default class ImageCase extends Case {
  private static mediaWidth = 300
  readonly type = CaseType.Image
  media: MaybeString;
  mediaWidth: MaybeNumber;
  mediaHeight: MaybeNumber;
  mediaUrl: MaybeString;
  mediaFileWidth: MaybeNumber;
  mediaFileHeight: MaybeNumber;

  constructor(page: Page, data: WithId & {text: string, imageFile: string, imageData: {containerRatio: number, containerHeight: number}, imageFileUrl: string, imageFileData: {width: number, height: number}}) {
    super(page, data)

    this.title = data.text
    this.media = Bootstrap.cloudinary.prepareImageUrl(
      data.imageFile,
      ImageCase.mediaWidth,
      data.imageData
    )
    if (data.imageFileData) {
      this.mediaFileWidth = data.imageFileData.width;
      this.mediaFileHeight = data.imageFileData.height;
    }
    this.mediaUrl = data.imageFileUrl;
    this.mediaWidth = ImageCase.mediaWidth
    if (data.imageData && data.imageData.containerRatio) {
      this.mediaHeight = Math.round(ImageCase.mediaWidth * data.imageData.containerRatio)
    } else {
      this.mediaHeight = Math.round(data.imageData.containerHeight || 0)
    }
  }

  send() {

    var multichoice = undefined

    if(this.page.type === PageType.PictureChoice){
      multichoice = this.page as PictureChoice
    }

    if(this.page.settings.allowMultipleChoice && multichoice){

      var selected = false;

      //checking if answer is already selected
      for(var selectedItem of multichoice.selectedItemsIds){
        if(selectedItem == this.id){
          selected = true;
          break;
        }
      }

      //here we check if we can unset given answer (if we resend the same answer then it will be unset if allowed)
      if(selected && !this.page.engageform.settings.allowAnswerChange){
        return Bootstrap.$q.reject({textKey: 'CHANGING_NOT_ALLOWED', message: 'Changing answer is not allowed'})
      }

      //here we will check if there is max answers limit exceeded
      if(!selected && this.page.settings.maxAnswersCount && multichoice.selectedItemsCount >= this.page.settings.maxAnswersCount){
        return Bootstrap.$q.reject({textKey: 'NO_MORE_NOT_ALLOWED', message: 'No more answers is allowed'})
      }


    }else if ((!this.page.settings.allowMultipleChoice || !multichoice)
      && !this.page.engageform.settings.allowAnswerChange
      && this.page.filled) {
      return Bootstrap.$q.reject({textKey: 'CHANGING_NOT_ALLOWED', message: 'Changing answer is not allowed'})
    }

    if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
      return Bootstrap.$q.reject({textKey: 'CHANGING_NOT_ALLOWED', message: 'Changing answer is not allowed'})
    }

    return super.makeSend({selectedAnswerIds: [this.id]}).then((res: QuizQuestionAnswer) => {
      const data: PageSentProperties = {
        selectedCaseIds: res.selectedAnswerIds,
        correctCaseIds: res.correctAnswerIds
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
