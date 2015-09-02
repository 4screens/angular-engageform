module Branding {
  export interface IBrandingData {
    imageUrl?: string;
    link?: string;
    text?: string;
    state?: boolean;
  }

  export interface IBranding {
    text: string;
    link: string;
    imageUrl: string;
    enabled: boolean;

    isDefault: boolean;
    isCustom: boolean;
    isCustomLogo: boolean;
  }
}
