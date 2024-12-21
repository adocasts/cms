import { BaseModelDto } from '@adocasts.com/dto/base'
import User from '#models/user'
import RoleDto from '#dtos/role'
import PlanDto from '#dtos/plan'
import CollectionDto from '#dtos/collection'
import AdvertisementDto from '#dtos/advertisement'
import CommentDto from '#dtos/comment'
import DiscussionDto from '#dtos/discussion'
import ProfileDto from '#dtos/profile'
import SessionLogDto from '#dtos/session_log'
import PostDto from '#dtos/post'
import WatchlistDto from '#dtos/watchlist'
import EmailHistoryDto from '#dtos/email_history'
import HistoryDto from '#dtos/history'
import ProgressDto from '#dtos/progress'
import NotificationDto from '#dtos/notification'
import QuestionDto from '#dtos/question'
import LessonRequestDto from '#dtos/lesson_request'
import RequestVoteDto from '#dtos/request_vote'
import InvoiceDto from '#dtos/invoice'
import StripeSubscriptionStatuses from '#enums/stripe_subscription_statuses'
import Roles from '#enums/roles'
import Plans from '#enums/plans'

export default class UserDto extends BaseModelDto {
  declare id: number
  declare roleId: Roles
  declare planId: Plans
  declare username: string
  declare email: string
  declare stripeCustomerId: string | null
  declare stripeSubscriptionStatus: StripeSubscriptionStatuses | null
  declare avatarUrl: string
  declare isEnabledProfile: boolean
  declare isEnabledMiniPlayer: boolean
  declare isEnabledAutoplayNext: boolean
  declare isEnabledMentions: boolean
  declare emailVerified: string | null
  declare createdAt: string
  declare updatedAt: string
  declare memberDuration?: string | null
  declare avatar: string
  declare avatarLarge: string
  declare isAdmin: boolean
  declare isSubscriptionActive: boolean
  declare isFreeTier: boolean
  declare isEmailVerified: boolean
  declare role: RoleDto | null
  declare plan: PlanDto | null
  declare collections: CollectionDto[]
  declare ads: AdvertisementDto[]
  declare comments: CommentDto[]
  declare discussions: DiscussionDto[]
  declare discussionVotes: DiscussionDto[]
  declare profile: ProfileDto | null
  declare sessions: SessionLogDto[]
  declare posts: PostDto[]
  declare commentVotes: CommentDto[]
  declare watchlist: WatchlistDto[]
  declare emailHistory: EmailHistoryDto[]
  declare histories: HistoryDto[]
  declare progresses: ProgressDto[]
  declare watchedPosts: ProgressDto[]
  declare completedPosts: ProgressDto[]
  declare notifications: NotificationDto[]
  declare initiatedNotifications: NotificationDto[]
  declare questions: QuestionDto[]
  declare lessonRequests: LessonRequestDto[]
  declare requestVotes: RequestVoteDto[]
  declare lessonRequestVotes: RequestVoteDto[]
  declare invoices: InvoiceDto[]

  constructor(user?: User) {
    super()

    if (!user) return
    this.id = user.id
    this.roleId = user.roleId
    this.planId = user.planId
    this.username = user.username
    this.email = user.email
    this.stripeCustomerId = user.stripeCustomerId
    this.stripeSubscriptionStatus = user.stripeSubscriptionStatus
    this.avatarUrl = user.avatarUrl
    this.isEnabledProfile = user.isEnabledProfile
    this.isEnabledMiniPlayer = user.isEnabledMiniPlayer
    this.isEnabledAutoplayNext = user.isEnabledAutoplayNext
    this.isEnabledMentions = user.isEnabledMentions
    this.emailVerified = user.emailVerified
    this.createdAt = user.createdAt.toISO()!
    this.updatedAt = user.updatedAt.toISO()!
    this.memberDuration = user.memberDuration
    this.avatar = user.avatar
    this.avatarLarge = user.avatarLarge
    this.isAdmin = user.isAdmin
    this.isSubscriptionActive = user.isSubscriptionActive
    this.isFreeTier = user.isFreeTier
    this.isEmailVerified = user.isEmailVerified
    this.role = user.role && new RoleDto(user.role)
    this.plan = user.plan && new PlanDto(user.plan)
    this.collections = CollectionDto.fromArray(user.collections)
    this.ads = AdvertisementDto.fromArray(user.ads)
    this.comments = CommentDto.fromArray(user.comments)
    this.discussions = DiscussionDto.fromArray(user.discussions)
    this.discussionVotes = DiscussionDto.fromArray(user.discussionVotes)
    this.profile = user.profile && new ProfileDto(user.profile)
    this.sessions = SessionLogDto.fromArray(user.sessions)
    this.posts = PostDto.fromArray(user.posts)
    this.commentVotes = CommentDto.fromArray(user.commentVotes)
    this.watchlist = WatchlistDto.fromArray(user.watchlist)
    this.emailHistory = EmailHistoryDto.fromArray(user.emailHistory)
    this.histories = HistoryDto.fromArray(user.histories)
    this.progresses = ProgressDto.fromArray(user.progresses)
    this.watchedPosts = ProgressDto.fromArray(user.watchedPosts)
    this.completedPosts = ProgressDto.fromArray(user.completedPosts)
    this.notifications = NotificationDto.fromArray(user.notifications)
    this.initiatedNotifications = NotificationDto.fromArray(user.initiatedNotifications)
    this.questions = QuestionDto.fromArray(user.questions)
    this.lessonRequests = LessonRequestDto.fromArray(user.lessonRequests)
    this.requestVotes = RequestVoteDto.fromArray(user.requestVotes)
    this.lessonRequestVotes = RequestVoteDto.fromArray(user.lessonRequestVotes)
    this.invoices = InvoiceDto.fromArray(user.invoices)
  }
}
