import { Nullable } from '../types'

export default interface QuizQuestionAnswer {
  quizQuestionId?: string
  userIdent?: Nullable<string>
  selectedAnswerId?: string
  correctAnswerId?: string
  selectedValue?: number
  points?: number
  avgRateItValue?: string
  rateItValue?: number
  stats?: {
    [index: string]: number
  }
  msg?: string
  inputs?: {value: string}[]
}
