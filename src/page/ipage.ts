module Page {
  export interface IPage {
    id: string;
    engageform: Engageform.IEngageform;

    type: Type;
    title: string;
    description: string;
    media: string;
    mediaWidth: number;
    mediaHeight: number;
    filled: boolean;
    settings: ISetting;
    cases: ICase[];

    image?: string;
    outcome?: string;
    button?: string;
    social?: boolean;
    exitLink?: boolean;
    link?: string;
    score?: number;
    result?: number;
    rangeMin?: number;
    rangeMax?: number;
    labelMin?: string;
    labelMax?: string;
    buttonClickSum?: number;

    send(vcase: ICase): ng.IPromise<IPageSent>;
    refreshAnswer(sent: IPageSent, question: API.IQuizQuestion): IPageSent;
    selectAnswer(data): void;
    updateAnswers(data): void;
    clickBuzzer?(): void;

    setResults(results: API.Result): void;
  }

  export interface ISocialData {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
  }
}
