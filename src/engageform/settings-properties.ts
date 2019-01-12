export default interface SettingsProperties {
  allowAnswerChange: boolean
  hideMessageAfterDelay: number
  share?: {
    title: string
    imageUrl: string
    link: string
    description: string
  },
  tracking?: {
    gtm?: {
      id?: string
    }
  }
}
