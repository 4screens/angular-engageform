module Engageform {
  export interface ISetting {
    allowAnswerChange: boolean;
    hideMessageAfterDelay: number;
    share?: {
      title: string;
      imageUrl: string;
      link: string;
      description: string;
    }
  }
}
