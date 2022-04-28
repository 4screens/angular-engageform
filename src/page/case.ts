import QuizQuestionAnswerResponse from '../api/quiz-question-answer-response.interface'
import QuizQuestionAnswer from '../api/quiz-question-answer.interface'
import Bootstrap from '../bootstrap'
import { EmbedMode } from '../embed-mode.enum'
import { Id, MaybeString, WithId } from '../types'
import { CaseType } from './case-type.enum'
import Page from './page'
import PageSentProperties from './page-sent.interface'
import angular from "angular";

export default abstract class Case {
  // TODO: how to type this?
  // static create<T extends Case>(caseConstructor: T) {
  //   return new caseConstructor()
  // }

  readonly id: Id
  readonly type: CaseType = CaseType.Undefined
  readonly page: Page

  selected = false
  correct = false
  incorrect = false
  result = 0
  responseCount = 0
  title: MaybeString
  error: MaybeString
  value: MaybeString

  protected constructor(page: Page, {_id}: WithId) {
    this.page = page
    this.id = _id
  }

  /**
   * Method used to inform if the correct or incorrect indicator should be shown. Combine with ngIf or ngShow.
   * Indicator is shown when the page's settings allow so and (1) the answer is selected or (2) the questions is
   * answered and the case is correct. Not shown in the summary and results modes.
   * @returns {boolean} Should the indicator be shown?
   */
  shouldShowIndicator(): boolean {
    return !this.page.engageform.isSummaryMode() && !this.page.engageform.isResultsMode()
      && this.page.settings.showCorrectAnswer && (this.selected || (this.page.filled && this.correct))
  }

  /**
   * Informs if the results should be shown (in the summary mode or when the page is filled and set to do so).
   * @returns {boolean} Should result be shown.
   */
  shouldShowResults(): boolean {
    return this.page.engageform.isSummaryMode() ||
      this.page.settings.showResults && this.page.filled && !this.page.engageform.isResultsMode()
  }

  /**
   * Method created mostly to mislead programmer making him think this is how the answer is sent. Too bad!
   * You've been goofed! The real sending is done in subclasses.
   * @returns {IPromise<T>}
   */
  send(): ng.IPromise<PageSentProperties> {
    const deferred = Bootstrap.$q.defer<PageSentProperties>()
    deferred.resolve(<PageSentProperties>{})
    return deferred.promise
  }

  makeSend(questionAnswer: QuizQuestionAnswer): angular.IPromise<QuizQuestionAnswer> {
    let url = Bootstrap.getConfig('backend').domain + Bootstrap.getConfig('engageform').pageResponseUrl
    url = url.replace(':pageId', this.page.id)

    if (Bootstrap.mode !== EmbedMode.Default) {
      url += '?preview'
    }

    questionAnswer.quizQuestionId = this.page.id
    questionAnswer.userIdent = Bootstrap.user.sessionId
    questionAnswer.eventUserId = Bootstrap.user.getEventUserId(this.page.engageform.id)

    if(!questionAnswer.eventUserId && questionAnswer.userIdent){
      questionAnswer.eventUserId = questionAnswer.userIdent
    }

    const eventValues = {
      questionId: this.page.id,
      questionTitle: this.page.title,
      answerId: this.id,
      answerValue: (questionAnswer.inputs && questionAnswer.inputs.map((input) => {
          return input.value
        }))
        // @ts-ignore
        || this.title || this.ordinal
    }

    return Bootstrap.$http.post<QuizQuestionAnswer>(url, questionAnswer).then((res: angular.IHttpResponse<QuizQuestionAnswer>) => {
      if ([200, 304].indexOf(res.status) !== -1) {
        if (!questionAnswer.userIdent && res.data.userIdent) {
          Bootstrap.user.sessionId = res.data.userIdent
        }
        if (!questionAnswer.eventUserId && res.data.eventUserId) {
          Bootstrap.user.setEventUserId(this.page.engageform.id, res.data.eventUserId)
        }
        this.page.engageform.event.trigger('answer', eventValues)
        return res.data
      } else {
        return Bootstrap.$q.reject(res.data || {})
      }
    }).catch((res: QuizQuestionAnswerResponse) => {
      return Bootstrap.$q.reject(res.data || {})
    })
  }

  load(): PageSentProperties {
    return Bootstrap.localStorage.get<PageSentProperties>('page.' + this.page.id) || ({} as PageSentProperties)
  }

  save(data: PageSentProperties): void {
    this.page.engageform.setAnswer(this.page.id, data)
    Bootstrap.localStorage.set('page.' + this.page.id, data)
  }

  validate(): boolean {
    return true
  }
}
