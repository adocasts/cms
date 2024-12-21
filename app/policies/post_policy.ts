import User from '#models/user'
import Post from '#models/post'
import CmsPolicy from './cms_policy.js'

export default class PostPolicy extends CmsPolicy {
  public viewList(user: User) {
    return this.isLvl1Contributor(user)
  }

  public create(user: User) {
    return this.isLvl1Contributor(user)
  }

  public async update(user: User, post: Post) {
    return this.isOwner(user, post)
  }

  public async destroy(user: User, post: Post) {
    return this.isOwner(user, post)
  }

  private async isOwner(user: User, post: Post) {
    const author = await post.related('authors').query().where('users.id', user.id).first()
    return !!author
  }
}
