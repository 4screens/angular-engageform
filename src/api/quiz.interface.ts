import Texts from '../engageform/texts'
import BrandingValues from '../branding/branding-values.interface'

export default interface Quiz {
  _id: string
  title: string
  type: string

  tabs: {
    chatTitle: string
    liveTitle: string
    logoUrl: string
    headerText: string
  }

  language: string
  texts: Texts

  settings: {
    allowAnswerChange: boolean
    branding?: BrandingValues,
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
  theme: {
    answerBackgroundColor: string
    answerBorderColor: string
    answerColor: string
    backgroundBrightness: string
    backgroundColor: string
    backgroundImageBlur: string
    backgroundImageFile: string
    backgroundImagePosition: string
    buttonColor: string
    font: string
    questionColor: string
    customThemeCssFile: string
    tabColor: string
    tabFontColor: string
    tabBorderColor: string
  }
}
