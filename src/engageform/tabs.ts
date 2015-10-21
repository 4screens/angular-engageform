/// <reference path="itabs.ts" />

module Engageform {
  export class Tabs implements ITabs {
    liveTitle: string = 'Live';
    chatTitle: string = 'Chat';
    logoUrl: string = '';
    headerText: string = '';

    constructor(data: API.IQuiz) {
      if (data.tabs) {
        if (data.tabs.liveTitle) {
          this.liveTitle = data.tabs.liveTitle;
        }

        if (data.tabs.chatTitle) {
          this.chatTitle = data.tabs.chatTitle;
        }

        if (data.tabs.logoUrl) {
          // The image's URL is a bit different if it is a default one, than when it is a custom.
          this.logoUrl = Bootstrap.config.backend.api + Bootstrap.config.backend.imagesUrl + '/' + data.tabs.logoUrl;
        }

        if (data.tabs.headerText) {
          this.headerText = data.tabs.headerText;
        }
      }
    }
  }
}
