// tslint:disable:no-console
import angular from 'angular'
import { defaults } from 'lodash'
import Embed from './api/embed.interface'
import QuizQuestion from './api/quiz-question.interface'
import { QuizType } from './api/quiz-type.enum'
import Quiz from './api/quiz.interface'
import app from './app'
import Branding from './branding'
import AppConfig from './config.interface'
import { EmbedMode } from './embed-mode.enum'
import Engageform from './engageform/engageform'
import EngageformInstances from './engageform/engageform-instances'
import { EngageformType } from './engageform/engageform-type.enum'
import Live from './engageform/form-types/live'
import Outcome from './engageform/form-types/outcome'
import Poll from './engageform/form-types/poll'
import Score from './engageform/form-types/score'
import Survey from './engageform/form-types/survey'
import { Theme } from './engageform/theme'
import Event from './event'
import isInEnum from './in-enum.util'
import Meta from './meta'
import { Navigation } from './navigation'
import Page from './page/page'
import { Maybe, MaybeString } from './types'
import User from './user'

export default class Bootstrap {
  static getConfig<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return Bootstrap.config[key]
  }

  static user = User.create()
  static $http: ng.IHttpService
  static $q: ng.IQService
  static $timeout: ng.ITimeoutService
  static cloudinary: any
  static localStorage: ng.local.storage.ILocalStorageService
  static config: AppConfig
  static mode = EmbedMode.Undefined

  private _engageform!: Engageform
  private _event: Event

  private static _instances: EngageformInstances = {}

  // Stores the constructors of quizzes mapped by names. Values are assigned in constructor because the modules
  // dependency is spaghetti-like and constructors will be undefined at this point.
  static quizzesConstructors = {
    outcome: Outcome,
    poll: Poll,
    score: Score,
    survey: Survey,
    live: Live
  }

  constructor($http: ng.IHttpService, $q: ng.IQService, $timeout: ng.ITimeoutService, cloudinary: any,
              localStorage: ng.local.storage.ILocalStorageService, ApiConfig: AppConfig) {
    Bootstrap.$http = $http
    Bootstrap.$q = $q
    Bootstrap.$timeout = $timeout
    Bootstrap.cloudinary = cloudinary
    Bootstrap.localStorage = localStorage
    Bootstrap.config = ApiConfig

    // FIXME: This is inaccessible inside the library, since it's the consumer app that creates the instance so it
    // isn't possible to actually trigger any event! I'm leaving it here because I don't care enough to check
    // if any app tries to subscribe for this event. I'm almost sure it's safe to remove, though.
    this._event = new Event()

    Bootstrap.cloudinary.setConfig(ApiConfig.cloudinary)
  }

  get type(): EngageformType {
    if (this._engageform) {
      return this._engageform.type
    }

    return EngageformType.Undefined
  }

  get Type() {
    return EngageformType
  }

  get mode(): EmbedMode {
    return Bootstrap.mode
  }

  get Mode() {
    return EmbedMode
  }

  get title(): MaybeString {
    if (this._engageform) {
      return this._engageform.title
    }
  }

  get theme(): Maybe<Theme> {
    if (this._engageform) {
      return this._engageform.theme
    }
  }

  get current(): Maybe<Page> {
    if (this._engageform) {
      return this._engageform.current
    }
  }

  get navigation(): Maybe<Navigation> {
    if (this._engageform) {
      return this._engageform.navigation
    }
  }

  get branding(): Maybe<Branding> {
    if (this._engageform) {
      return this._engageform.branding
    }
  }

  get message(): MaybeString {
    if (this._engageform) {
      return this._engageform.message
    }
  }

  get meta(): Maybe<Meta> {
    if (this._engageform) {
      return this._engageform.meta
    }
  }

  get event(): Maybe<Event> {
    if (this._event) {
      return this._event
    }
  }

  get showGoogleAds(): Maybe<boolean> {
    if (this._engageform) {
      return this._engageform.showGoogleAds
    }else{
      return false
    }
  }


  init(embedOptions: Embed): angular.IPromise<Engageform> {
    const options = defaults({}, embedOptions, {mode: EmbedMode.Default})

    // Options are required and need to have a quiz ID.
    if (!options || !options.id) {
      return Bootstrap.$q.reject({
        status: 'error',
        error: {
          code: 406,
          message: 'The required id property does not exist.'
        },
        data: options
      })
    }

    // Return already initialised instance if already exists.
    if (Bootstrap._instances[options.id]) {
      return Bootstrap._instances[options.id]
    }

    // If the requested mode is not supported, reject the initialisation.
    if (!isInEnum(EmbedMode, options.mode)) {
      return Bootstrap.$q.reject({
        status: 'error',
        error: {
          code: 406,
          message: 'Mode property not supported.'
        },
        data: options
      })
    }

    // Set the mode in which the whole library operates.
    Bootstrap.mode = options.mode

    // Create the promises map that will have to resolve before the quiz is initialised.
    let initializationPromises: [angular.IPromise<Quiz>, angular.IPromise<QuizQuestion[]>] = [
      Bootstrap.getData<Quiz>('quiz', options.id),
      // If the quiz is not live get the pages before initialising it.
      !options.live ? Bootstrap.getData<QuizQuestion[]>('pages', options.id) : Bootstrap.$q.resolve([])
    ]

    // Initialize the quiz.
    return Bootstrap.$q.all<Quiz, QuizQuestion[]>(initializationPromises).then(([quizData, questions]) => {
      // If the quiz doesn't have a supported constructor, reject the promise with error.

      if (!isInEnum(QuizType, quizData.type)) {
        return Bootstrap.$q.reject({
          status: 'error',
          error: {
            code: 406,
            message: 'Type property not supported.'
          },
          data: quizData
        })
      }

      console.log('quizData:',quizData);
      console.log('questions:',questions);
      console.log('options:',options);
      console.log('Bootstrap.mode:',Bootstrap.mode);

      // Create the Engageform's instance.
      this._engageform = new Bootstrap.quizzesConstructors[quizData.type](quizData,
        Bootstrap.mode, questions, options.embedSettings, options.callback ? options.callback.sendAnswerCallback : () => {})

      return this._engageform
    })
  }

  /**
   * Fetches the two types of data from the API: quiz data and pages data.
   */
  static getData<T extends object>(type: 'quiz' | 'pages', id: string): angular.IPromise<T> {
    // Basic validation.
    if (type !== 'quiz' && type !== 'pages') {
      throw new Error(`Resource path for ${type} type of data is unknown.`)
    }

    // Decide the data URL depending on the type.
    let url = Bootstrap.getConfig('backend').domain +
      (type === 'quiz' ? Bootstrap.getConfig('engageform').engageformUrl : Bootstrap.getConfig('engageform').engageformPagesUrl)

    // Valid ID required.
    url = url.replace(':engageformId', id)

    // Inform the backend it shouldn't store statistics when a quiz is not in a default mode.
    if (Bootstrap.mode !== EmbedMode.Default) {
      url += '?preview'
    }

    // Go, fetch the data.
    return Bootstrap.$http.get<T>(url).then((res: angular.IHttpResponse<T>) => {
      if ([200, 304].indexOf(res.status) !== -1) {
        return res.data
      } else {
        return Bootstrap.$q.reject(res)
      }
    })
  }

  destroyInstances() {
    Bootstrap._instances = {}
  }
}

Bootstrap.$inject = ['$http', '$q', '$timeout', 'cloudinary', 'localStorageService', 'ApiConfig']
app.service('Engageform', Bootstrap)
