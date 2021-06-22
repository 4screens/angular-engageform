export default interface Answer {
  quizId: string
  quizQuestionId: string
  time: string
  selectedAnswerId?: string
  selectedAnswerIds?: [string]
  inputs?: [{ _id: string, value: string }]
  rateItValue?: number
  sliderValue?: number
}
