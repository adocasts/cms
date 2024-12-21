import User from '#models/user'

export default class GetUser {
  static async byId(id: number) {
    return User.query().preload('profile').preload('invoices').where({ id }).firstOrFail()
  }
}
