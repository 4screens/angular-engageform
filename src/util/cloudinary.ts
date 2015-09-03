/// <reference path="../api/config.ts" />

module Util {
  export class Cloudinary {
    static _accountName: string;
    static _uploadFolder: string;
    static _domain: string;

    constructor() {
      throw new Error('One does not simply instantiate Cloudinary.');
    }

    public static setConfig(options) {
      if (!options || [options.accountName, options.uploadFolder, options.domain].indexOf(undefined) > -1) {
        throw new Error('Missing properties in the Cloudinary API config.');
      }

      // TODO: move defaults to config.json. They're not defaults after all!
      this._accountName = options.accountName || 'test4screens';
      this._uploadFolder = options.uploadFolder || 'console';
      this._domain = options.domain || 'https://res.cloudinary.com';
    }

    public static prepareBackgroundImageUrl(filepath: string, width: number, height: number, blur: number, position: string) {
      if (!filepath) {
        return '';
      }

      var src = this._domain + '/' + this._accountName + '/image';

      if (filepath.indexOf('http') !== -1) {
        src += '/fetch';
      } else {
        src += '/upload';
      }

      var manipulation;
      var blured = blur ? blur * 100 : 0;

      manipulation = [];
      manipulation.push('w_' + width);
      manipulation.push('f_auto');
      manipulation.push('h_' + height);

      switch (position) {
        case 'fill':
          manipulation.push('c_fill');
          break;
        case 'fit':
          manipulation.push('c_fit');
          break;
        case 'tiled':
          break;
        case 'centered':
          manipulation.push('c_limit');
          break;
        case 'tiled':
          manipulation.push('c_limit');
          break;
      }

      manipulation.push('dpr_1.0');
      manipulation.push('e_blur:' + blured);
      src += '/' + manipulation.join(',');

      if (filepath.indexOf('http') === -1) {
        src += '/' + this._uploadFolder;
      }

      return src + '/' + filepath;
    }

    public static prepareImageUrl(filepath: string, width: number, imageData) {
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
