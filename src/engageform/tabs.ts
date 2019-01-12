import Bootstrap from '../bootstrap'
import TabsProperties from './tabs-properties'
import Quiz from '../api/quiz.interface'

export default class Tabs implements TabsProperties {
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
        this.logoUrl = Bootstrap.config.backend.api + Bootstrap.config.backend.imagesUrl + '/' + data.tabs.logoUrl
      }

      if (data.tabs.headerText) {
        this.headerText = data.tabs.headerText
      }
    }
  }
}
