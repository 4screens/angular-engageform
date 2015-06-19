module Page {
  export interface ICase {
    id: string;
    page: IPage;
    type: CaseType;

    selected?: boolean;
    correct?: boolean;
    incorrect?: boolean;

    title?: string;
    image?: string;
    expectedValue?: string;
    value?: string;
    error?: string;
    ordinal?: number;

    send($event): void;
    validate(): boolean;
  }
}
