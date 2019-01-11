import Quiz from './quiz'
import Pages from './pages'

export default interface QuizAndPagesInit {
  [index: string]: any;
  quizData: Quiz;
  pages: Pages;
}
