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

    constructor(engageform: Engageform.IEngageform) {
      this._engageform = engageform;
      this.size = engageform.availablePages.length;

      if (this._engageform.startPages.length > 0) {
        this.hasStart = true;
        this._engageform.setCurrent(this._engageform.startPages[0]);
      } else {
        this.enabled = true;
        this.move(null);
        this.hasPrev = false;
      }
    }

    start($event): void {
      this.disableDefaultAction($event);

      this.enabled = true;
      this.hasStart = false;
      this.move(null);
      this.hasPrev = false;
    }

    prev($event): void {
      this.disableDefaultAction($event);

      if (this._engageform.current) {
        this._engageform.message = '';
      }

      this.position--;
      this._engageform.setCurrent(this._engageform.availablePages[this.position - 1]);

      this.hasPrev = false;
      this.hasNext = true;
      this.hasFinish = false;

      if (this.position > 1) {
        this.hasPrev = true;
      }
    }

    pick($event, vcase: Page.ICase): void {
      this.disableDefaultAction($event);

      switch (this._engageform.mode) {
        default:
          this._engageform.current.send(vcase).then(() => {
            this.move(vcase);
          }).catch(errorMessage => {
            this._engageform.message = errorMessage;
          });
      }
    }
    next = this.pick;
    finish = this.pick;

    private move(vcase: Page.ICase): void {
      this._engageform.message = '';
      if (this._engageform.current) {
        switch (this._engageform.mode) {
          case Engageform.Mode.Default:
          case Engageform.Mode.Preview:
            if (!this._engageform.current.filled && this._engageform.current.settings.requiredAnswer) {
              this._engageform.message = 'Answer is required to proceed to next question';
              return;
            }
            break;
        }
      }

      this.position++;
      if (this._engageform.availablePages.length >= this.position) {
        this._engageform.setCurrent(this._engageform.availablePages[this.position - 1]);

        this.hasPrev = true;
        this.hasNext = false;
        this.hasFinish = false;

        if (this._engageform.availablePages.length > this.position) {
          this.hasNext = true;
        } else if (this._engageform.availablePages.length === this.position) {
          this.hasFinish = true;
        }

      } else {
        this.position = this._engageform.availablePages.length;
        if (!vcase) {
          this._engageform.setCurrentEndPage();

          this.enabled = false;
          this.hasPrev = false;
          this.hasNext = false;
          this.hasFinish = false;
        }
      }
    }

    private disableDefaultAction($event) {
      if ($event) {
        $event.stopPropagation();
        $event.preventDefault();
      }
    }
  }
}
