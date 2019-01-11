export default interface EngageformProperties {
  sendAnswerCallback: ISendAnswerCallback;

  enabled: boolean;
  type: Type;
  title: string;
  settings: ISetting;
  theme: ITheme;
  tabs: ITabs;
  branding: Branding.IBranding;
  meta: Meta.IMeta;

  texts: ITexts;

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

  event: Util.Event;

  mode: Engageform.Mode;

  isType(type: Type): boolean;

  isNormalMode(): boolean;

  isSummaryMode(): boolean;

  isPreviewMode(): boolean;

  isResultsMode(): boolean;

  setCurrent(pageId: string);

  setCurrentEndPage(): ng.IPromise<API.IQuizFinish>;
}
