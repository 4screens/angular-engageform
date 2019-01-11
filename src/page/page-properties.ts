import EngageformProperties from '../engageform/engageform-properties'
import PageSettingsProperties from './page-settings-properties'
import CaseProperties from './case-properties'

export default interface PageProperties {
  id: string;
  engageform: EngageformProperties;

  type: Type;
  title: string;
  description: string;
  media: string;
  mediaWidth: number;
  mediaHeight: number;
  filled: boolean;
  settings: PageSettingsProperties;
  cases: CaseProperties[];

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
