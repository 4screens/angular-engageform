import QuizQuestion from './quiz-question.interface'

export default interface QuizQuestionsResponse {
  status: number
  data: QuizQuestion[]
}
