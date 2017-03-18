module API {
  export interface IEmbed {
    id: string;
    mode: string;
    live: boolean;
    callback: {
      sendAnswerCallback: any
    };
    embedSettings: IEmbedSettings;
  }
}
