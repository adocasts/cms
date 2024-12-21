/*
|--------------------------------------------------------------------------
| Bouncer policies
|--------------------------------------------------------------------------
|
| You may define a collection of policies inside this file and pre-register
| them when creating a new bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

export const policies = {
  AssetPolicy: () => import('#policies/asset_policy'),
  CmsPolicy: () => import('#policies/cms_policy'),
  TaxonomyPolicy: () => import('#policies/taxonomy_policy'),
  PostPolicy: () => import('#policies/post_policy'),
  CollectionPolicy: () => import('#policies/collection_policy'),
}
