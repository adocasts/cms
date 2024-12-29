import Collection from '#models/collection'
import { collectionContentValidator } from '#validators/collection'
import { Infer } from '@vinejs/vine/types'
import GetCollectionContent from './get_collection_content.js'
import db from '@adonisjs/lucid/services/db'
import Post from '#models/post'
import User from '#models/user'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

type Data = Infer<typeof collectionContentValidator>

type Params = {
  collectionId: number
  data: Data
  user: User
}

export default class SyncCollectionContent {
  declare user: User
  declare collection: Collection
  declare modules: Collection[]
  declare posts: Post[]

  #rootSortOrder = -1

  async handle({ user, collectionId, data }: Params) {
    this.user = user

    await this.loadContent(collectionId)

    await db.transaction(async (trx) => {
      this.collection.useTransaction(trx)

      const promises = data.subcollections.map(async (subcollection, index) => {
        const module = await this.findOrCreateModule(subcollection, trx)

        module.sortOrder = index

        await this.syncPosts(module, subcollection.postIds)

        return module.save()
      })

      await this.syncPosts(this.collection, data.postIds)
      await this.destroyRemovedModules(data.subcollections)

      return Promise.all(promises)
    })
  }

  async loadContent(collectionId: number) {
    const content = await GetCollectionContent.byId(collectionId)

    this.collection = content.collection
    this.modules = content.modules
    this.posts = content.posts

    return content
  }

  async findOrCreateModule(module: Data['subcollections'][0], trx: TransactionClientContract) {
    // negative id values indicate new modules
    if (module.id > -1) {
      const record = await Collection.findOrFail(module.id)
      record.useTransaction(trx)
      return record
    }

    return this.collection.related('children').create(
      {
        ownerId: this.user.id,
        name: module.name,
        collectionTypeId: this.collection.collectionTypeId,
      },
      { client: trx }
    )
  }

  async destroyRemovedModules(subcollections: Data['subcollections']) {
    const removedModules = this.modules.filter((module) => {
      const exists = subcollections.some((subcollection) => subcollection.id === module.id)
      return !exists
    })

    const promises = removedModules.map(async (module) => {
      await module.related('posts').detach()
      return module.delete()
    })

    return Promise.all(promises)
  }

  async syncPosts(collection: Collection, postIds?: number[]) {
    if (!postIds) {
      return collection.related('posts').detach()
    }

    const data = postIds.reduce(this.syncPostReducer.bind(this), {})
    await collection.related('posts').sync(data)
  }

  syncPostReducer(syncData: Record<number, any>, id: number, index: number) {
    return {
      ...syncData,
      [id]: {
        sort_order: index,
        root_sort_order: ++this.#rootSortOrder,
        root_collection_id: this.collection.id,
      },
    }
  }
}
