import { find } from 'lodash'
import Engageform from './engageform/engageform'

export default class Meta {
  static fromEngageform(engageform: Engageform): Meta {
    return new Meta(engageform)
  }

  readonly globalTitle: string
  readonly globalDescription: string

  private constructor({settings: {share}, endPages, startPages, pages}: Engageform) {
    this.globalTitle = ''
    this.globalDescription = ''

    if (share) {
      this.globalTitle = share.title || ''
      this.globalDescription = share.description || ''
    }

    if (endPages.length < 1 || !find(pages, {social: true})) {
      if (startPages.length && pages[startPages[0]].title) {
        this.globalTitle = pages[startPages[0]].title
        this.globalDescription = pages[startPages[0]].description
      }
    }
  }
}
