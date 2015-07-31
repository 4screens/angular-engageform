module Liveevent {
  export interface ILiveevent {
    enabled: boolean;
    title: string;
    activePage: Page.IPage;
    activeQuiz: Page.IEngageform;
    activePageId: string;
    activeQuizId: string;

    init(id: string): ng.IPromise<ILiveevent>;
    // changePage(pageId: string): ng.IPromise<IQuestion>;
  }
}
