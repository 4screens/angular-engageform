module Page {
  export interface IPage {
    id: string;
    engageform: Engageform.IEngageform;

    type: Type;
    title: string;
    filled: boolean;
    settings: ISetting;
    cases: ICase[];

    image?: string;
    outcome?: string;
    score?: number;
    rangeMin?: number;
    rangeMax?: number;
    labelMin?: string;
    labelMax?: string;

    send(vcase: ICase): ng.IPromise<IPageSent>;
    selectAnswer(data): void;
  }
}
