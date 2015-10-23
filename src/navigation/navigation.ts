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
      this.hasStart = false;
      this.move(null);
      this.hasPrev = true;
    }

    prev($event): void {
      this.disableDefaultAction($event);
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

    pick($event, vcase: Page.ICase, opts = {quiet: false}): void {
      this.disableDefaultAction($event);
      this.animate = 'swipeNext';

      switch (Bootstrap.mode) {
        default:
          this._engageform.current.send(vcase).then(() => {
            this._engageform.message = '';
            if (this._engageform.current) {
              switch (Bootstrap.mode) {
                case Engageform.Mode.Default:
                case Engageform.Mode.Preview:
                  if (!this._engageform.current.filled && this._engageform.current.settings.requiredAnswer) {
                    if (!opts.quiet) {
                      this.sendMessage('Answer is required to proceed to next question');
                    }
                    return;
                  }
                  break;
              }
            }

            if (vcase) {
              Bootstrap.$timeout(() => {
                this.move(vcase);
              }, this._engageform.current.settings.showResults ? 500 : 200);
            } else {
              this.move(vcase);
            }

          }).catch(data => {
            if (!opts.quiet) {
              this.sendMessage(data.message);
            }
          });
      }
    }
    next = this.pick;
    finish = this.pick;

    private move(vcase: Page.ICase): void {
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

    private sendMessage(msg) {
      this._engageform.message = msg || '';
      Bootstrap.$timeout(() => {
        this._engageform.message = '';
      }, this._engageform.settings.hideMessageAfterDelay);
    }
  }
}
