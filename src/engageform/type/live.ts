module Engageform {
  export class Live extends Engageform {
    type = Type.Live;

    initPages(pages: <IPage>[]) {
      this.buildPages(pages);
      this.setCurrent(pages[0]._id);
    };
    initNav() {};
    getById() {};
  }
}
