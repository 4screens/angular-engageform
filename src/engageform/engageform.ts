import angular from 'angular'
import { extend, get } from 'lodash'
import ConditionalNavigation from '../conditional-navigation'
import Answer from '../api/answer.interface'
import EmbedSettings from '../api/embed-settings.interface'
import EndStats from '../api/end-stats.interface'
import QuizFinish from '../api/quiz-finish.interface'
import QuizQuestion from '../api/quiz-question.interface'
import Quiz from '../api/quiz.interface'
import Result from '../api/result.interface'
import Bootstrap from '../bootstrap'
import Branding from '../branding'
import { EmbedMode } from '../embed-mode.enum'
import Event from '../event'
import Meta from '../meta'
import { Navigation } from '../navigation'
import Page from '../page/page'
import { PageType } from '../page/page-type.enum'
import { Pages } from '../page/pages.interface'
import { EndPage } from '../page/pages/end-page'
import Form from '../page/pages/form'
import MultiChoice from '../page/pages/multi-choice'
import PictureChoice from '../page/pages/picture-choice'
import Poster from '../page/pages/poster'
import RateIt from '../page/pages/rate-it'
import StartPage from '../page/pages/start-page'
import SummaryPage from '../page/pages/summary-page'
import { Maybe } from '../types'
import { EngageformType } from './engageform-type.enum'
import SendAnswerCallback from './send-answer-callback'
import Settings from './settings'
import Tabs from './tabs'
import Texts from './texts'
import { Theme } from './theme'

export default class Engageform {
  private _engageformId: string
  private _pages: Pages = {}

  private _startPages: string[] = []
  private _endPages: string[] = []
  private _availablePages: string[] = []
  private _hasForms: boolean = false

  public sendAnswerCallback: SendAnswerCallback

  enabled: boolean = true
  type = EngageformType.Undefined
  title: string
  message!: string
  settings: Settings
  theme: Theme
  branding: Branding
  tabs: Tabs
  themeType: string
  embedSettings: EmbedSettings

  texts: Texts

  current!: Page
  navigation: Navigation
  meta: Meta

  answers = new Map<string, string | number | {[key: string]: string}>()

  event: Event

  mode: EmbedMode

  showGoogleAds: boolean

  get id(): string {
    return this._engageformId
  }

  get pages(): Pages {
    return this._pages
  }

  get startPages(): string[] {
    return this._startPages
  }

  get endPages(): string[] {
    return this._endPages
  }

  get availablePages(): string[] {
    return this._availablePages
  }

  get typeName(): string {
    return EngageformType[this.type].toLowerCase()
  }

  /**
   * @public
   * @description
   * Returns boolean information about the presence of form-type in the current engageform.
   *
   * @returns {boolean} Are there any form-type questions?
   */
  get hasForms(): boolean {
    return this._hasForms
  }

  getPageById(id: string): Maybe<Page> {
    return this.pages[id]
  }

  getPageByIndex(index: number): Maybe<Page> {
    return this.pages[this.availablePages[index]]
  }

  getPageIndex(page: Page): number {
    return this.availablePages.indexOf(page.id)
  }

  /**
   * @public
   * @description
   * Checks if the current engageform is of provided type. Takes Types enum as an argument.
   *
   * @param {Type} type Engageform type from the Type enum.
   * @returns {boolean} Is it?
   */
  isType(type: EngageformType): boolean {
    return this.type === type
  }

  /**
   * Informs if the quiz is currently in a "normal" mode, so all features should work as intended.
   * Normal mode means either default or preview mode.
   *
   * One of the feature that depends on this mode is the availability of start and end pages.
   *
   * @returns {Boolean}
   */
  isNormalMode(): boolean {
    return Boolean(this.mode === EmbedMode.Default || this.mode === EmbedMode.Preview)
  }

  /**
   * Informs if the quiz works in the summary mode.
   * @returns {Boolean} Is summary mode?
   */
  isSummaryMode(): boolean {
    return Boolean(this.mode === EmbedMode.Summary)
  }

  /**
   * Informs if the quiz works in the results mode.
   * @returns {Boolean} Is results mode?
   */
  isResultsMode(): boolean {
    return Boolean(this.mode === EmbedMode.Result)
  }

  /**
   * Informs if the quiz works in the preview mode.
   * @returns {Boolean} Is preview mode?
   */
  isPreviewMode(): boolean {
    return Boolean(this.mode === EmbedMode.Preview)
  }

