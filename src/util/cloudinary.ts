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

    public static getInstance(): Cloudinary {
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

      var manipulation;
      var imageWidth = Math.round(width * imageData.width / 100);
      var imageHeight = Math.round(width * imageData.containerHeight  / baseWidth);
      var ox = Math.round(width * imageData.left / 100);
      var oy = Math.round(imageHeight * imageData.top / 100);

      manipulation = [];
      manipulation.push('w_' + imageWidth);
      manipulation.push('f_auto');
      manipulation.push('q_82');
      manipulation.push('dpr_1.0');
      src += '/' + manipulation.join(',');

      manipulation = [];
      manipulation.push('w_' + width);
      manipulation.push('h_' + imageHeight);
      manipulation.push('x_' + (-1 * ox));
      manipulation.push('y_' + (-1 * oy));
      manipulation.push('c_crop');
      src += '/' + manipulation.join(',');

      manipulation = [];
      manipulation.push('w_' + (width + ox));
      manipulation.push('h_' + (imageHeight + oy));
      manipulation.push('c_mpad');
      src += '/' + manipulation.join(',');

      manipulation = [];
      manipulation.push('w_' + width);
      manipulation.push('h_' + imageHeight);
      manipulation.push('x_0');
      manipulation.push('y_0');
      manipulation.push('c_crop');
      src += '/' + manipulation.join(',');

      if (filepath.indexOf('http') === -1) {
        src += '/' + this._uploadFolder;
      }

      return src + '/' + filepath;
    }
  }
}
