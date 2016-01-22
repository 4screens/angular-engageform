/// <reference path="iengageform.ts" />
/// <reference path="isendanswercallback.ts" />

module Engageform {
  export class Engageform implements IEngageform {
    private _engageformId: string;
    private _pages: Page.IPages = {};

    private _startPages: string[] = [];
    private _endPages: string[] = [];
    private _availablePages: string[] = [];
    private _hasForms: boolean = false;

    public sendAnswerCallback: ISendAnswerCallback;

    enabled: boolean = true;
    type: Type = Type.Undefined;
    title: string;
    message: string;
    settings: Settings;
    theme: Theme;
    branding: Branding.Branding;
    tabs: Tabs;
    themeType: string;

    current: Page.IPage;
    navigation: Navigation.INavigation;
    meta: Meta.IMeta;

    event: Util.Event;

    mode: Engageform.Mode;

    static pagesConsturctors;

    get id(): string {
      return this._engageformId;
    }

    get pages(): Page.IPages {
      return this._pages;
    }

    get startPages(): string[] {
      return this._startPages;
    }

    get endPages(): string[] {
      return this._endPages;
    }

    get availablePages(): string[] {
      return this._availablePages;
    }

    get typeName(): string {
      return Type[this.type].toLowerCase();
    }

    /**
     * @public
     * @description
     * Returns boolean information about the presence of form-type in the current engageform.
     *
     * @returns {boolean} Are there any form-type questions?
     */
    get hasForms(): boolean {
      return this._hasForms;
    }

    /**
     * @public
     * @description
     * Checks if the current engageform is of provided type. Takes Types enum as an argument.
     *
     * @param {Type} type Engageform type from the Type enum.
     * @returns {boolean} Is it?
     */
    isType(type: Type): boolean {
      return this.type === type;
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
      return Boolean(this.mode === Mode.Default || this.mode === Mode.Preview);
    }

    /**
     * Informs if the quiz works in the summary mode.
     * @returns {Boolean} Is summary mode?
     */
    isSummaryMode(): boolean {
      return Boolean(this.mode === Mode.Summary);
    }

    /**
     * Informs if the quiz works in the results mode.
     * @returns {Boolean} Is results mode?
     */
    isResultsMode(): boolean {
      return Boolean(this.mode === Mode.Result);
    }

    /**
     * Informs if the quiz works in the preview mode.
     * @returns {Boolean} Is preview mode?
     */
    isPreviewMode(): boolean {
      return Boolean(this.mode === Mode.Preview);
    }

