import Answer from '../api/answer.interface'
import EmbedSettings from '../api/embed-settings.interface'
import EndStats from '../api/end-stats.interface'
import QuizFinishResponse from '../api/quiz-finish-response.interface'
import QuizFinish from '../api/quiz-finish.interface'
import QuizQuestion from '../api/quiz-question.interface'
import Quiz from '../api/quiz.interface'
import Result from '../api/result.interface'
import Bootstrap from '../bootstrap'
import Branding from '../branding/branding'
import Meta from '../meta/meta'
import { Navigation } from '../navigation/navigation'
import Page from '../page/page'
import PageProperties from '../page/page-properties'
import { PageType } from '../page/page-type.enum'
import { Pages } from '../page/pages.interface'
import SummaryPage from '../page/type/summary-page'
import Event from '../util/event'
import { EngageformMode } from './engageform-mode.enum'
import EngageformProperties from './engageform-properties'
import { EngageformType } from './engageform-type.enum'
import SendAnswerCallback from './send-answer-callback'
import Settings from './settings'
import Tabs from './tabs'
import Texts from './texts'
import { Theme } from './theme'

export default class Engageform implements EngageformProperties {
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
  message: string
  settings: Settings
  theme: Theme
  branding: Branding
  tabs: Tabs
  themeType: string
  embedSettings: EmbedSettings

  texts: Texts

  current: PageProperties
  navigation: Navigation
  meta: Meta

  event: Event

  mode: EngageformMode

  static pagesConsturctors: any

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
    return Boolean(this.mode === EngageformMode.Default || this.mode === EngageformMode.Preview)
  }

  /**
   * Informs if the quiz works in the summary mode.
   * @returns {Boolean} Is summary mode?
   */
  isSummaryMode(): boolean {
    return Boolean(this.mode === EngageformMode.Summary)
  }

  /**
   * Informs if the quiz works in the results mode.
   * @returns {Boolean} Is results mode?
   */
  isResultsMode(): boolean {
    return Boolean(this.mode === EngageformMode.Result)
  }

  /**
   * Informs if the quiz works in the preview mode.
   * @returns {Boolean} Is preview mode?
   */
  isPreviewMode(): boolean {
    return Boolean(this.mode === EngageformMode.Preview)
  }

  constructor(data: Quiz, mode: EngageformMode, pages: Pages, embedSettings: EmbedSettings,
              sendAnswerCallback: SendAnswerCallback = () => {
              }) {
    // As always, due to the initialisation drama, those values are only available about now.
    Engageform.pagesConsturctors = {
      multiChoice: PageType.MultiChoice,
      pictureChoice: PageType.PictureChoice,
      rateIt: PageType.Rateit,
      forms: PageType.Form,
      startPage: PageType.StartPage,
      endPage: PageType.EndPage,
      buzzer: PageType.Buzzer,
      poster: PageType.Poster
    }

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

    // Handle pages creation.
    let builtPages = this.buildPages(pages || [], this.settings)

    // Store the pages on the instance.
    builtPages.forEach(page => this.storePage(page))

    // Does the quiz have any form-type pages?
    this._hasForms = builtPages.some(page => page.type === PageType.Form)

    // Create meta objects.
    this.navigation = Navigation.fromEnageform(this)
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
      if (this.isNormalMode()) {
        this._startPages.push(page.id)
      }
    } else if (page.type === PageType.EndPage) {
      if (this.isNormalMode()) {
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
    var url = Bootstrap.config.backend.domain + Bootstrap.config.engageform.engageformFinishUrl
    url = url.replace(':engageformId', this._engageformId)

    if (Bootstrap.mode !== EngageformMode.Default) {
      url += '?preview'
    }

    return Bootstrap.$http.post(url, {
      userIdent: Bootstrap.user.sessionId,
      globalUserIdent: Bootstrap.user.id
    }).then(function (res: QuizFinishResponse) {
      if ([200, 304].indexOf(res.status) !== -1) {
        Bootstrap.localStorage.clearAll()
        Bootstrap.user.id = res.data.globalUserIdent
        return res.data
      }

      return this.$q.reject(res)
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
  buildPages(pages: Page, settings: Settings): Page[] {
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
    if (Engageform.pagesConsturctors[page.type]) {
      return new Engageform.pagesConsturctors[page.type](this, page, settings)
    }
  }

  /**
   * Takes the results data and applies them on the pages.
   * @param results
   */
  setSummary(results: Result[]) {
    results.forEach((questionResults: Result) => {
      if (this._pages[questionResults.stats.questionId]) {
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
    let data = {
      _id: 'summaryPage',
      type: 'summaryPage',
      settings: {
        showCorrectAnswer: true
      },
      stats
    }

    let resultPage = new SummaryPage(this, <QuizQuestion>data)

    this.storePage(resultPage)
  }

  /**
   * Creates a page showing user's outcome or score in adequate quiz types. Used only in the results-preview mode.
   * @param data
   */
  setUserResultPage(data: any) {
    const pageData = {
      _id: 'RESULT_PAGE',
      type: 'summaryPage',
      settings: {}
    }

    if (data.type === 'outcome') {
      _.extend(pageData, {
        text: 'User\'s outcome: ' + data.outcome
      })
    } else {
      _.extend(pageData, {
        text: 'User\'s score: ' + data.score + ' / ' + data.maxScore
      })
    }

    let resultPage = new SummaryPage(this, <QuizQuestion>pageData)

    this.storePage(resultPage)
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
    let colorParts, temp, triplets
    if (color[0] === '#') {
      color = color.substr(1)
    } else {
      colorParts = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i)
      color = (colorParts && colorParts.length === 4) ? ('0' + parseInt(colorParts[1], 10).toString(16)).slice(-2) +
        ('0' + parseInt(colorParts[2], 10).toString(16)).slice(-2) +
        ('0' + parseInt(colorParts[3], 10).toString(16)).slice(-2) : ''
    }

    if (color.length === 3) {
      temp = color
      color = ''
      temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1)
      for (let i = 0; i < 3; i++) {
        color += temp[i] + temp[i]
      }
    }

    triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(color).slice(1)

    return {
      red: parseInt(triplets[0], 16),
      green: parseInt(triplets[1], 16),
      blue: parseInt(triplets[2], 16)
    }
  }
}
