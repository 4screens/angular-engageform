module Engageform {
  export interface IEngageform {
    sendAnswerCallback: ISendAnswerCallback;

    enabled: boolean;
    type: Type;
    title: string;
    settings: ISetting;
    theme: ITheme;
    tabs: ITabs;
    branding: Branding.IBranding;
    meta: Meta.IMeta;

    current: Page.IPage;
    message: string;
    navigation: Navigation.INavigation;

    pages: Page.IPages;
    startPages: string[];
    endPages: string[];
    availablePages: string[];
    hasForms: boolean;

    typeName: string;
    id: string;

    isType(type: Type): boolean;

    initPages(): ng.IPromise<IEngageform>;
    setCurrent(pageId: string);
    setCurrentEndPage(): ng.IPromise<API.IQuizFinish>;
  }

  export interface IEngageformInstances {
    [index: string]: ng.IPromise<Engageform.IEngageform>;
  }
}
