enum Roles {
  USER = 1,
  ADMIN = 2,
  CONTRIBUTOR_LVL_1 = 3, // can only create, edit, delete posts they create
  CONTRIBUTOR_LVL_2 = 4, // can also create series & taxonomies & sync taxonomy lessons
}

export const RoleWeights = [
  Roles.USER,
  Roles.CONTRIBUTOR_LVL_1,
  Roles.CONTRIBUTOR_LVL_2,
  Roles.ADMIN,
]

export const RoleDesc: Record<Roles, string> = {
  [Roles.USER]: 'User',
  [Roles.ADMIN]: 'Admin',
  [Roles.CONTRIBUTOR_LVL_1]: 'Contributor (Lvl 1)',
  [Roles.CONTRIBUTOR_LVL_2]: 'Contributor (Lvl 2)',
}

export default Roles
