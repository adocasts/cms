import type { MakeTuyauRequest, MakeTuyauResponse } from '@tuyau/utils/types'
import type { InferInput } from '@vinejs/vine/types'

type LoginGetHead = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/auth/login_controller.ts').default['show'], false>
}
type LoginPost = {
  request: MakeTuyauRequest<InferInput<typeof import('../app/validators/auth.ts')['loginValidator']>>
  response: MakeTuyauResponse<import('../app/controllers/auth/login_controller.ts').default['store'], true>
}
type LogoutPost = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/auth/logout_controller.ts').default['handle'], false>
}
type AssetsGetHead = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/assets_controller.ts').default['show'], false>
}
type AssetsIdPost = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/assets_controller.ts').default['store'], false>
}
type AssetsIdDelete = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/assets_controller.ts').default['destroy'], false>
}
type PostsGetHead = {
  request: MakeTuyauRequest<InferInput<typeof import('../app/validators/post.ts')['postIndexValidator']>>
  response: MakeTuyauResponse<import('../app/controllers/posts_controller.ts').default['index'], true>
}
type PostsSearchGetHead = {
  request: MakeTuyauRequest<InferInput<typeof import('../app/validators/post.ts')['postSearchValidator']>>
  response: MakeTuyauResponse<import('../app/controllers/posts_controller.ts').default['search'], true>
}
type PostsCreateGetHead = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/posts_controller.ts').default['create'], false>
}
type PostsIdEditGetHead = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/posts_controller.ts').default['edit'], false>
}
type PostsPost = {
  request: MakeTuyauRequest<InferInput<typeof import('../app/validators/post.ts')['postValidator']>>
  response: MakeTuyauResponse<import('../app/controllers/posts_controller.ts').default['store'], true>
}
type PostsIdPut = {
  request: MakeTuyauRequest<InferInput<typeof import('../app/validators/post.ts')['postValidator']>>
  response: MakeTuyauResponse<import('../app/controllers/posts_controller.ts').default['update'], true>
}
type PostsIdDelete = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/posts_controller.ts').default['destroy'], false>
}
type CollectionsGetHead = {
  request: MakeTuyauRequest<InferInput<typeof import('../app/validators/collection.ts')['collectionIndexValidator']>>
  response: MakeTuyauResponse<import('../app/controllers/collections_controller.ts').default['index'], true>
}
type CollectionsCreateGetHead = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/collections_controller.ts').default['create'], false>
}
type CollectionsIdEditGetHead = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/collections_controller.ts').default['edit'], false>
}
type CollectionsPost = {
  request: MakeTuyauRequest<InferInput<typeof import('../app/validators/collection.ts')['collectionValidator']>>
  response: MakeTuyauResponse<import('../app/controllers/collections_controller.ts').default['store'], true>
}
type CollectionsIdPut = {
  request: MakeTuyauRequest<InferInput<typeof import('../app/validators/collection.ts')['collectionValidator']>>
  response: MakeTuyauResponse<import('../app/controllers/collections_controller.ts').default['update'], true>
}
type CollectionsIdDelete = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/collections_controller.ts').default['destroy'], false>
}
type CollectionsIdEditContentGetHead = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/collection_contents_controller.ts').default['edit'], false>
}
type CollectionsIdContentPut = {
  request: MakeTuyauRequest<InferInput<typeof import('../app/validators/collection.ts')['collectionContentValidator']>>
  response: MakeTuyauResponse<import('../app/controllers/collection_contents_controller.ts').default['update'], true>
}
type TaxonomiesGetHead = {
  request: MakeTuyauRequest<InferInput<typeof import('../app/validators/taxonomy.ts')['taxonomyIndexValidator']>>
  response: MakeTuyauResponse<import('../app/controllers/taxonomies_controller.ts').default['index'], true>
}
type TaxonomiesCreateGetHead = {
  request: MakeTuyauRequest<InferInput<typeof import('../app/validators/taxonomy.ts')['taxonomyCreateValidator']>>
  response: MakeTuyauResponse<import('../app/controllers/taxonomies_controller.ts').default['create'], true>
}
type TaxonomiesPost = {
  request: MakeTuyauRequest<InferInput<typeof import('../app/validators/taxonomy.ts')['taxonomyValidator']>>
  response: MakeTuyauResponse<import('../app/controllers/taxonomies_controller.ts').default['store'], true>
}
type TaxonomiesIdEditGetHead = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/taxonomies_controller.ts').default['edit'], false>
}
type TaxonomiesIdPut = {
  request: MakeTuyauRequest<InferInput<typeof import('../app/validators/taxonomy.ts')['taxonomyValidator']>>
  response: MakeTuyauResponse<import('../app/controllers/taxonomies_controller.ts').default['update'], true>
}
type TaxonomiesIdDelete = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/taxonomies_controller.ts').default['destroy'], false>
}
type UsersGetHead = {
  request: MakeTuyauRequest<InferInput<typeof import('../app/validators/user.ts')['userIndexValidator']>>
  response: MakeTuyauResponse<import('../app/controllers/users_controller.ts').default['index'], true>
}
type UsersIdGetHead = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/users_controller.ts').default['show'], false>
}
type UsersIdRolePatch = {
  request: MakeTuyauRequest<InferInput<typeof import('../app/validators/user.ts')['userRoleValidator']>>
  response: MakeTuyauResponse<import('../app/controllers/users_controller.ts').default['role'], true>
}
type UsersIdDelete = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/users_controller.ts').default['destroy'], false>
}
export interface ApiDefinition {
  'login': {
    '$url': {
    };
    '$get': LoginGetHead;
    '$head': LoginGetHead;
    '$post': LoginPost;
  };
  'logout': {
    '$url': {
    };
    '$post': LogoutPost;
  };
  'assets': {
    '$url': {
    };
    '$get': AssetsGetHead;
    '$head': AssetsGetHead;
    '*': {
      '$url': {
      };
      '$get': AssetsGetHead;
      '$head': AssetsGetHead;
    };
    ':typeId?': {
      '$url': {
      };
      '$post': AssetsIdPost;
    };
    ':id': {
      '$url': {
      };
      '$delete': AssetsIdDelete;
    };
  };
  'posts': {
    '$url': {
    };
    '$get': PostsGetHead;
    '$head': PostsGetHead;
    'search': {
      '$url': {
      };
      '$get': PostsSearchGetHead;
      '$head': PostsSearchGetHead;
    };
    'create': {
      '$url': {
      };
      '$get': PostsCreateGetHead;
      '$head': PostsCreateGetHead;
    };
    ':id': {
      'edit': {
        '$url': {
        };
        '$get': PostsIdEditGetHead;
        '$head': PostsIdEditGetHead;
      };
      '$url': {
      };
      '$put': PostsIdPut;
      '$delete': PostsIdDelete;
    };
    '$post': PostsPost;
  };
  'collections': {
    '$url': {
    };
    '$get': CollectionsGetHead;
    '$head': CollectionsGetHead;
    'create': {
      '$url': {
      };
      '$get': CollectionsCreateGetHead;
      '$head': CollectionsCreateGetHead;
    };
    ':id': {
      'edit': {
        '$url': {
        };
        '$get': CollectionsIdEditGetHead;
        '$head': CollectionsIdEditGetHead;
        'content': {
          '$url': {
          };
          '$get': CollectionsIdEditContentGetHead;
          '$head': CollectionsIdEditContentGetHead;
        };
      };
      '$url': {
      };
      '$put': CollectionsIdPut;
      '$delete': CollectionsIdDelete;
      'content': {
        '$url': {
        };
        '$put': CollectionsIdContentPut;
      };
    };
    '$post': CollectionsPost;
  };
  'taxonomies': {
    '$url': {
    };
    '$get': TaxonomiesGetHead;
    '$head': TaxonomiesGetHead;
    'create': {
      '$url': {
      };
      '$get': TaxonomiesCreateGetHead;
      '$head': TaxonomiesCreateGetHead;
    };
    '$post': TaxonomiesPost;
    ':id': {
      'edit': {
        '$url': {
        };
        '$get': TaxonomiesIdEditGetHead;
        '$head': TaxonomiesIdEditGetHead;
      };
      '$url': {
      };
      '$put': TaxonomiesIdPut;
      '$delete': TaxonomiesIdDelete;
    };
  };
  'users': {
    '$url': {
    };
    '$get': UsersGetHead;
    '$head': UsersGetHead;
    ':id': {
      '$url': {
      };
      '$get': UsersIdGetHead;
      '$head': UsersIdGetHead;
      'role': {
        '$url': {
        };
        '$patch': UsersIdRolePatch;
      };
      '$delete': UsersIdDelete;
    };
  };
}
const routes = [
  {
    params: ["*"],
    name: 'drive.fs.serve',
    path: '/uploads/*',
    method: ["GET","HEAD"],
    types: {} as unknown,
  },
  {
    params: [],
    name: 'auth.login.show',
    path: '/login',
    method: ["GET","HEAD"],
    types: {} as LoginGetHead,
  },
  {
    params: [],
    name: 'auth.login.store',
    path: '/login',
    method: ["POST"],
    types: {} as LoginPost,
  },
  {
    params: [],
    name: 'auth.logout',
    path: '/logout',
    method: ["POST"],
    types: {} as LogoutPost,
  },
  {
    params: [],
    name: 'dashboard',
    path: '/',
    method: ["GET","HEAD"],
    types: {} as unknown,
  },
  {
    params: ["*"],
    name: 'assets.show',
    path: '/assets/*',
    method: ["GET","HEAD"],
    types: {} as AssetsGetHead,
  },
  {
    params: ["typeId"],
    name: 'assets.store',
    path: '/assets/:typeId?',
    method: ["POST"],
    types: {} as AssetsIdPost,
  },
  {
    params: ["id"],
    name: 'assets.destroy',
    path: '/assets/:id',
    method: ["DELETE"],
    types: {} as AssetsIdDelete,
  },
  {
    params: [],
    name: 'posts.index',
    path: '/posts',
    method: ["GET","HEAD"],
    types: {} as PostsGetHead,
  },
  {
    params: [],
    name: 'posts.search',
    path: '/posts/search',
    method: ["GET","HEAD"],
    types: {} as PostsSearchGetHead,
  },
  {
    params: [],
    name: 'posts.create',
    path: '/posts/create',
    method: ["GET","HEAD"],
    types: {} as PostsCreateGetHead,
  },
  {
    params: ["id"],
    name: 'posts.edit',
    path: '/posts/:id/edit',
    method: ["GET","HEAD"],
    types: {} as PostsIdEditGetHead,
  },
  {
    params: [],
    name: 'posts.store',
    path: '/posts',
    method: ["POST"],
    types: {} as PostsPost,
  },
  {
    params: ["id"],
    name: 'posts.update',
    path: '/posts/:id',
    method: ["PUT"],
    types: {} as PostsIdPut,
  },
  {
    params: ["id"],
    name: 'posts.destroy',
    path: '/posts/:id',
    method: ["DELETE"],
    types: {} as PostsIdDelete,
  },
  {
    params: [],
    name: 'collections.index',
    path: '/collections',
    method: ["GET","HEAD"],
    types: {} as CollectionsGetHead,
  },
  {
    params: [],
    name: 'collections.create',
    path: '/collections/create',
    method: ["GET","HEAD"],
    types: {} as CollectionsCreateGetHead,
  },
  {
    params: ["id"],
    name: 'collections.edit',
    path: '/collections/:id/edit',
    method: ["GET","HEAD"],
    types: {} as CollectionsIdEditGetHead,
  },
  {
    params: [],
    name: 'collections.store',
    path: '/collections',
    method: ["POST"],
    types: {} as CollectionsPost,
  },
  {
    params: ["id"],
    name: 'collections.update',
    path: '/collections/:id',
    method: ["PUT"],
    types: {} as CollectionsIdPut,
  },
  {
    params: ["id"],
    name: 'collections.destroy',
    path: '/collections/:id',
    method: ["DELETE"],
    types: {} as CollectionsIdDelete,
  },
  {
    params: ["id"],
    name: 'collections.edit.content',
    path: '/collections/:id/edit/content',
    method: ["GET","HEAD"],
    types: {} as CollectionsIdEditContentGetHead,
  },
  {
    params: ["id"],
    name: 'collections.update.content',
    path: '/collections/:id/content',
    method: ["PUT"],
    types: {} as CollectionsIdContentPut,
  },
  {
    params: [],
    name: 'taxonomies.index',
    path: '/taxonomies',
    method: ["GET","HEAD"],
    types: {} as TaxonomiesGetHead,
  },
  {
    params: [],
    name: 'taxonomies.create',
    path: '/taxonomies/create',
    method: ["GET","HEAD"],
    types: {} as TaxonomiesCreateGetHead,
  },
  {
    params: [],
    name: 'taxonomies.store',
    path: '/taxonomies',
    method: ["POST"],
    types: {} as TaxonomiesPost,
  },
  {
    params: ["id"],
    name: 'taxonomies.edit',
    path: '/taxonomies/:id/edit',
    method: ["GET","HEAD"],
    types: {} as TaxonomiesIdEditGetHead,
  },
  {
    params: ["id"],
    name: 'taxonomies.update',
    path: '/taxonomies/:id',
    method: ["PUT"],
    types: {} as TaxonomiesIdPut,
  },
  {
    params: ["id"],
    name: 'taxonomies.destroy',
    path: '/taxonomies/:id',
    method: ["DELETE"],
    types: {} as TaxonomiesIdDelete,
  },
  {
    params: [],
    name: 'users.index',
    path: '/users',
    method: ["GET","HEAD"],
    types: {} as UsersGetHead,
  },
  {
    params: ["id"],
    name: 'users.show',
    path: '/users/:id',
    method: ["GET","HEAD"],
    types: {} as UsersIdGetHead,
  },
  {
    params: ["id"],
    name: 'users.update.role',
    path: '/users/:id/role',
    method: ["PATCH"],
    types: {} as UsersIdRolePatch,
  },
  {
    params: ["id"],
    name: 'users.destroy',
    path: '/users/:id',
    method: ["DELETE"],
    types: {} as UsersIdDelete,
  },
] as const;
export const api = {
  routes,
  definition: {} as ApiDefinition
}
declare module '@tuyau/inertia/types' {
  type InertiaApi = typeof api
  export interface Api extends InertiaApi {}
}
