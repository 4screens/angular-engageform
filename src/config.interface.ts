export default interface AppConfig {
  cloudinary: CloudinaryConfig
  backend: BackendConfig
  engageform: EngageformConfig
}

export interface EngageformConfig {
  pageResponseUrl: string
}

export interface BackendConfig {
  domain: string
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
