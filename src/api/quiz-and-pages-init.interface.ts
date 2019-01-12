import Quiz from './quiz.interface'
import Pages from './pages.interface'

export default interface QuizAndPagesInit {
  [index: string]: any

  quizData: Quiz
  pages: Pages
}
