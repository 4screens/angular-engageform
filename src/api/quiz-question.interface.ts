import { PageType } from '../page/page-type.enum'
import EndStats from './end-stats.interface'
import {Maybe} from "../types";

export type MediaPosition = 'stack' | 'float' | 'float--left' | 'split' | 'split--left' | 'background'

export default interface QuizQuestion {
  _id: string
  type: PageType
  text: string
  textHTML: string
  description: string
  resultTitle: Maybe<string>
  responseCount: Maybe<number>
  coverPage: {
    buttonText: string
    outcome: string
    scoreRange: {
      max: number
      min: number
    }
    showSocialShares: boolean
    exitLink: boolean
    exitLinkNewWindow: boolean
    link: string
    redirect: boolean
    redirectNewWindow: boolean
    redirectLink: string
  }
  imageData: {
    containerHeight: number
    containerRatio: number
    left: number
    top: number
    width: number
    height: number
  }
  videoData: {
    type: string
    url: string
  }
  embedData: {
    code: string
  }
  imageFileData: {
    width: number
    height: number
  }
  imageFileUrl: string
  imageFile: string
  requiredAnswer: boolean
  rateIt: {
    maxLabel: string
    minLabel: string
    maxRateItValue: number
    rateType: string
    linearScale: {
      minValue: number
      maxValue: number
    }
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
    allowMultipleChoice: boolean
    multipleChoice: {
      minAnswersCount: number
      maxAnswersCount: number
    }
    share: {
      title: string
      imageUrl: string
      link: string
      description: string
    }
    mediaPosition: MediaPosition
    slider: {
      minValue: number,
      maxValue: number,
      startValue: number,
      step: number,
      valueLabel: string,
      valueLabelOption: string,
      labelTypeOption: string,
      color: string,
      barColor: string,
      highlightColor: string,
      minLabel: string,
      midLabel: string,
      maxLabel: string
    }
  }
  buzzerTheme: {
    imgIdleSrc: string,
    imgPressedSrc: string,
    audioSrc: string
  }
  stats: EndStats[]
}
