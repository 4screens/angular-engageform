import { PageType } from '../page/page-type.enum'
import EndStats from './end-stats.interface'

export default interface QuizQuestion {
  _id: string
  type: PageType
  text: string
  description: string
  coverPage: {
    buttonText: string
    outcome: string
    scoreRange: {
      max: number
      min: number
    }
    showSocialShares: boolean
    exitLink: boolean
    link: string
  }
  imageData: {
    containerHeight: number
    containerRatio: number
    left: number
    top: number
    width: number
    height: number
  }
  imageFile: string
  requiredAnswer: boolean
  rateIt: {
    maxLabel: string
    minLabel: string
    maxRateItValue: number
    rateType: string
  }
  answers: {}[]
  forms: {
    inputs: {}[]
  }
  settings: {
    showAnswers: boolean
    showCorrectAnswer: boolean
    showMainMedia: boolean
    showDescription: boolean
    share: {
      title: string
      imageUrl: string
      link: string
      description: string
    }
  }
  buzzerTheme: {
    imgIdleSrc: string,
    imgPressedSrc: string,
    audioSrc: string
  }
  stats: EndStats[]
}
