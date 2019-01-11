import angular from 'angular'
import Case from '../case'
import { CaseType } from '../case-type.enum'
import PageProperties from '../page-properties'
import PageSentProperties from '../page-sent.interface'

export default class BuzzCase extends Case {
  type = CaseType.Buzz
  page: PageProperties

  constructor(page: PageProperties, data: any) {
    super(page, data)
    this.page = page
  }

  send(): angular.IPromise<PageSentProperties> {
    // We dont really send buzzes here, just increase buttonClickSum here
    this.page.clickBuzzer()
    var deferred = Bootstrap.$q.defer()
    deferred.resolve(<PageSentProperties>{})
    return deferred.promise
  }

  trueBuzzerSend(BCS: number): angular.IPromise<PageSentProperties> {
    return super.makeSend({quizQuestionId: this.page.id, buttonClickSum: BCS}).then((res) => {
      return <PageSentProperties>{}
    })
  }
}
