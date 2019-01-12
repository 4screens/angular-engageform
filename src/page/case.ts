import QuizQuestionAnswerResponse from '../api/quiz-question-answer-response.interface'
import QuizQuestionAnswer from '../api/quiz-question-answer.interface'
import Bootstrap from '../bootstrap'
import { EngageformMode } from '../engageform/engageform-mode.enum'
import CaseProperties from './case-properties'
import { CaseType } from './case-type.enum'
import Page from './page'
import PageProperties from './page-properties'
import PageSentProperties from './page-sent.interface'

export default class Case implements CaseProperties {
  private _caseId: string
  private _page: PageProperties

  type = CaseType.Undefined

  selected: boolean = false
  correct: boolean = false
  incorrect: boolean = false

  result: number = 0

  title = undefined
  ordinal = undefined

  get id(): string {
    return this._caseId
  }

  set id(caseId: string) {
    this._caseId = caseId
  }

  get page(): Page {
    return this._page
  }

  constructor(page: Page, data: any) {
    this._caseId = data._id
    this._page = page
  }

  /**
   * Method used to inform if the correct or incorrect indicator should be shown. Combine with ngIf or ngShow.
   * Indicator is shown when the page's settings allow so and (1) the answer is selected or (2) the questions is
   * answered and the case is correct. Not shown in the summary and results modes.
   * @returns {boolean} Should the indicator be shown?
   */
  shouldShowIndicator(): boolean {
    return !this._page.engageform.isSummaryMode() && !this._page.engageform.isResultsMode()
      && this._page.settings.showCorrectAnswer && (this.selected || (this._page.filled && this.correct))
  }

  /**
   * Informs if the results should be shown (in the summary mode or when the page is filled and set to do so).
   * @returns {boolean} Should result be shown.
   */
  shouldShowResults(): boolean {
    return this._page.engageform.isSummaryMode() ||
      this._page.settings.showResults && this._page.filled && !this._page.engageform.isResultsMode()
  }

  /**
   * Method created mostly to mislead programmer making him think this is how the answer is sent. Too bad!
   * You've been goofed! The real sending is done in subclasses.
   * @returns {IPromise<T>}
   */
  send(): ng.IPromise<PageSentProperties> {
    var deferred = Bootstrap.$q.defer()
    deferred.resolve(<PageSentProperties>{})
    return deferred.promise
  }

  makeSend(data: API.IQuizQuestionAnswer): ng.IPromise<QuizQuestionAnswer> {
    var url = Bootstrap.config.backend.domain + Bootstrap.config.engageform.pageResponseUrl
    url = url.replace(':pageId', this.page.id)

    if (Bootstrap.mode !== EngageformMode.Default) {
      url += '?preview'
    }

    data.quizQuestionId = this.page.id
    data.userIdent = Bootstrap.user.sessionId

    const eventValies = {
      questionId: this._page.id,
      questionTitle: this._page.title,
      answerId: this.id,
      answerValue: (data.inputs && data.inputs.map(function (input) {
        return input.value
      })) || this.title || this.ordinal
    }

    return Bootstrap.$http.post(url, data).then((res: QuizQuestionAnswerResponse) => {
      if ([200, 304].indexOf(res.status) !== -1) {
        if (!data.userIdent) {
          Bootstrap.user.sessionId = res.data.userIdent
        }
        this._page._engageform.event.trigger('answer', eventValies)
        return res.data
      } else {
        return Bootstrap.$q.reject(res.data || {})
      }
    }).catch((res: QuizQuestionAnswerResponse) => {
      return Bootstrap.$q.reject(res.data || {})
    })
  }

  load(): PageSentProperties {
    return <PageSentProperties>Bootstrap.localStorage.get('page.' + this.page.id) || <PageSentProperties>{}
  }

  save(data: PageSentProperties): void {
    Bootstrap.localStorage.set('page.' + this.page.id, data)
  }

  validate(): boolean {
    // "abstract"
    return true
  }

  // Buzzer need extra send, so we made this abstract
  trueBuzzerSend(BCS: number) {
    // "abstract"
  }
}

