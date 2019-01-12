import Bootstrap from '../bootstrap'
import ThemeProperties from './theme-properties'
import EmbedSettings from '../api/embed-settings.interface'
import Quiz from '../api/quiz.interface'

export class Theme implements ThemeProperties {
  answerBackgroundColor: string = ''
  answerBorderColor: string = ''
  answerColor: string = ''
  backgroundBrightness: string = ''
  backgroundColor: string = ''
  backgroundImageBlur: string = ''
  backgroundImageFile: string = ''
  backgroundImagePosition: string = ''
  buttonColor: string = ''
  font: string = ''
  questionColor: string = ''
  customThemeCssFile: string = ''
  backgroundImageConvertedFile: string = ''

  tabBorderColor: string = ''
  tabFontColor: string = ''
  tabColor: string = ''

  embedSettings: EmbedSettings

  constructor(data: Quiz, embedSettings: EmbedSettings) {
    this.embedSettings = embedSettings
    if (data.theme) {
      this.answerBackgroundColor = data.theme.answerBackgroundColor || ''
      this.answerBorderColor = data.theme.answerBorderColor || ''
      this.answerColor = data.theme.answerColor || ''
      this.backgroundBrightness = data.theme.backgroundBrightness || ''
      this.backgroundColor = data.theme.backgroundColor || ''
      this.backgroundImageBlur = data.theme.backgroundImageBlur || ''
      this.backgroundImageFile = data.theme.backgroundImageFile || ''
      this.backgroundImagePosition = data.theme.backgroundImagePosition || ''
      this.buttonColor = data.theme.buttonColor || ''
      this.font = data.theme.font || ''
      this.questionColor = data.theme.questionColor || ''
      this.tabColor = data.theme.tabColor || ''
      this.tabFontColor = data.theme.tabFontColor || ''
      this.tabBorderColor = data.theme.tabBorderColor || ''

      if (data.theme.customThemeCssFile) {
        this.customThemeCssFile = Bootstrap.config.backend.api + '/uploads/' + data.theme.customThemeCssFile
      }

      if (data.theme.backgroundImageFile) {
        this.convertBackgroundImage()
      }
    }
  }

  convertBackgroundImage() {
    this.backgroundImageConvertedFile = Bootstrap.cloudinary.prepareBackgroundImageUrl(
      this.backgroundImageFile,
      // Picture will always cover the full width.
      window.innerWidth,
      // If the height is automatic, do not cut the picture
      this.embedSettings.height === 'auto' ? null : window.innerHeight,
      parseInt(this.backgroundImageBlur, 10),
      this.backgroundImagePosition
    )
  }
}
