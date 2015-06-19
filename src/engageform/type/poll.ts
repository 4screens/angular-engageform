module Engageform {
  export class Poll extends Engageform {
    type = Type.Poll;

    setCurrentEndPage(): ng.IPromise<API.IQuizFinish> {
      return super.setCurrentEndPage().then((data) => {
        if (this.endPages.length) {
          this.setCurrent(this.endPages[0]);
        } else {
          this.message = 'Thank you!';
        }

        return data;
      });
    }
  }
}
