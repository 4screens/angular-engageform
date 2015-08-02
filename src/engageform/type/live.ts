module Engageform {
  export class Live extends Engageform {
    type = Type.Live;

    initPage(page: {_id: string}) {
      this.buildPages([page]);
      this.setCurrent(page._id);
    };

    initNav() {};
  }
}
