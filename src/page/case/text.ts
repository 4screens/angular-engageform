import Bootstrap from '../../bootstrap'
import { WithId } from '../../types'
import Case from '../case'
import { CaseType } from '../case-type.enum'
import Page from '../page'
import PageSentProperties from '../page-sent.interface'
import {PageType} from "../page-type.enum";
import MultiChoice from "../pages/multi-choice";

export class TextCase extends Case {
  readonly type = CaseType.Text

  constructor(page: Page, data: WithId & { text: string }) {
    super(page, data)
    this.title = data.text
  }

  send() {

    var multichoice = undefined

    if(this.page.type === PageType.MultiChoice){
      multichoice = this.page as MultiChoice
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
        return Bootstrap.$q.reject({textKey: 'NO_MORE_CHOICES_ALLOWED', message: 'No more choices is allowed'})
      }


    }else if ((!this.page.settings.allowMultipleChoice || !multichoice)
      && !this.page.engageform.settings.allowAnswerChange
      && this.page.filled) {
      return Bootstrap.$q.reject({textKey: 'CHANGING_NOT_ALLOWED', message: 'Changing answer is not allowed'})
    }

    return super.makeSend({selectedAnswerIds: [this.id]}).then((res) => {
      const data: PageSentProperties = <PageSentProperties>{}

      if (res.selectedAnswerIds) {
        data.selectedCaseIds = res.selectedAnswerIds
      }

      if (res.correctAnswerIds) {
        data.correctCaseIds = res.correctAnswerIds
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
