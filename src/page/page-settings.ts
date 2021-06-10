import QuizQuestion, { MediaPosition } from '../api/quiz-question.interface'
import PageSettingsProperties from './page-settings-properties'

export default class PageSettings implements PageSettingsProperties {
  showResults: boolean = false
  showCorrectAnswer: boolean = false
  showMainMedia: boolean = false
  showDescription: boolean = false
  requiredAnswer: boolean = false
  mediaPosition: MediaPosition = 'stack'
  allowMultipleChoice: boolean = false
  minAnswersCount: number = 0
  maxAnswersCount: number = 0


  constructor(data: QuizQuestion) {
    this.requiredAnswer = !!data.requiredAnswer

    if (data.settings) {
      this.showResults = !!data.settings.showAnswers
      this.showCorrectAnswer = !!data.settings.showCorrectAnswer
      this.showMainMedia = !!data.settings.showMainMedia
      this.showDescription = !!data.settings.showDescription
      this.mediaPosition = data.settings.mediaPosition || 'stack'
      this.allowMultipleChoice = data.settings.allowMultipleChoice || false
      this.minAnswersCount = (data.settings.multipleChoice && data.settings.multipleChoice.minAnswersCount) || 0
      this.maxAnswersCount = (data.settings.multipleChoice && data.settings.multipleChoice.maxAnswersCount) || 0
    }
  }
}
