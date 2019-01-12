export default interface PageSentProperties {
  selectedCaseId: string
  correctCaseId: string
  selectedValue: number
  result: number
  results: {
    [index: string]: number
  }
  inputs: {
    _id: string
    value: string
  }[]
}
