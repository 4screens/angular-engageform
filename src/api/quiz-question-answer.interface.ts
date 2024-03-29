import { Nullable } from '../types'

export default interface QuizQuestionAnswer {
  quizQuestionId?: string
  userIdent?: Nullable<string>
  eventUserId?: Nullable<string>
  selectedAnswerIds?: string[]
  correctAnswerIds?: string[]
  selectedValue?: number
  selected?: boolean
  points?: number
  avgRateItValue?: string
  avgSliderValue? :string
  rateItValue?: number
  sliderValue?: number
  stats?: {
    [index: string]: number
  }
  msg?: string
  inputs?: {value: string}[]
}
