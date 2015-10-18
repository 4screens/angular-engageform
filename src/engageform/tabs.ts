/// <reference path="itabs.ts" />

module Engageform {
  export class Tabs implements ITabs {
    liveTitle: string = 'Live';
    chatTitle: string = 'Chat';
    logoUrl: string = '';

    constructor(data: API.IQuiz) {
      if (data.tabs) {
        if (data.tabs.liveTitle) {
          this.liveTitle = data.tabs.liveTitle;
        }

        if (data.tabs.chatTitle) {
          this.chatTitle = data.tabs.chatTitle;
        }

        if (data.tabs.logoUrl) {
          this.logoUrl = data.tabs.logoUrl;
        }
      }
    }
  }
}
