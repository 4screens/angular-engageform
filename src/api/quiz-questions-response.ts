import QuizQuestion from './quiz-question'

export default interface QuizQuestionsResponse {
  status: number;
  data: QuizQuestion[];
}
