import EmbedSettings from './embed-settings.interface'

export default interface Embed {
  id: string
  mode: string
  live: boolean
  callback: {
    sendAnswerCallback: any
  }
  embedSettings: EmbedSettings
}
