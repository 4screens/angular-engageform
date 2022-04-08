export default interface PageSentProperties {
  selectedCaseIds?: string[]
  correctCaseIds?: string[]
  selectedValue?: number
  result?: number
  responseCount?: number
  results?: {
    [index: string]: number
  }
  numbers?: {
    [index: string]: number
    all: number
  }
  inputs?: {
    _id: string
    value: string
  }[]
}
