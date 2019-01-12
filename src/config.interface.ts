export default interface AppConfig {
  cloudinary: CloudinaryConfig
  backend: BackendConfig
}

export interface BackendConfig {
  api: string,
  imagesUrl: string
  branding: BrandingConfig
}

export interface BrandingConfig {
  imageUrl: string
  link: string
  text: string
  state: boolean
}

export interface CloudinaryConfig {
  accountName: string
  uploadFolder: string
  domain: string
}
