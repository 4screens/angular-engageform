import Bootstrap from '../bootstrap'
import Quiz from '../api/quiz.interface'

export default class Tabs {
  liveTitle: string = 'Live'
  chatTitle: string = 'Chat'
  logoUrl: string = ''
  headerText: string = ''

  constructor(data: Quiz) {
    if (data.tabs) {
      if (data.tabs.liveTitle) {
        this.liveTitle = data.tabs.liveTitle
      }

      if (data.tabs.chatTitle) {
        this.chatTitle = data.tabs.chatTitle
      }

      if (data.tabs.logoUrl) {
        // The image's URL is a bit different if it is a default one, than when it is a custom.
        this.logoUrl = Bootstrap.getConfig('backend').api + Bootstrap.getConfig('backend').imagesUrl + '/' + data.tabs.logoUrl
      }

      if (data.tabs.headerText) {
        this.headerText = data.tabs.headerText
      }
    }
  }
}
