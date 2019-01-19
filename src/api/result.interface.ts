// More specyfic variant of the iquestionanswer interface.
export default interface Result {
  selected?: boolean
  average?: number
  count?: number
  stats?: {
    // Answer stats. They are numbers, but need to handle the questionId, which is a string.
    [key: string]: number | string

    // The ID of question of which results are stored in the object.
    questionId: string
  }
}
