module Engageform {
  export interface IEngageform {
    type: Engageform.Type;
    mode: Engageform.Mode;
    title: string;
    settings: Engageform.ISetting;
    theme: Engageform.ITheme;

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
