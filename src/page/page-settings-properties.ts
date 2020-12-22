import { MediaPosition } from "../api/quiz-question.interface";

export default interface PageSettingsProperties {
  showResults: boolean
  showCorrectAnswer: boolean
  showMainMedia: boolean
  showDescription: boolean
  requiredAnswer: boolean
  mediaPosition: MediaPosition
}
