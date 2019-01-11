import QuizQuestion from '../api/quiz-question'
import PageSettingsProperties from './page-settings-properties'

export default class PageSettings implements PageSettingsProperties {
  showResults: boolean = false
  showCorrectAnswer: boolean = false
  showMainMedia: boolean = false
  showDescription: boolean = false
  requiredAnswer: boolean = false

  constructor(data: QuizQuestion) {
    this.requiredAnswer = !!data.requiredAnswer

    if (data.settings) {
      this.showResults = !!data.settings.showAnswers
      this.showCorrectAnswer = !!data.settings.showCorrectAnswer
      this.showMainMedia = !!data.settings.showMainMedia
      this.showDescription = !!data.settings.showDescription
    }
  }
}