    constructor(data: API.IQuiz, pages: API.IPages, mode: Engageform.Mode,
                sendAnswerCallback: ISendAnswerCallback = () => {}) {
      // As always, due to the initialisation drama, those values are only available about now.
      Engageform.pagesConsturctors = {
        multiChoice: Page.MultiChoice,
        pictureChoice: Page.PictureChoice,
        rateIt: Page.Rateit,
        forms: Page.Form,
        startPage: Page.StartPage,
        endPage: Page.EndPage,
        buzzer: Page.Buzzer,
        poster: Page.Poster
      };

      this._engageformId = data._id;
      this.mode = mode;

      this.sendAnswerCallback = sendAnswerCallback;

      this.title = data.title;
      this.settings = new Settings(data);
      this.theme = new Theme(data);
      this.tabs = new Tabs(data);

      this.themeType = this.getThemeType(data.theme.backgroundColor);

      this.event = new Util.Event();

      if (data.settings && data.settings.branding) {
        this.branding = new Branding.Branding(data.settings.branding);
      } else {
        this.branding = new Branding.Branding({});
      }

      // Handle pages creation.
      let builtPages = this.buildPages(pages, this.settings);

      // Store the pages on the instance.
      builtPages.forEach(page => this.storePage(page));

      // Does the quiz have any form-type pages?
      this._hasForms = builtPages.some(page => page.type === Page.Type.Form);

      // Create meta objects.
      this.navigation = new Navigation.Navigation(this);
      this.meta = new Meta.Meta(this);
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
    storePage(page: Page.Page): Page.Page {
      if (page.type === Page.Type.StartPage) {
        if (this.isNormalMode()) {
          this._startPages.push(page.id);
        }
      } else if (page.type === Page.Type.EndPage) {
        if (this.isNormalMode()) {
          this._endPages.push(page.id);
        }
      } else {
        this._availablePages.push(page.id);
      }

      this._pages[page.id] = page;

      return page;
    }

    /**
     * Initialises a single page that will take place of the current one.
     *
     * @param page Page data for creating the page's instance.
     * @returns {Page.Page} Built page.
     */
    initPage(page: API.IQuizQuestion): Page.IPage {
      // Build and store the page.
      this.storePage(this.buildPages([page], this.settings)[0]);

      // Set the currently visible page.
      return this.setCurrent(page._id);
    }

    /**
     * Sets the currently visible page by finding it by ID.
     *
     * @param pageId Page's ID to show.
     * @returns {IPage} The visible page.
     */
    setCurrent(pageId: string): Page.IPage {
      let page = this._pages[pageId];
      this.current = page;
      return page;
    }

    setCurrentEndPage(): ng.IPromise<API.IQuizFinish> {
      var url = Bootstrap.config.backend.domain + Bootstrap.config.engageform.engageformFinishUrl;
          url = url.replace(':engageformId', this._engageformId);

      if (Bootstrap.mode !== Mode.Default) {
        url += '?preview';
      }

      return Bootstrap.$http.post(url, {
        userIdent: Bootstrap.user.sessionId,
        globalUserIdent: Bootstrap.user.id
      }).then(function (res: API.IQuizFinishResponse) {
        if ([200, 304].indexOf(res.status) !== -1) {
          Bootstrap.localStorage.clearAll();
          Bootstrap.user.id = res.data.globalUserIdent;
          return res.data;
        }

        return this.$q.reject(res);
      });
    }

    cleanPages(): void {
      this._availablePages.length = 0;
      this._pages = {};
    }

	  /**
     * Builds pages from data delegating the construction to this.createPage method and
     * filters out possibly unsupported pages.
     *
     * @param pages Array with pages data.
     * @param settings this.settings of the current quiz.
     * @returns {Page.Page[]} Array of pages.
	   */
    buildPages(pages: API.IPages, settings: Settings): Page.Page[]  {
      return pages

        // Construct page instances.
        .map((page: API.IQuizQuestion) => this.createPage(page, settings))

        // Filter no-values since there might have been unsupported types.
        .filter(val => Boolean(val));
    }

	  /**
     * Creates a single page. If the type is not supported (ie. doesn't have a constructor) will return undefined.
     *
     * @param page Pages data.
     * @param settings this.settings.
     * @returns {Page.Page|void} Page instance or undefined if unsupported type.
     */
    createPage(page: API.IQuizQuestion, settings: Settings): Page.Page {
      if (Engageform.pagesConsturctors[page.type]) {
        return new Engageform.pagesConsturctors[page.type](this, page, settings);
      }
    }

    /**
     * Takes the results data and applies them on the pages.
     * @param results
     */
    setSummary(results: API.Result[]) {
      results.forEach((questionResults: API.Result) => {
        if (this._pages[questionResults.stats.questionId]) {
          this._pages[questionResults.stats.questionId].setResults(questionResults);
        }
      });
    }

    /**
     * In results mode, sets the user picked answers on the pages.
     * @param questions
     */
    setAnswers({ questions }: { questions: { [index: string]: API.Answer } }): void {
      for (let questionId in questions) {
        if (this._pages[questionId]) {
          let props = questions[questionId];
          this._pages[questionId].selectAnswer({
            selectedCaseId: props.selectedAnswerId,
            inputs: props.inputs,
            selectedValue: props.rateItValue
          });
        }
      }
    }

    setResultPage(stats: API.EndStats[]) {
      let data = {
        _id: 'summaryPage',
        type: 'summaryPage',
        settings: {
          showCorrectAnswer: true
        },
        stats
      };

      let resultPage = new Page.SummaryPage(this, <API.IQuizQuestion>data);

      this.storePage(resultPage);
    }

    getThemeType(color ) {
      const colorRGB = this.colorToRgb( color );

      if ((colorRGB.red * 0.299 + colorRGB.green * 0.587 + colorRGB.blue * 0.114) > 186) {
        return 'light';
      } else {
        return 'dark';
      }
    }

    colorToRgb( color ) {
      let colorParts, temp, triplets;
      if (color[0] === '#') {
        color = color.substr( 1 );
      } else {
        colorParts = color.match( /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i );
        color = ( colorParts && colorParts.length === 4 ) ? ( '0' + parseInt( colorParts[1], 10 ).toString( 16 ) ).slice( -2 ) +
        ('0' + parseInt( colorParts[2], 10 ).toString( 16 ) ).slice( -2 ) +
        ('0' + parseInt( colorParts[3], 10 ).toString( 16 ) ).slice( -2 ) : '';
      }

      if (color.length === 3) {
        temp = color;
        color = '';
        temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec( temp ).slice( 1 );
        for (let i = 0; i < 3; i++) {
          color += temp[i] + temp[i];
        }
      }

      triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec( color ).slice( 1 );

      return {
        red: parseInt( triplets[0], 16 ),
        green: parseInt( triplets[1], 16 ),
        blue: parseInt( triplets[2], 16 )
      };
    }
  }
}
