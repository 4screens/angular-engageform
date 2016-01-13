/// <reference path="inavigation.ts" />

module Navigation {
  export class Navigation implements INavigation {
    private _engageform: Engageform.IEngageform;

    enabled: boolean = false;
    position: number = 0;
    size: number = 0;
    hasStart: boolean = false;
    enabledStart: boolean = true;
    hasPrev: boolean = false;
    enabledPrev: boolean = true;
    hasNext: boolean = false;
    enabledNext: boolean = true;
    hasFinish: boolean = false;
    enabledFinish: boolean = true;
    distance: number = 0;
    animate: string = 'swipeNext';

    hasStartPages: boolean = false;
    hasEndPages: boolean = false;

    waitingForPageChange: ng.IPromise<Page.ICase>;

    constructor(engageform: Engageform.IEngageform) {
      this._engageform = engageform;
      this.size = engageform.availablePages.length;

      this.hasEndPages = Boolean(this._engageform.endPages.length);

      if (this._engageform.startPages.length) {
        this.hasStart = true;
        this.hasStartPages = true;
        this._engageform.setCurrent(this._engageform.startPages[0]);
      } else {
        this.enabled = true;
        this.move(null);
        this.hasPrev = false;
      }
    }

    private updateDistance(): number {
      return this.distance = this.position / this.size;
    }

    start($event): void {
      this.disableDefaultAction($event);

      this.enabled = true;

      // FIXME: Why would you do that? щ(°Д°щ) But I'm not removing it. Hell knows what depends on this stupidity.
      this.hasStart = false;

      this.move(null);
      this.hasPrev = true;
    }

    /**
     * Clears the page change timeout.
     */
    stopPageChange() {
      if (this.waitingForPageChange) {
        Bootstrap.$timeout.cancel(this.waitingForPageChange);
      }
    }

    prev($event): void {
      this.disableDefaultAction($event);
      this.stopPageChange();
      this.animate = 'swipePrev';

      if (this._engageform.current) {
        this._engageform.message = '';
      }

      this.position--;
      this.updateDistance();

      this.hasNext = true;
      this.hasFinish = false;

      if (this.position === 0) {
        this._engageform.setCurrent(this._engageform.startPages[0]);
        this.hasPrev = false;
      } else {
        this._engageform.setCurrent(this._engageform.availablePages[this.position - 1]);
        this.hasPrev = this.position === 1 ? this.hasStartPages : true;
      }
    }

    pick($event, vcase: Page.ICase, opts = {quiet: false}): ng.IPromise<Page.ICase> {
      let current = this._engageform.current;

      this.disableDefaultAction($event);
      this.stopPageChange();
      this.animate = 'swipeNext';

      // Send the answer.
      return current.send(vcase).then(() => {
        this.sendMessage();

        // Prevent the question change when there's no answer selected and the page requires it.
        if (this._engageform.isDefaultMode() && !current.filled && current.settings.requiredAnswer) {
          if (!opts.quiet) {
            this.sendMessage('Answer is required to proceed to the next question.');
          }

          return vcase;
        } else {
          // Change the page with a slight delay, or do it instantly.
          let pageChangeDelay =  vcase ? (current.settings.showCorrectAnswer || current.settings.showResults ? 2000 : 200) : 0;

          // Schedule the page change.
          this.waitingForPageChange = Bootstrap.$timeout(() => {
            this.waitingForPageChange = null;
            this.move(vcase);
            return vcase;
          }, pageChangeDelay);

          return this.waitingForPageChange;
        }
      }).catch(data => {
        if (!opts.quiet) {
          this.sendMessage(data.message);
        }

        return data;
      });
    }
    next = this.pick;
    finish = this.pick;

    private move(vcase: Page.ICase): void {
      this._engageform.event.trigger('form::pageWillChange', {
        currentPosition: this.position,

        // You might wonder why I'm not using this.hasStart. Well, that's because some genius decided to
        // make it false on the navigation start so it can't be used.
        isStartPage: Boolean(this.position === 0 && this._engageform.startPages.length)
      });

      this.position++;

      if (this._engageform.availablePages.length >= this.position) {
        this.updateDistance();
        this._engageform.setCurrent(this._engageform.availablePages[this.position - 1]);

        this.hasPrev = true;
        this.hasNext = false;
        this.hasFinish = false;

        if (this._engageform.availablePages.length > this.position) {
          this.hasNext = true;
        } else if (this._engageform.availablePages.length === this.position) {
          // Finisher is not available when the engageform is of a type "poll" and doesn't have any form-type question.
          this.hasFinish = !(this._engageform.isType(Engageform.Type.Poll) && !this._engageform.hasForms);
        }

      } else {
        this.position = this._engageform.availablePages.length;
        if (!vcase) {
          this._engageform.setCurrentEndPage().then(() => {
            this.enabled = false;
            this.hasPrev = false;
            this.hasNext = false;
            this.hasFinish = false;
          }).catch((err) => {
            if (err.data.msg) {
              this.sendMessage(err.data.msg);
            }
          });
        }
      }
    }

    private disableDefaultAction($event) {
      if ($event) {
        $event.stopPropagation();
        $event.preventDefault();
      }
    }

    private sendMessage(msg = '') {
      this._engageform.message = msg;
      Bootstrap.$timeout(() => {
        this._engageform.message = '';
      }, this._engageform.settings.hideMessageAfterDelay);
    }
  }
}
