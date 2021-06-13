import angular from 'angular'
import Bootstrap from './bootstrap'
import Engageform from './engageform/engageform'
import { EngageformType } from './engageform/engageform-type.enum'
import Texts from './engageform/texts'
import Case from './page/case'
import Page from './page/page'
import { Nullable } from './types'
import {PageType} from "./page/page-type.enum";
import MultiChoice from "./page/pages/multi-choice";
import PictureChoice from "./page/pages/picture-choice";

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

    // Send the answer.
    return current.send(vcase).then(() => {
      this.sendMessage()

      var multichoice = undefined

      if(current.type === PageType.MultiChoice){
        multichoice = current as MultiChoice
      }

      if(current.type === PageType.PictureChoice){
        multichoice = current as PictureChoice
      }

      //Answer is required, so at least 1 answer should be selected or filled flag has be set to true
      if ( !vcase && (!current.filled || current.settings.allowMultipleChoice && multichoice.selectedItemsCount === 0) && current.settings.requiredAnswer) {
        if (!opts.quiet) {
          this.sendMessage(this._engageform.texts.ANSWER_REQUIRED_TO_PROCEED)
        }
        return vcase
      }

      //If user unselect all answers than we need to stay on the same question
      if(vcase && current.filled && multichoice && multichoice.selectedItemsCount===0 && !current.settings.requiredAnswer) {
        //do nothing because user has unselected all previously selected answers
        return vcase
      }

      //If user selected answer and allowMultipleChoice=true than we want to stay on the same page until OK is clicked
      if(vcase && current.settings.allowMultipleChoice){
        //if selected any answer then we do not move to next question
        return vcase
      }

      //Answer is not required and allowMultipleChoice=false and user use arrow on the right side to navigate do next question
      if(!vcase && !current.settings.requiredAnswer && !current.settings.allowMultipleChoice) {
        this.move(vcase)
        return vcase
      }

      //Answer is not required and allowMultipleChoice=true and there is zero selected answers and user use arrow on the right side to navigate do next question
      if(!vcase && !current.settings.requiredAnswer && current.settings.allowMultipleChoice && multichoice && multichoice.selectedItemsCount === 0) {
        this.move(vcase)
        return vcase
      }

      //if allowMultipleChoice=true and user selected some answers and user click OK(or right arrow) and there is less
      // answers selected than minAnswersCount then we want to print error message
      if (!vcase && current.settings.allowMultipleChoice && multichoice && multichoice.selectedItemsCount < current.settings.minAnswersCount ) {
        if (!opts.quiet) {
          this.sendMessage(this._engageform.texts.MORE_ANSWERS_REQUIRED_TO_PROCEED)
        }
        return vcase
      }

      // Made by Masters (only the timeout change from 2000 to 1000).
      // Change the page with a slight delay, or do it instantly.
      let pageChangeDelay = vcase ? (current.settings.showCorrectAnswer || current.settings.showResults ? 1000 : 200) : 0

      // Schedule the page change.
      this.waitingForPageChange = Bootstrap.$timeout(() => {
        this.waitingForPageChange = null
        this.move(vcase)
        return vcase
      }, pageChangeDelay)

      return this.waitingForPageChange

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
    if (step > -1 && this._engageform.availablePages.length >= this.position) {
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
          this._engageform.event.trigger('finish::endPage')
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
