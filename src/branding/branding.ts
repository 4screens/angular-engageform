/// <reference path="ibranding.ts" />

module Branding {
  export class Branding implements IBranding {
    // Basic properties.
    private _text: string;
    private _link: string;
    private _imageUrl: string;
    private _isCustomLogo: boolean = false;
    private _enabled: boolean;

    // Marks the branding if it is a custom, ie. user defined at least one own value.
    private _isCustom: boolean = false;

    public get isCustom(): boolean {
      return this._isCustom;
    }
    public get isCustomLogo(): boolean {
      return this._isCustomLogo;
    }
    public get isDefault(): boolean {
      return !this._isCustom;
    }
    public get imageUrl(): string {
      return this._imageUrl;
    }
    public get link(): string {
      return this._link;
    }
    public get text(): string {
      return this._text;
    }
    public get enabled(): boolean {
      return this._enabled;
    }

    constructor(data: IBrandingData = {}) {
      var imgUrl;
      var defaultBranding = Bootstrap.config.backend.branding;

      // Is branding enabled?
      this._enabled = Boolean(data.state);

      // If there's any branding data, it means that this is a custom branding.
      if (data.text || data.link || data.imageUrl) {
        this._isCustom = true;
      }

      // Set the branding properties form the data object or from the default values.
      this._text = typeof data.text === 'undefined' ? defaultBranding.text : data.text;
      this._link = typeof data.link === 'undefined' ? defaultBranding.link : data.link;

      // Image URL is a bit complicated.
      if ( typeof data.imageUrl === 'undefined' ) {
        imgUrl = defaultBranding.imageUrl;
      } else {
        imgUrl = data.imageUrl;
        this._isCustomLogo = true;
      }

      // The image's URL is a bit different if it is a default one, than when it is a custom.
      if (imgUrl === defaultBranding.imageUrl) {
        this._imageUrl = Bootstrap.config.backend.api + imgUrl;
      } else {
        this._imageUrl = imgUrl ? Bootstrap.config.backend.api + Bootstrap.config.backend.imagesUrl + '/' + imgUrl : '';
      }
    }
  }
}
