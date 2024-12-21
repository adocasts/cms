import Role from '#models/role'
import User from '#models/user'
import emitter from '@adonisjs/core/services/emitter'
import mail from '@adonisjs/mail/services/main'

declare module '@adonisjs/core/types' {
  interface EventsList {
    'role:upgrade:contributor_lvl_1': { user: User; oldRole: Role; newRole: Role }
    'role:upgrade:contributor_lvl_2': { user: User; oldRole: Role; newRole: Role }
    'role:upgrade:admin': { user: User; oldRole: Role; newRole: Role }
  }
}

emitter.on('role:upgrade:contributor_lvl_1', async ({ user, oldRole, newRole }) => {
  await mail.sendLater((message) => {
    message
      .to(user.email)
      .from('noreply@adocasts.com', 'Adocasts')
      .subject("[Adocasts] You've been upgraded to contributor level 1.")
      .htmlView('emails/notifications/role_upgrade_contributor_1', { user, oldRole, newRole })
  })
})

emitter.on('role:upgrade:contributor_lvl_2', async ({ user, oldRole, newRole }) => {
  await mail.sendLater((message) => {
    message
      .to(user.email)
      .from('noreply@adocasts.com', 'Adocasts')
      .subject("[Adocasts] You've been upgraded to contributor level 2.")
      .htmlView('emails/notifications/role_upgrade_contributor_2', { user, oldRole, newRole })
  })
})

emitter.on('role:upgrade:admin', async ({ user, oldRole, newRole }) => {
  console.log(`updating ${user.username} to admin`)
  await mail.sendLater((message) => {
    message
      .to(user.email)
      .from('noreply@adocasts.com', 'Adocasts')
      .subject("[Adocasts] You've been upgraded to an administrator.")
      .htmlView('emails/notifications/role_upgrade_admin', { user, oldRole, newRole })
  })
})
