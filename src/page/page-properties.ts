import QuizQuestion from '../api/quiz-question.interface'
import Result from '../api/result.interface'
import EngageformProperties from '../engageform/engageform-properties'
import Case from './case'
import CaseProperties from './case-properties'
import PageSentProperties from './page-sent.interface'
import PageSettingsProperties from './page-settings-properties'
import { PageType } from './page-type.enum'

export default interface PageProperties {
  id: string;
  engageform: EngageformProperties;

  type: PageType;
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

  send(vcase: Case): angular.IPromise<PageSentProperties>;

  refreshAnswer(sent: PageSentProperties, question: QuizQuestion): PageSentProperties;

  selectAnswer(data: any): void;

  updateAnswers(data: any): void;

  clickBuzzer?(): void;

  setResults(results: Result): void;
}
