import angular from 'angular'
import Bootstrap from './bootstrap'
import Engageform from './engageform/engageform'
import { EngageformType } from './engageform/engageform-type.enum'
import Texts from './engageform/texts'
import Case from './page/case'
import Page from './page/page'
import { Nullable } from './types'

export class Navigation {
  static fromEnageform(engageform: Engageform): Navigation {
    return new Navigation(engageform)
  }

  protected _engageform: Engageform
  protected visitedPages: Page[] = []

  enabled: boolean = false
  position: number = 0
  size: number = 0
  hasStart: boolean = false
  enabledStart: boolean = true
  hasPrev: boolean = false
  enabledPrev: boolean = true
  hasNext: boolean = false
  enabledNext: boolean = true
  hasFinish: boolean = false
  enabledFinish: boolean = true
  distance: number = 0
  animate: string = 'swipeNext'

  hasStartPages: boolean = false
  hasEndPages: boolean = false

  waitingForPageChange: Nullable<angular.IPromise<Case>> = null

  constructor(engageform: Engageform) {
    this._engageform = engageform

    this.size = engageform.availablePages.length
    this.hasEndPages = Boolean(engageform.endPages.length)

    if (engageform.startPages.length) {
      this.hasStart = true
      this.hasStartPages = true
      this._engageform.setCurrent(engageform.startPages[0])
    } else {
      this.enabled = true
      this.move()
      this.hasPrev = false
    }
  }

  private updateDistance(): number {
    return this.distance = this.position / this.size
  }

  start($event: any): void {
    this.disableDefaultAction($event)

    this.animate = 'swipeNext'
    this.enabled = true

    // FIXME: Why would you do that? щ(°Д°щ) But I'm not removing it. Hell knows what depends on this stupidity.
    this.hasStart = false

    this.move()
    this.hasPrev = true
  }

  /**
   * Clears the page change timeout.
   */
  stopPageChange() {
    if (this.waitingForPageChange) {
      Bootstrap.$timeout.cancel(this.waitingForPageChange)
    }
  }

  prev($event: any, step = 1): void {
    this.disableDefaultAction($event)
    this.stopPageChange()
    this.animate = 'swipePrev'

    if (this._engageform.current) {
      this._engageform.message = ''
    }

    this.position -= step
    this.updateDistance()

    this.hasNext = true
    this.hasFinish = false

    if (this.position === 0) {
      this._engageform.setCurrent(this._engageform.startPages[0])
      this.hasPrev = false
    } else {
      this._engageform.setCurrent(this._engageform.availablePages[this.position - 1])
      this.hasPrev = this.position === 1 ? this.hasStartPages : true
    }
  }

  pick($event: any, vcase: Case, opts = {quiet: false}): ng.IPromise<Case> {
    this.disableDefaultAction($event)
    this.stopPageChange()
    this.animate = 'swipeNext'

    // Move page but don't do anything else when the quiz is nor in a normal mode.
    if (!this._engageform.isNormalMode()) {
      let defer = Bootstrap.$q.defer<Case>()
      defer.resolve(vcase)
      this.move(vcase)
      return defer.promise
    }

    let current = this._engageform.current

    // Made by Masters
    // (Mat fixed a bug: was `current._engageform.settings` the `current` doesn't have a `settings` property.
    // Check answer.
    if (vcase && (this._engageform.settings.allowAnswerChange || !current.filled)) {
      vcase.selected = true
      // Made by Masters
      vcase.incorrect = false
    }

    // Send the answer.
    return current.send(vcase).then(() => {
      this.sendMessage()

      // Prevent the question change when there's no answer selected and the page requires it.
      if (!current.filled && current.settings.requiredAnswer) {
        if (!opts.quiet) {
          this.sendMessage(this._engageform.texts.ANSWER_REQUIRED_TO_PROCEED)
        }

        return vcase
      } else {
        // Change the page with a slight delay, or do it instantly.
        // Made by Masters (only the timeout change from 2000 to 1000).
        let pageChangeDelay = vcase ? (current.settings.showCorrectAnswer || current.settings.showResults ? 1000 : 200) : 0

        // Schedule the page change.
        this.waitingForPageChange = Bootstrap.$timeout(() => {
          this.waitingForPageChange = null
          this.move(vcase)
          return vcase
        }, pageChangeDelay)

        return this.waitingForPageChange
      }
    }).catch(data => {
      if (!opts.quiet) {
        this.sendMessage(this._engageform.texts[data.textKey as keyof Texts] || data.message)
      }

      return data
    })
  }

  next = this.pick
  finish = this.pick

  protected move(vcase?: Case, step = 1): void {
    this._engageform.event.trigger('form::pageWillChange', {
      // You might wonder why I'm not using this.hasStart. Well, that's because some genius decided to
      // make it false on the navigation start so it can't be used.
      isStartPage: Boolean(this.position === 0 && this._engageform.startPages.length)
    })

    this.visitedPages.push(this._engageform.current)
    this.position += step

    if (this._engageform.availablePages.length >= this.position) {
      this.updateDistance()
      this._engageform.setCurrent(this._engageform.availablePages[this.position - 1])

      this.hasPrev = true
      this.hasNext = false
      this.hasFinish = false

      if (this._engageform.availablePages.length > this.position) {
        this.hasNext = true
      } else if (this._engageform.availablePages.length === this.position) {
        // Finisher is not available when the engageform is of a type "poll" and doesn't have any form-type question.
        // Also when it's not working in normal mode (ie. summary doesn't submit).
        this.hasFinish = this._engageform.isNormalMode() &&
          !(this._engageform.isType(EngageformType.Poll) && !this._engageform.hasForms)
      }
      this._engageform.event.trigger('form::pageDidChange', {
        currentPosition: this.position,
        isEndPage: false
      });

    } else {
      this.position = this._engageform.availablePages.length
      if (!vcase) {
        this._engageform.setCurrentEndPage().then((data: any) => {
          if (this._engageform.type === EngageformType.Score || this._engageform.type === EngageformType.Outcome) {
            this._engageform.event.trigger('finish', data.totalScore || data.outcome, data.maxScore)
          }
          this.enabled = false
          this.hasPrev = false
          this.hasNext = false
          this.hasFinish = false
          this._engageform.event.trigger('form::pageDidChange', {
            currentPosition: this.position,
            isEndPage: true
          });
        }).catch((err) => {
          if (err.data.msg) {
            this.sendMessage(err.data.msg)
          }
        })
      }
    }
  }

  private disableDefaultAction($event: any) {
    if ($event) {
      $event.stopPropagation()
      $event.preventDefault()
    }
  }

  private sendMessage(msg = '') {
    this._engageform.message = msg
    Bootstrap.$timeout(() => {
      this._engageform.message = ''
    }, this._engageform.settings.hideMessageAfterDelay)
  }
}