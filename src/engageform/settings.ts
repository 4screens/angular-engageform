import Bootstrap from '../bootstrap'
import SettingsProperties from './settings-properties'
import Quiz from '../api/quiz.interface'

export default class Settings implements SettingsProperties {
  allowAnswerChange: boolean = false
  hideMessageAfterDelay: number = 3000
  share: {
    title: string
    imageUrl: string
    link: string
    description: string
  }
  tracking = null

  constructor(data: Quiz) {
    if (data.settings) {
      this.allowAnswerChange = !!data.settings.allowAnswerChange

      this.tracking = data.settings.tracking

      if (data.settings.hideMessageAfterDelay) {
        this.hideMessageAfterDelay = data.settings.hideMessageAfterDelay
      }

      if (data.settings.share) {
        this.share = data.settings.share

        if (!this.share.imageUrl && Bootstrap.config.share && Bootstrap.config.share.defaultImgUrl) {
          this.share.imageUrl = Bootstrap.config.share.defaultImgUrl
        }
      }
    }
  }
}
