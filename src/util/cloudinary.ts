/// <reference path="../api/config.ts" />

module Util {
  export interface CloudinaryConfig {
    accountName: string;
    uploadFolder: string;
    domain: string;
  }

  export class Cloudinary {
    static _config: CloudinaryConfig;

    constructor() {
      throw new Error('One does not simply instantiate Cloudinary.');
    }

    /**
     * Changes the account configuration of the module.
     *
     * @param {Config.ApiConfig.cloudinary} options Account data for accessing the CLoudinary service.
     */
    public static setConfig(options: CloudinaryConfig) {
      if (!options || [options.accountName, options.uploadFolder, options.domain].indexOf(undefined) > -1) {
        throw new Error('Missing properties in the Cloudinary API config.');
      }

      // This is a hack. Module has to have a reference to the ApiOptions.cloudinary object, since it is
      // overwritten by the config retrieved later.
      this._config = options;
    }

    public static prepareBackgroundImageUrl(filepath: string, width: number, height: number, blur: number, position: string) {
      if (!filepath) {
        return '';
      }

      var src = this._config.domain + '/' + this._config.accountName + '/image';

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
        src += '/' + this._config.uploadFolder;
      }

      return src + '/' + filepath;
    }

    public static prepareImageUrl(filepath: string, width: number, imageData) {
      if (!filepath) {
        return '';
      }

      var src = this._config.domain + '/' + this._config.accountName + '/image';
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
        src += '/' + this._config.uploadFolder;
      }

      return src + '/' + filepath;
    }
  }
}
