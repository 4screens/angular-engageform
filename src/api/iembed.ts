module API {
  export interface IEmbed {
    id: string;
    mode: string;
    callback: {
      sendAnswerCallback: ISendAnswerCallback
    }
  }
}
