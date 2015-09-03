module Config {
  export interface ApiConfig {
    // TODO: more config data.

    cloudinary: {
      accountName: string;
      uploadFolder: string;
      domain: string;
    }
  }
}
