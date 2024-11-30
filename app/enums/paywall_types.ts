enum PaywallTypes {
  NONE = 1, // no paywall
  DELAYED_RELEASE = 2, // paywalled for x-days
  FULL = 3, // always paywalled
}

export const PaywallTypeDesc = {
  [PaywallTypes.NONE]: 'None - Free to all',
  [PaywallTypes.DELAYED_RELEASE]: 'Delayed Release - Plus Exclusive for 2 weeks',
  [PaywallTypes.FULL]: 'Full - Plus Exclusive',
}

export default PaywallTypes
