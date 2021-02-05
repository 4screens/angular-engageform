import Bootstrap from './bootstrap'
import {BrandingConfig} from './config.interface'
import {QuizType} from "./api/quiz-type.enum";

type BrandingCreationProperties = Partial<BrandingConfig>

export default class Branding {
  static create(quizType: QuizType, brandingProperties: BrandingCreationProperties = {}): Branding {
    return new Branding(quizType, brandingProperties, Branding.arePropertiesCustom(brandingProperties))
  }

  private static arePropertiesCustom({text, link, imageUrl}: BrandingCreationProperties): boolean {
    return Boolean(Branding.isTextCustom(text) || link || Branding.isImageCustom(imageUrl))
  }

  private static isTextCustom(text?: string): text is string {
    return typeof text !== 'undefined'
  }

  private static isImageCustom(imageUrl?: string): boolean {
    return typeof imageUrl !== 'undefined' && imageUrl !== Branding.defaultBranding.imageUrl
  }

  private static get defaultBranding() {
    return Bootstrap.getConfig('backend').branding
  }

  private _text: string
  private _link: string
  private _imageUrl: string
  private _isCustomLogo = false
  private _enabled: boolean
  private _custom: boolean

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

  private constructor(quizType:QuizType, {state, text, link, imageUrl}: BrandingCreationProperties = {}, _custom: boolean) {
    this._custom = _custom
    // State of the enabled branding is false, so negating that.
    this._enabled = !state

    this._text = Branding.isTextCustom(text) ? text : Branding.defaultBranding.text

    if (quizType == QuizType.Live ){
      this._link = link || Branding.defaultBranding.link_event;
    }else{
      this._link = link || Branding.defaultBranding.link_project;
    }

    if (Branding.isImageCustom(imageUrl)) {
      this._imageUrl = imageUrl ? `${Bootstrap.getConfig('backend').api + Bootstrap.getConfig('backend').imagesUrl}/${imageUrl}` : ''
      this._isCustomLogo = true
    } else {
      this._imageUrl = Bootstrap.config.backend.api + imageUrl
    }
  }
}
