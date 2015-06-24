module Engageform {
  export interface IEngageform {
    type: Type;
    mode: Mode;
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

    setCurrent(pageId: string);
    setCurrentEndPage(): void;
  }
}
