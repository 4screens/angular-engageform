import Bootstrap from '../bootstrap'
import { BrandingConfig } from '../config.interface'

type BrandingCreationProperties = Partial<BrandingConfig>

export default class Branding {
  static create(brandingProperties: BrandingCreationProperties = {}): Branding {
    return new Branding(brandingProperties, Branding.arePropertiesCustom(brandingProperties))
  }

  private static arePropertiesCustom({text, link, imageUrl}: BrandingCreationProperties): boolean {
    return Boolean(Branding.isTextCustom(text) || link || Branding.isImageCustom(imageUrl))
  }

  private static isTextCustom(text?: string): text is string {
    return typeof text !== 'undefined'
  }

  private static isImageCustom(imageUrl?: string): boolean {
    return typeof imageUrl !== 'undefined' && imageUrl !== Branding.default.imageUrl
  }

  private static default = Bootstrap.getConfig('backend').branding

  private _text: string
  private _link: string
  private _imageUrl: string
  private _isCustomLogo = false
  private _enabled: boolean

  public get isCustom(): boolean {
    return this._custom
  }

  public get isDefault(): boolean {
    return !this._custom
  }

  public get isCustomLogo(): boolean {
    return this._isCustomLogo
  }

  public get imageUrl(): string {
    return this._imageUrl
  }

  public get link(): string {
    return this._link
  }

  public get text(): string {
    return this._text
  }

  public get enabled(): boolean {
    return this._enabled
  }

  private constructor({state, text, link, imageUrl}: BrandingCreationProperties = {}, private _custom: boolean) {
    // State of the enabled branding is false, so negating that.
    this._enabled = !state

    this._text = Branding.isTextCustom(text) ? text : Branding.default.text
    this._link = link || Branding.default.link

    if (Branding.isImageCustom(imageUrl)) {
      this._imageUrl = imageUrl ? `${Bootstrap.getConfig('backend').api + Bootstrap.getConfig('backend').imagesUrl}/${imageUrl}` : ''
      this._isCustomLogo = true
    } else {
      this._imageUrl = Bootstrap.config.backend.api + imageUrl
    }
  }
}