  constructor(data: Quiz, mode: EmbedMode, pages: QuizQuestion[], embedSettings: EmbedSettings,
              sendAnswerCallback: SendAnswerCallback = () => {
              }) {

    this._engageformId = data._id
    this.mode = mode
    this.embedSettings = embedSettings

    this.sendAnswerCallback = sendAnswerCallback

    this.title = data.title
    this.settings = new Settings(data)
    this.theme = new Theme(data, embedSettings)
    this.tabs = new Tabs(data)

    this.texts = data.texts

    this.themeType = this.getThemeType(data.theme.backgroundColor)

    this.event = new Event()

    this.branding = Branding.create(data.settings && data.settings.branding)

    this.showGoogleAds = data.showGoogleAds

    // Handle pages creation.
    let builtPages = this.buildPages(pages || [], this.settings)

    // Store the pages on the instance.
    builtPages.forEach(page => this.storePage(page))

    // Does the quiz have any form-type pages?
    this._hasForms = builtPages.some(page => page.type === PageType.Form)

    // Create meta objects.
    const withLogic = ((data as any).skipLogic) && ((data as any).skipLogic) !== '{}'
    if (withLogic) {
      this.navigation = ConditionalNavigation.fromEnageformAndData(this, data)
    } else {
      this.navigation = Navigation.fromEnageform(this)
    }
    this.meta = Meta.fromEngageform(this)
  }

  // Made by Masters
  setUserIdent(id: any) {
    Bootstrap.user.sessionId = id
  }

  // Made by Masters
  getUserIdent(id: any) {
    return Bootstrap.user.sessionId
  }

  /**
   * Stores a single page on the quiz instance.
   *
   * There are two type of stores. One stores only the IDs and start and end pages are stored in different
   * collections. There's also a general collection for all pages where instances are held.
   *
   * Start and end pages are not stored in the summary mode.
   *
   * @param page The page to be stored.
   * @returns {Page.Page} The same page.
   */
  storePage(page: Page): Page {
    if (page.type === PageType.StartPage) {
      if (this.isNormalMode() || this.isSummaryMode()) {
        this._startPages.push(page.id)
      }
    } else if (page.type === PageType.EndPage) {
      if (this.isNormalMode() || this.isSummaryMode()) {
        this._endPages.push(page.id)
      }
    } else {
      this._availablePages.push(page.id)
    }

    this._pages[page.id] = page

    return page
  }

  /**
   * Initialises a single page that will take place of the current one.
   *
   * @param page Page data for creating the page's instance.
   * @returns {Page.Page} Built page.
   */
  initPage(page: QuizQuestion): Page {
    // Build and store the page.
    this.storePage(this.buildPages([page], this.settings)[0])

    // Set the currently visible page.
    return this.setCurrent(page._id)
  }

  /**
   * Sets the currently visible page by finding it by ID.
   *
   * @param pageId Page's ID to show.
   * @returns {IPage} The visible page.
   */
  setCurrent(pageId: string): Page {
    let page = this._pages[pageId]
    this.current = page
    return page
  }

  setCurrentEndPage(): angular.IPromise<QuizFinish> {
    var url = Bootstrap.config.backend.domain + Bootstrap.getConfig('engageform').engageformFinishUrl
    url = url.replace(':engageformId', this._engageformId)

    if (Bootstrap.mode !== EmbedMode.Default) {
      url += '?preview'
    }

    return Bootstrap.$http.post<QuizFinish>(url, {
      userIdent: Bootstrap.user.sessionId,
      globalUserIdent: Bootstrap.user.id
    }).then((res: angular.IHttpResponse<QuizFinish>) => {
      if ([200, 304].indexOf(res.status) !== -1) {
        Bootstrap.localStorage.clearAll()
        Bootstrap.user.id = res.data.globalUserIdent
        return res.data
      }

      return Bootstrap.$q.reject(res)
    })
  }

  cleanPages(): void {
    this._availablePages.length = 0
    this._pages = {}
  }

  /**
   * Builds pages from data delegating the construction to this.createPage method and
   * filters out possibly unsupported pages.
   *
   * @param pages Array with pages data.
   * @param settings this.settings of the current quiz.
   * @returns {Page.Page[]} Array of pages.
   */
  buildPages(pages: QuizQuestion[], settings: Settings): Page[] {
    return pages

    // Construct page instances.
      .map((page: QuizQuestion) => this.createPage(page, settings))

      // Filter no-values since there might have been unsupported types.
      .filter(val => Boolean(val))
  }

