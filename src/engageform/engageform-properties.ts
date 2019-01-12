import QuizFinish from '../api/quiz-finish.interface'
import Branding from '../branding/branding'
import Meta from '../meta/meta'
import { Navigation } from '../navigation/navigation'
import Page from '../page/page'
import { Pages } from '../page/pages.interface'
import Event from '../util/event'
import { EngageformMode } from './engageform-mode.enum'
import { EngageformType } from './engageform-type.enum'
import SendAnswerCallback from './send-answer-callback'
import SettingsProperties from './settings-properties'
import Tabs from './tabs'
import Texts from './texts'
import ThemeProperties from './theme-properties'

export default interface EngageformProperties {
  sendAnswerCallback: SendAnswerCallback

  enabled: boolean
  type: EngageformType
  title: string
  settings: SettingsProperties
  theme: ThemeProperties
  tabs: Tabs
  branding: Branding
  meta: Meta

  texts: Texts

  current: Page
  message: string
  navigation: Navigation

  pages: Pages
  startPages: string[]
  endPages: string[]
  availablePages: string[]
  hasForms: boolean

  typeName: string
  id: string

  event: Event

  mode: EngageformMode

  isType(type: EngageformType): boolean

  isNormalMode(): boolean

  isSummaryMode(): boolean

  isPreviewMode(): boolean

  isResultsMode(): boolean

  setCurrent(pageId: string): void

  setCurrentEndPage(): ng.IPromise<QuizFinish>
}
