export default interface ThemeProperties {
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

  tabBorderColor: string
  tabColor: string
  tabFontColor: string

  backgroundImageConvertedFile?: string

  convertBackgroundImage(): void
}