  /**
   * Creates a single page. If the type is not supported (ie. doesn't have a constructor) will return undefined.
   *
   * @param page Pages data.
   * @param settings this.settings.
   * @returns {Page.Page|void} Page instance or undefined if unsupported type.
   */
  createPage(page: QuizQuestion, settings: Settings): Page {
    switch (page.type) {
      case PageType.EndPage:
        return new EndPage(this, page, settings)
      case PageType.Form:
        return new Form(this, page)
      case PageType.MultiChoice:
        return new MultiChoice(this, page)
      case PageType.PictureChoice:
        return new PictureChoice(this, page)
      case PageType.Rateit:
        return new RateIt(this, page)
      case PageType.StartPage:
        return new StartPage(this, page)
      case PageType.Poster:
        return new Poster(this, page)
      default:
        throw new Error('Trying to construct an unknown page.')
    }
  }

  /**
   * Takes the results data and applies them on the pages.
   * @param results
   */
  setSummary(results: Result[]) {
    results.forEach((questionResults: Result) => {
      if (questionResults.stats && this._pages[questionResults.stats.questionId]) {
        this._pages[questionResults.stats.questionId].setResults(questionResults)
      }
    })
  }

  /**
   * In results mode, sets the user picked answers on the pages.
   * @param questions
   */
  setAnswers({questions}: { questions: { [index: string]: Answer } }): void {
    for (let questionId in questions) {
      if (this._pages[questionId]) {
        let props = questions[questionId]
        this._pages[questionId].selectAnswer({
          selectedCaseId: props.selectedAnswerId,
          inputs: props.inputs,
          selectedValue: props.rateItValue
        })
      }
    }
  }

  setResultPage(stats: EndStats[]) {
    const data: QuizQuestion = {
      _id: 'summaryPage',
      type: PageType.SummaryPage,
      // @ts-ignore
      settings: {
        showCorrectAnswer: true,
      },
      stats
    }

    const resultPage = new SummaryPage(this, data)

    this.storePage(resultPage)
  }

  /**
   * Creates a page showing user's outcome or score in adequate quiz types. Used only in the results-preview mode.
   * @param data
   */
  setUserResultPage(data: any) {
    const pageData: QuizQuestion = {
      _id: 'RESULT_PAGE',
      // @ts-ignore
      type: 'summaryPage',
      // @ts-ignore
      settings: {}
    }

    if (data.type === 'outcome') {
      extend(pageData, {
        text: 'User\'s outcome: ' + data.outcome
      })
    } else if (data.type === 'calculator') {
        extend(pageData, {
          text: 'User\'s score: ' + data.score
        })
    } else {
      extend(pageData, {
        text: 'User\'s score: ' + data.score + ' / ' + data.maxScore
      })
    }

    const resultPage = new SummaryPage(this, pageData)

    this.storePage(resultPage)
  }

  setAnswer(pageId: string, answerValue: {[key: string]: string | number | {[key: string]: string}}) {
    const value =
      get(answerValue, 'selectedCaseId') as string ||
      get(answerValue, 'selectedValue') as number ||
      answerValue as {[key: string]: string}
    this.answers.set(pageId, value)
  }

  getThemeType(color: any) {
    const colorRGB = this.colorToRgb(color)

    if ((colorRGB.red * 0.299 + colorRGB.green * 0.587 + colorRGB.blue * 0.114) > 186) {
      return 'light'
    } else {
      return 'dark'
    }
  }

  colorToRgb(color: any) {
    let triplets
    if (color[0] === '#') {
      color = color.substr(1)
    } else {
      const colorParts = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i)
      color = (colorParts && colorParts.length === 4) ? ('0' + parseInt(colorParts[1], 10).toString(16)).slice(-2) +
        ('0' + parseInt(colorParts[2], 10).toString(16)).slice(-2) +
        ('0' + parseInt(colorParts[3], 10).toString(16)).slice(-2) : ''
    }

    if (color.length === 3) {
      let temp = color
      color = ''
      temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp)
      temp = temp.slice(1)
      for (let i = 0; i < 3; i++) {
        color += temp[i] + temp[i]
      }
    }

    triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(color)

    if (!triplets) {
      throw new Error('Invalid color.')
    }

    triplets = triplets.slice(1)

    return {
      red: parseInt(triplets[0], 16),
      green: parseInt(triplets[1], 16),
      blue: parseInt(triplets[2], 16)
    }
  }
}
