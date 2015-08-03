/// <reference path="ibranding.ts" />

module Branding {
  export class Branding implements IBranding {
    // Basic properties.
    private _text: string;
    private _link: string;
    private _imageUrl: string;

    // Marks the branding if it is a cusom, ie. user defined at least one own value.
    private _isCustom: boolean = false;

    // Default branding values from settings.
    private _defaultBranding: IBrandingData = Bootstrap.config.backend.branding;

    public get isCustom(): boolean {
      return this._isCustom;
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

    constructor(data: IBrandingData = {}) {
      // If there's any branding data, it means that this is a custom branding.
      if (data.text || data.link || data.imageUrl) {
        this._isCustom = true;
      }

      // Set the branding properties form the data object or from the default values.
      this._text = data.text || this._defaultBranding.text;
      this._link = data.link || this._defaultBranding.link;

      // Image URL is a bit complicated.
      var imgUrl = data.imageUrl || this._defaultBranding.imageUrl;

      // The image's URL is a bit different if it is a default one, than when it is a custom.
      if (imgUrl === this._defaultBranding.imageUrl) {
        this._imageUrl = Bootstrap.config.backend.domain + imgUrl;
      } else {
        this._imageUrl = Bootstrap.config.backend.domain + Bootstrap.config.backend.imagesUrl + '/' + imgUrl;
      }
    }
  }
}
