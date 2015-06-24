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
    button?: string;
    social?: boolean;
    score?: number;
    result?: number;
    rangeMin?: number;
    rangeMax?: number;
    labelMin?: string;
    labelMax?: string;

    send(vcase: ICase): ng.IPromise<IPageSent>;
    selectAnswer(data): void;
  }
}
