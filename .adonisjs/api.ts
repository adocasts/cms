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
type PostsGetHead = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/posts_controller.ts').default['index'], false>
}
type PostsIdGetHead = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/posts_controller.ts').default['show'], false>
}
type PostsPost = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/posts_controller.ts').default['store'], false>
}
type PostsIdPut = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/posts_controller.ts').default['update'], false>
}
type PostsIdDelete = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/posts_controller.ts').default['destroy'], false>
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
  'posts': {
    '$url': {
    };
    '$get': PostsGetHead;
    '$head': PostsGetHead;
    ':id': {
      '$url': {
      };
      '$get': PostsIdGetHead;
      '$head': PostsIdGetHead;
      '$put': PostsIdPut;
      '$delete': PostsIdDelete;
    };
    ':slug': {
      '$url': {
      };
      '$get': PostsIdGetHead;
      '$head': PostsIdGetHead;
    };
    '$post': PostsPost;
  };
}
const routes = [
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
    params: [],
    name: 'posts.index',
    path: '/posts',
    method: ["GET","HEAD"],
    types: {} as PostsGetHead,
  },
  {
    params: ["id"],
    name: 'posts.show',
    path: '/posts/:id',
    method: ["GET","HEAD"],
    types: {} as PostsIdGetHead,
  },
  {
    params: ["slug"],
    name: 'posts.slug',
    path: '/posts/:slug',
    method: ["GET","HEAD"],
    types: {} as PostsIdGetHead,
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
] as const;
export const api = {
  routes,
  definition: {} as ApiDefinition
}
declare module '@tuyau/inertia/types' {
  type InertiaApi = typeof api
  export interface Api extends InertiaApi {}
}
