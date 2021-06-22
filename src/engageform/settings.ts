import Bootstrap from '../bootstrap'
import { Maybe } from '../types'
import Quiz from '../api/quiz.interface'

export default class Settings {
  allowAnswerChange: boolean = false
  hideMessageAfterDelay: number = 3000
  share: Maybe<{
    title: string
    imageUrl: string
    link: string
    description: string
  }>
  tracking: Maybe<{gtm?: {id?: string}}>
  slider: Maybe<{
    minValue: number
    maxValue: number
    startValue: number
    step: number
    valueLabel: string
    valueLabelOption: string
    labelTypeOption: string
    color: string
    highlightColor: string
    barColor: string
    minLabel: string
    midLabel: string
    maxLabel: string
  }>

  constructor(data: Quiz) {
    if (data.settings) {
      this.allowAnswerChange = !!data.settings.allowAnswerChange

      this.tracking = data.settings.tracking

      if (data.settings.hideMessageAfterDelay) {
        this.hideMessageAfterDelay = data.settings.hideMessageAfterDelay
      }

      if (data.settings.share) {
        this.share = data.settings.share

        if (!this.share.imageUrl && Bootstrap.getConfig('share') && Bootstrap.getConfig('share').defaultImgUrl) {
          this.share.imageUrl = Bootstrap.getConfig('share').defaultImgUrl
        }
      }

      if (data.settings.slider) {
        this.slider = data.settings.slider
      }
    }
  }
}
