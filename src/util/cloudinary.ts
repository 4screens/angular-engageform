/// <reference path="icloudinary.ts" />

module Util {
  export class Cloudinary implements ICloudinary {
    private static _instance: Cloudinary;

    private _accountName: string;
    private _uploadFolder: string;
    private _domain: string;

    constructor() {
      if (Bootstrap.config.cloudinary) {
        this._accountName = Bootstrap.config.cloudinary.accountName || 'test4screens';
        this._uploadFolder = Bootstrap.config.cloudinary.uploadFolder || 'console';
        this._domain = Bootstrap.config.cloudinary.domain || 'https://res.cloudinary.com';
      }

      Cloudinary._instance = this;
    }

    public static getInstance(): Cloudinary
    {
      return Cloudinary._instance;
    }

    public prepareImageUrl(filepath: string, width: number, imageData) {
      if (!filepath) {
        return '';
      }

      var src = this._domain + '/' + this._accountName + '/image';
      var baseWidth = 540;

      if (filepath.indexOf('http') !== -1) {
        src += '/fetch';
      } else {
        src += '/upload';
      }

      if (imageData.containerHeight === width) {
        baseWidth = 300;
      }

      var manipulation = [];
      manipulation.push('w_' + Math.round(width * (imageData.width / 100 || 1)));
      manipulation.push('f_auto');
      manipulation.push('q_82');
      manipulation.push('dpr_1.0');
      src += '/' + manipulation.join(',');

      var resize = [];
      resize.push('w_' + width);
      resize.push('h_' + Math.round(imageData.containerHeight * (width / baseWidth)));
      resize.push('x_' + Math.round(-1 * width * imageData.left / 100));
      resize.push('y_' + Math.round(-1 * width * imageData.containerHeight * imageData.top / (100 * baseWidth)));
      resize.push('c_crop');
      src += '/' + resize.join(',');

      if (filepath.indexOf('http') === -1) {
        src += '/' + this._uploadFolder;
      }

      return src + '/' + filepath;
    }
  }
}
