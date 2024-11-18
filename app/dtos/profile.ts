import { BaseModelDto } from '@adocasts.com/dto/base'
import Profile from '#models/profile'
import UserDto from '#dtos/user'
import AssetDto from '#dtos/asset'

export default class ProfileDto extends BaseModelDto {
  declare id: number
  declare userId: number
  declare avatarAssetId: number | null
  declare name: string | null
  declare biography: string | null
  declare location: string | null
  declare website: string | null
  declare company: string | null
  declare twitterUrl: string | null
  declare facebookUrl: string | null
  declare instagramUrl: string | null
  declare linkedinUrl: string | null
  declare youtubeUrl: string | null
  declare githubUrl: string | null
  declare threadsUrl: string | null
  declare blueskyUrl: string | null
  declare emailOnComment: boolean
  declare emailOnCommentReply: boolean
  declare emailOnAchievement: boolean
  declare emailOnNewDeviceLogin: boolean
  declare emailOnWatchlist: boolean
  declare emailOnMention: boolean
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null
  declare asset: AssetDto | null
  declare websiteUrl: string

  constructor(profile?: Profile) {
    super()

    if (!profile) return
    this.id = profile.id
    this.userId = profile.userId
    this.avatarAssetId = profile.avatarAssetId
    this.name = profile.name
    this.biography = profile.biography
    this.location = profile.location
    this.website = profile.website
    this.company = profile.company
    this.twitterUrl = profile.twitterUrl
    this.facebookUrl = profile.facebookUrl
    this.instagramUrl = profile.instagramUrl
    this.linkedinUrl = profile.linkedinUrl
    this.youtubeUrl = profile.youtubeUrl
    this.githubUrl = profile.githubUrl
    this.threadsUrl = profile.threadsUrl
    this.blueskyUrl = profile.blueskyUrl
    this.emailOnComment = profile.emailOnComment
    this.emailOnCommentReply = profile.emailOnCommentReply
    this.emailOnAchievement = profile.emailOnAchievement
    this.emailOnNewDeviceLogin = profile.emailOnNewDeviceLogin
    this.emailOnWatchlist = profile.emailOnWatchlist
    this.emailOnMention = profile.emailOnMention
    this.createdAt = profile.createdAt.toISO()!
    this.updatedAt = profile.updatedAt.toISO()!
    this.user = profile.user && new UserDto(profile.user)
    this.asset = profile.asset && new AssetDto(profile.asset)
    this.websiteUrl = profile.websiteUrl
  }
}
