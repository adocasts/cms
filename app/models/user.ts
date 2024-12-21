// @ts-nocheck
import { DateTime } from 'luxon'
import {
  column,
  beforeSave,
  belongsTo,
  hasMany,
  hasOne,
  manyToMany,
  computed,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
// import { slugify } from '@ioc:Adonis/Addons/LucidSlugify' // TODO
import gravatar from 'gravatar'
import Role from '#models/role'
import Profile from '#models/profile'
import Post from '#models/post'
import Collection from '#models/collection'
import Comment from '#models/comment'
import History from '#models/history'
import Notification from '#models/notification'
import LessonRequest from '#models/lesson_request'
import RequestVote from '#models/request_vote'
import Plan from '#models/plan'
import SessionLog from '#models/session_log'
import Invoice from '#models/invoice'
import AppBaseModel from '#models/app_base_model'
import Watchlist from '#models/watchlist'
import EmailHistory from '#models/email_history'
import Question from '#models/question'
import Themes from '#enums/themes'
import Roles from '#enums/roles'
import Plans from '#enums/plans'
import StripeSubscriptionStatuses from '#enums/stripe_subscription_statuses'
import hash from '@adonisjs/core/services/hash'
import env from '#start/env'
import SlugService from '#services/slug_service'
import Discussion from './discussion.js'
import Advertisement from './advertisement.js'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import Progress from './progress.js'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import { Infer } from '@vinejs/vine/types'
import { loginValidator, registerValidator } from '#validators/auth'
import { updateEmailValidator } from '#validators/settings'
import db from '@adonisjs/lucid/services/db'
import mail from '@adonisjs/mail/services/main'
import app from '@adonisjs/core/services/app'

const AuthFinder = withAuthFinder(() => hash.use('argon'), {
  uids: ['email', 'username'],
  passwordColumnName: 'password',
})

export default class User extends compose(AppBaseModel, AuthFinder) {
  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roleId: Roles

  @column()
  declare planId: Plans

  @column()
  // @slugify({
  //   strategy: 'dbIncrement',
  //   fields: ['username']
  // })
  declare username: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column({ serializeAs: null })
  declare stripeCustomerId: string | null

  @column()
  declare stripeSubscriptionStatus: StripeSubscriptionStatuses | null

  @column.dateTime()
  declare stripeSubscriptionPausedAt: DateTime | null

  @column.dateTime()
  declare stripeSubscriptionCanceledAt: DateTime | null

  @column()
  declare billToInfo: string | null

  @column()
  declare rememberMeToken?: string

  @column()
  declare avatarUrl: string

  @column()
  declare githubId: string

  @column()
  declare googleId: string

  @column()
  declare githubEmail: string

  @column()
  declare googleEmail: string

  @column()
  theme: string = Themes.SYSTEM

  @column()
  declare isEnabledProfile: boolean

  @column()
  declare isEnabledMiniPlayer: boolean

  @column()
  declare isEnabledAutoplayNext: boolean

  @column()
  declare isEnabledMentions: boolean

  @column()
  declare emailVerified: string | null

  @column.dateTime()
  declare emailVerifiedAt: DateTime | null

  @column.dateTime()
  declare planPeriodStart: DateTime | null

  @column.dateTime()
  declare planPeriodEnd: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  get handle() {
    return `@${this.username}`
  }

  @computed()
  get memberDuration() {
    if (!this.createdAt) return
    return this.createdAt.toRelative()
  }

  @computed()
  get avatar() {
    if (this.avatarUrl) {
      if (this.avatarUrl.startsWith('https://')) {
        return this.avatarUrl
      }

      return `${env.get('ASSET_DOMAIN') || ''}/img/${this.avatarUrl}`
    }

    return gravatar.url(this.email, { s: '60' })
  }

  @computed()
  get avatarLarge() {
    if (this.avatarUrl) {
      if (this.avatarUrl.startsWith('https://')) {
        return this.avatarUrl
      }

      return `${env.get('ASSET_DOMAIN') || ''}/img/${this.avatarUrl}`
    }

    return gravatar.url(this.email, { s: '250' })
  }

  @computed()
  get isAdmin() {
    return this.roleId === Roles.ADMIN
  }

  @computed()
  get isSubscriptionActive() {
    if (this.planId === Plans.FOREVER) return true

    const isActive = this.stripeSubscriptionStatus === StripeSubscriptionStatuses.ACTIVE
    const isComplete = this.stripeSubscriptionStatus === StripeSubscriptionStatuses.COMPLETE

    return isActive || isComplete
  }

  @computed()
  get isFreeTier() {
    return this.planId === Plans.FREE || !this.isSubscriptionActive
  }

  @computed()
  get isEmailVerified() {
    // has gone through verification flow
    if (this.emailVerified === this.email && this.emailVerifiedAt) return true

    // using third-party social auth
    return this.email === this.githubEmail || this.email === this.googleEmail
  }

  @beforeSave()
  static async slugifyUsername(user: User) {
    if (user.$dirty.username) {
      const slugify = new SlugService<typeof User>({
        strategy: 'dbIncrement',
        fields: ['username'],
      })
      user.username = await slugify.make(User, 'username', user.username)
    }
  }

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @belongsTo(() => Plan)
  declare plan: BelongsTo<typeof Plan>

  @hasMany(() => Collection, {
    foreignKey: 'ownerId',
  })
  declare collections: HasMany<typeof Collection>

  @hasMany(() => Advertisement)
  declare ads: HasMany<typeof Advertisement>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Discussion)
  declare discussions: HasMany<typeof Discussion>

  @manyToMany(() => Discussion, {
    pivotTable: 'discussion_votes',
  })
  declare discussionVotes: ManyToMany<typeof Discussion>

  @hasOne(() => Profile)
  declare profile: HasOne<typeof Profile>

  @hasMany(() => SessionLog)
  declare sessions: HasMany<typeof SessionLog>

  @manyToMany(() => Post, {
    pivotTable: 'author_posts',
    pivotColumns: ['author_type_id'],
  })
  declare posts: ManyToMany<typeof Post>

  @manyToMany(() => Comment, {
    pivotTable: 'comment_votes',
  })
  declare commentVotes: ManyToMany<typeof Comment>

  @hasMany(() => Watchlist)
  declare watchlist: HasMany<typeof Watchlist>

  @hasMany(() => EmailHistory)
  declare emailHistory: HasMany<typeof EmailHistory>

  @hasMany(() => History)
  declare histories: HasMany<typeof History>

  @hasMany(() => Progress)
  declare progresses: HasMany<typeof Progress>

  @hasMany(() => Progress, {
    onQuery: (query) => query.whereNotNull('postId').where('watchSeconds', '>', 0),
  })
  declare watchedPosts: HasMany<typeof Progress>

  @hasMany(() => Progress, {
    onQuery: (query) => query.whereNotNull('postId').where('isCompleted', true),
  })
  declare completedPosts: HasMany<typeof Progress>

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>

  @hasMany(() => Notification, {
    foreignKey: 'initiatorUserId',
  })
  declare initiatedNotifications: HasMany<typeof Notification>

  @hasMany(() => Question)
  declare questions: HasMany<typeof Question>

  @hasMany(() => LessonRequest)
  declare lessonRequests: HasMany<typeof LessonRequest>

  @hasMany(() => RequestVote)
  declare requestVotes: HasMany<typeof RequestVote>

  @hasMany(() => RequestVote, {
    onQuery: (query) => query.whereNotNull('lessonRequestId'),
  })
  declare lessonRequestVotes: HasMany<typeof RequestVote>

  @hasMany(() => Invoice)
  declare invoices: HasMany<typeof Invoice>

  async verifyPasswordForAuth(plainTextPassword: string) {
    return hash.use('argon').verify(this.password, plainTextPassword)
  }

  static async findForAuth(uids: string[], value: string) {
    const query = this.query()
    uids.map((uid) => query.orWhereILike(uid, value))
    return query.first()
  }

  static async login(
    auth: Authenticator<Authenticators>,
    { email, password, remember }: Infer<typeof loginValidator>
  ) {
    const user = await this.verifyCredentials(email, password)
    await auth.use('web').login(user, remember)
    return user
  }

  static async register(
    auth: Authenticator<Authenticators>,
    data: Infer<typeof registerValidator>
  ) {
    const user = await this.create(data)
    await auth.use('web').login(user)
    return user
  }

  static async logout(auth: Authenticator<Authenticators>) {
    await auth.use('web').logout()
  }

  async updateEmail(data: Infer<typeof updateEmailValidator>) {
    const emailOld = this.email

    // verify the password is correct for auth user
    await User.verifyCredentials(emailOld, data.password)

    await db.transaction(async (trx) => {
      this.useTransaction(trx)

      await this.merge({ email: data.email }).save()
      await EmailHistory.create(
        {
          userId: this.id,
          emailNew: data.email,
          emailOld,
        },
        { client: trx }
      )
    })

    await mail.sendLater((message) => {
      message
        .to(emailOld)
        .subject(`Your ${app.appName} email has been successfully changed`)
        .htmlView('emails/account/email_changed', { user: this })
    })
  }
}
