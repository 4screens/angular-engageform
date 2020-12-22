import QuizQuestion, { MediaPosition } from '../api/quiz-question.interface'
import PageSettingsProperties from './page-settings-properties'

export default class PageSettings implements PageSettingsProperties {
  showResults: boolean = false
  showCorrectAnswer: boolean = false
  showMainMedia: boolean = false
  showDescription: boolean = false
  requiredAnswer: boolean = false
  mediaPosition: MediaPosition = 'stack'

  constructor(data: QuizQuestion) {
    this.requiredAnswer = !!data.requiredAnswer

    if (data.settings) {
      console.log('data.settings: ', data.settings);
      this.showResults = !!data.settings.showAnswers
      this.showCorrectAnswer = !!data.settings.showCorrectAnswer
      this.showMainMedia = !!data.settings.showMainMedia
      this.showDescription = !!data.settings.showDescription
      this.mediaPosition = data.settings.mediaPosition || 'stack'
    }
  }
}
