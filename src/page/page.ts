import angular from 'angular'
import { isUndefined } from 'lodash'
import QuizQuestion from '../api/quiz-question.interface'
import Result from '../api/result.interface'
import Bootstrap from '../bootstrap'
import Engageform from '../engageform/engageform'
import { MaybeNumber } from '../types'
import Case from './case'
import PageSentProperties from './page-sent.interface'
import PageSettings from './page-settings'
import PageSettingsProperties from './page-settings-properties'
import { PageType } from './page-type.enum'

export default abstract class Page {
  static Type = PageType

  readonly id: string
  readonly engageform: Engageform

  type: PageType = PageType.Undefined
  title = ''
  description = ''
  media = ''
  mediaWidth = 0
  mediaHeight = 0
  mediaUrl = ''
  mediaFileWidth = 0
  mediaFileHeight = 0
  filled = false
  settings: PageSettingsProperties
  cases: Case[] = []
  result: MaybeNumber

  protected constructor(engageform: Engageform, data: QuizQuestion) {
    this.id = data._id
    this.engageform = engageform

    this.settings = <PageSettingsProperties>new PageSettings(data)
    this.title = data.text || ''

    if (this.settings.showDescription) {
      this.description = data.description || ''
    }

    if (this.settings.showMainMedia && data.imageData) {
      this.media = Bootstrap.cloudinary.prepareImageUrl(
        data.imageFile,
        680, // zakładamy że media zawsze ma taką szerokość (MUST BE FIXXXXXED!!!!!)
        data.imageData
      )
      this.mediaUrl = data.imageFileUrl;
      this.mediaWidth = 680
      if (data.imageFileData) {
        this.mediaFileWidth = data.imageFileData.width;
        this.mediaFileHeight = data.imageFileData.height;
      }
      if (data.imageData.containerRatio) {
        this.mediaHeight = Math.round(680 * data.imageData.containerRatio)
      } else {
        this.mediaHeight = Math.round(data.imageData.containerHeight || 0)
      }
    }
  }

  send(vcase: Case): ng.IPromise<PageSentProperties> {
    if (this.engageform.enabled === false) {
      return Bootstrap.$q.reject('Engageform already ended.')
    }

    if (vcase) {
      return vcase.send()
    } else {
      let deferred = Bootstrap.$q.defer()
      deferred.resolve()
      return deferred.promise
    }
  }

  sent(): ng.IPromise<PageSentProperties> {
    const deferred = Bootstrap.$q.defer()
    let sent = <PageSentProperties>{}

    sent = <PageSentProperties>(Bootstrap.localStorage.get('page.' + this.id) || {})
    this.engageform.setAnswer(this.id, sent as any)

    if (this.settings.showResults && sent.results) {
      this.getStatsById(this.id).then((data: QuizQuestion) => {
        deferred.resolve(this.refreshAnswer(sent, data))
      }).catch(() => {
        deferred.resolve(sent)
      })
    } else {
      deferred.resolve(sent)
    }

    return deferred.promise
  }

  refreshAnswer(sent: PageSentProperties, question: QuizQuestion): PageSentProperties {
    // "abstract"
    return sent
  }

  selectAnswer(data: any): void {
    // "abstract"
  }

  createCase(data: any, symbol?: any): void | Case {
    // "abstract
    return
  }

  /**
   * Sets the provided results on the page's cases.
   * @param results Object containing data with results that should be set on the cases.
   */
  setResults(results: Result) {
    let casesWithResults = this.cases.map((singleCase: Case) => {
      // Set's the result on the case. Side effect, but makes the whole method a bit faster. Otherwise there
      // would be a need for more loops when creating fake answers.
      singleCase.result = Number(results.stats && results.stats[singleCase.id]) || 0

      // Returns the ID of the case so there's no need to loop them later
      return singleCase.id
    })

    // Create fake cases when there's a result but no answer for that.
    for (let k in results.stats) {
      if (casesWithResults.indexOf(k) === -1
        // There's the questionId in the API…
        && k !== 'questionId'

        // Don't create the case for rateits.
        && this.type !== PageType.Rateit) {

        // Create the fake answer to show results…
        let fakeCase: Case = <Case>this.createCase({
          text: '[Removed answer]',
          _id: k,
          imageData: {
            // Comes from the backend by default.
            height: 100
          }
        })

        // … and set those results…
        fakeCase.result = Number(results.stats[fakeCase.id])

        // … and add them to the answers pool.
        this.cases.push(fakeCase)
      }
    }
  }

  updateAnswers(data: any): void {
    if (this.id !== data.questionId) {
      return
    }

    if (this.engageform.current && !isUndefined(data.avg)) {
      this.engageform.current.result = data.avg
    }

    Bootstrap.$timeout(() => {
      this.cases.map((vcase: Case) => {
        if (!isUndefined(data[vcase.id])) {
          const loaded = vcase.load()
          if (loaded.results) {
            loaded.results[vcase.id] = data[vcase.id]
            vcase.save(loaded)
          }

          vcase.result = data[vcase.id] || 0
        }
      })
    })
  }

  private getStatsById(pageId: any): angular.IPromise<QuizQuestion> {
    let url = Bootstrap.config.backend.domain + Bootstrap.getConfig('engageform').pageStatsUrl
    url = url.replace(':pageId', pageId)

    return Bootstrap.$http.get<QuizQuestion>(url).then((res) => {
      if ([200, 304].indexOf(res.status) !== -1) {
        return res.data
      } else {
        return Bootstrap.$q.reject(res)
      }
    })
  }
}
