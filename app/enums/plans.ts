enum Plans {
  FREE = 1,
  PLUS_MONTHLY = 2,
  PLUS_ANNUAL = 3,
  FOREVER = 4,
}

export const PlanDesc: Record<Plans, string> = {
  [Plans.FREE]: 'Free',
  [Plans.PLUS_MONTHLY]: 'Plus (Monthly)',
  [Plans.PLUS_ANNUAL]: 'Plus (Annually)',
  [Plans.FOREVER]: 'Plus (Forever)',
}

export default Plans
