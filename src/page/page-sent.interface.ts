export default interface PageSentProperties {
  selectedCaseIds?: string[]
  correctCaseIds?: string[]
  selectedValue?: number
  result?: number
  results?: {
    [index: string]: number
  }
  inputs?: {
    _id: string
    value: string
  }[]
}
