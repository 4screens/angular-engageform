module Engageform {
  export interface IEngageform {
    type: Type;
    title: string;
    settings: ISetting;
    theme: ITheme;

    current: Page.IPage;
    message: string;
    navigation: Navigation.INavigation;

    pages: Page.IPages;
    startPages: string[];
    endPages: string[];
    availablePages: string[];

    initPages(): ng.IPromise<IEngageform>;
    setCurrent(pageId: string);
    setCurrentEndPage(): void;
  }
}
