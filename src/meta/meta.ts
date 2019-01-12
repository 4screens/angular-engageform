import { find } from 'lodash'
import MetaProperties from './meta-properties'
import EngageformProperties from '../engageform/engageform-properties'

export class Meta implements MetaProperties {
  private _engageform: EngageformProperties
  globalTitle: string = ''
  globalDescription: string = ''

  constructor(engageform: EngageformProperties) {
    this._engageform = engageform

    if (this._engageform.settings.share) {
      this.globalTitle = this._engageform.settings.share.title || ''
      this.globalDescription = this._engageform.settings.share.description || ''
    }

    if (this._engageform.endPages.length < 1 || !find(this._engageform.pages, {social: true})) {
      if (this._engageform.startPages.length && this._engageform.pages[this._engageform.startPages[0]].title) {
        this.globalTitle = this._engageform.pages[this._engageform.startPages[0]].title
        this.globalDescription = this._engageform.pages[this._engageform.startPages[0]].description
      } else {
        this.globalTitle = ''
        this.globalDescription = ''
      }
    }

  }
}
