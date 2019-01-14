import Bootstrap from '../../bootstrap'
import {defaults} from 'lodash'
import { MaybeBoolean, MaybeNumber, MaybeString } from '../../types'
import { PageType } from '../page-type.enum'
import Page from '../page'
import SocialData from '../social-data.interface'
import EngageformProperties from '../../engageform/engageform-properties'
import QuizQuestion from '../../api/quiz-question.interface'
import SettingsProperties from '../../engageform/settings-properties'

export class EndPage extends Page {
  readonly type = PageType.EndPage
  readonly isCoverPage = true

  /* outcome */
  button: MaybeString
  outcome: MaybeString
  social: MaybeBoolean

  /* score */
  score: MaybeNumber
  rangeMin: MaybeNumber
  rangeMax: MaybeNumber
  exitLink: MaybeBoolean
  link: MaybeString
  socialData: SocialData


  constructor(engageform: EngageformProperties, data: QuizQuestion, settings: SettingsProperties) {
    super(engageform, data)
    const shareSettings: SocialData = defaults({}, settings.share, {
      title: '',
      description: '',
      link: '',
      imageUrl: ''
    })
    if (shareSettings.imageUrl) {
      shareSettings.imageUrl = Bootstrap.cloudinary.preparePreviewImageUrl(shareSettings.imageUrl, 680)
    }
    this.socialData = shareSettings

    if (data.coverPage) {
      this.button = data.coverPage.buttonText
      this.outcome = data.coverPage.outcome
      this.social = data.coverPage.showSocialShares
      this.exitLink = data.coverPage.exitLink
      this.link = data.coverPage.link

      if (data.coverPage.scoreRange) {
        this.rangeMax = data.coverPage.scoreRange.max
        this.rangeMin = data.coverPage.scoreRange.min
      }
    }
  }

  private personalizeShares() {
    // console.log('[ Endpage ] Personalize shares');
    if (this.engageform.typeName === 'outcome' || this.engageform.typeName === 'score') {
      // Replace $TITLE$ and $RESULT$ tags in the translation and set the title.
      this.socialData.title = this.engageform.texts.SCORE_AND_OUTCOME_SHARE
        .replace(/\$RESULT\$/gi, this.outcome || String(this.score || 0))
        .replace(/\$TITLE\$/gi, this.engageform.title)

      if (this.media && this.settings.showMainMedia) {
        this.socialData.imageUrl = this.media
      }
    }
  }

  get fbLink() {
    if (
      Bootstrap.getConfig('backend') && Bootstrap.getConfig('backend').domain &&
      Bootstrap.getConfig('share') && Bootstrap.getConfig('share').facebook &&
      this.socialData && this.socialData.title && this.socialData.description &&
      this.socialData.imageUrl && this.engageform && this.engageform.id
    ) {
      this.personalizeShares()
      return Bootstrap.getConfig('backend').domain + Bootstrap.getConfig('share').facebook + '?quizId=' + this.engageform.id +
        '&description=' + encodeURIComponent(this.socialData.description) + '&name=' +
        encodeURIComponent(this.socialData.title) + '&image=' + this.socialData.imageUrl
    }
    return null
  }

  get twLink() {
    if (this.socialData && this.socialData.title && this.socialData.link) {
      this.personalizeShares()
      return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(this.socialData.title)
        + ' ' + this.socialData.link + ' via @4screens'
    }
    return null
  }
}
