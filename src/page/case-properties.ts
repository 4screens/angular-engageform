import { CaseType } from './case-type.enum'
import Page from './page'
import PageSentProperties from './page-sent.interface'

export default interface CaseProperties {
  id: string;
  page: Page;
  type: CaseType;

  result?: number;
  selected?: boolean;
  correct?: boolean;
  incorrect?: boolean;

  title?: string;
  media?: string;
  mediaWidth?: number;
  mediaHeight?: number;
  expectedValue?: string;
  value?: string;
  error?: string;
  ordinal?: number;
  buttonClickSum?: number;

  trueBuzzerSend?(BCS: number): void;

  send(): angular.IPromise<PageSentProperties>;

  validate(): boolean;

  load(): PageSentProperties;

  save(data: PageSentProperties): void;
}
