export default interface AppConfig {
  share: ShareConfiguration
  cloudinary: CloudinaryConfig
  backend: BackendConfig
  engageform: EngageformConfig
}

export interface EngageformConfig {
  pageStatsUrl: string
  engageformPagesUrl: string
  engageformUrl: string
  engageformFinishUrl: string
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

export interface ShareConfiguration {
  defaultImgUrl: string
  facebook?: string
}
