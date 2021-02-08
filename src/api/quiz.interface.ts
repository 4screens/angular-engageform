import Branding from '../branding'
import Texts from '../engageform/texts'
import { QuizType } from './quiz-type.enum'
import Integration from "./integration.interface";

export default interface Quiz {
  _id: string
  title: string
  type: QuizType

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
    branding?: Branding,
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
  showGoogleAds: boolean
  integrations?: Integration
}
