<script setup lang="ts">
import { Link } from '@tuyau/inertia/vue'
import { Link as ILink } from '@inertiajs/vue3'
import { CornerLeftDown, Library, Plus, Trash2 } from 'lucide-vue-next'
import { router } from '@inertiajs/vue3'
import { tuyau } from '~/lib/tuyau'
import useConfirmDestroyDialog from '~/composables/use_confirm_destroy_dialog'
import TaxonomyTypes, { TaxonomyTypeDesc } from '#enums/taxonomy_types'
import TaxonomyDto from '#dtos/taxonomy'
import { computed } from 'vue'

const props = defineProps<{
  taxonomyTypeId?: TaxonomyTypes
  parent?: TaxonomyDto
  taxonomies: TaxonomyDto[]
}>()

const destroy = useConfirmDestroyDialog()
const pageTitle = computed(() => {
  if (props.parent) return props.parent.name
  return 'Taxonomies'
})

async function onDelete(taxonomy: TaxonomyDto) {
  destroy.value?.show({
    title: 'Delete Taxonomy?',
    message: `Are you sure you'd like to delete the taxonomy "${taxonomy.name}"? Once deleted, it'll be gone forever.`,
    async onConfirm() {
      await router.delete(tuyau.taxonomies({ id: taxonomy.id }).$url(), { preserveScroll: true })
    },
  })
}
</script>

<template>
  <div class="flex justify-between items-center gap-3 mb-3">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem class="hidden md:block">
          <BreadcrumbLink as-child>
            <Link route="dashboard"> Dashboard </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="hidden md:block" />
        <BreadcrumbItem v-if="parent" class="hidden md:block">
          <BreadcrumbLink as-child>
            <Link route="taxonomies.index"> Taxonomies </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="parent" class="hidden md:block" />
        <BreadcrumbItem v-if="taxonomyTypeId" class="hidden md:block">
          <BreadcrumbLink as-child>
            <ILink :href="tuyau.$url('taxonomies.index', { query: { taxonomyTypeId } })">
              {{ TaxonomyTypeDesc[taxonomyTypeId] }}
            </ILink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="taxonomyTypeId" class="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{{ pageTitle }}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex items-center gap-3">
      <Button v-if="parent" as-child>
        <ILink :href="tuyau.$url('taxonomies.create', { query: { parentId: parent.id } })">
          <Plus class="w-3 h-3" />
          Add New Child
        </ILink>
      </Button>
      <Button v-else :as="Link" route="taxonomies.create">
        <Plus class="w-4 h-4" />
        New Taxonomy
      </Button>
    </div>
  </div>

  <div class="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xl">
    <Table>
      <TableHeader class="bg-slate-100">
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead v-if="parent">Parent</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Content</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="taxonomy in taxonomies" :key="taxonomy.id">
          <TableCell>
            <Link route="taxonomies.edit" :params="{ id: taxonomy.id }" class="hover:underline">
              {{ taxonomy.name }}
            </Link>
            <div class="text-slate-600 text-xs">
              <a :href="`https://adocasts.com/topics/${taxonomy.slug}`" class="hover:underline">
                {{ taxonomy.slug }}
              </a>
            </div>
          </TableCell>
          <TableCell v-if="parent">
            <Link
              v-if="taxonomy.parent"
              route="taxonomies.edit"
              :params="{ id: taxonomy.parent.id }"
              class="hover:underline"
            >
              {{ taxonomy.parent.name }}
            </Link>
          </TableCell>
          <TableCell>
            {{ TaxonomyTypeDesc[taxonomy.taxonomyTypeId] }}
          </TableCell>
          <TableCell>
            <div class="text-xs">
              <div>{{ taxonomy.meta.posts_count }} Posts</div>
              <div>{{ taxonomy.meta.collections_count }} Collections</div>
            </div>
          </TableCell>
          <TableCell>
            <div class="flex items-center justify-end gap-3">
              <Button
                v-if="!parent && Number(taxonomy.meta.children_count)"
                variant="secondary"
                size="sm"
                as-child
              >
                <ILink
                  :href="
                    tuyau.$url('taxonomies.index', {
                      query: { parentId: taxonomy.id, taxonomyTypeId },
                    })
                  "
                >
                  <CornerLeftDown class="w-3 h-3" />
                  View {{ taxonomy.meta.children_count }} Children
                </ILink>
              </Button>
              <Button v-if="!parent" variant="secondary" size="sm" as-child>
                <ILink
                  :href="tuyau.$url('taxonomies.create', { query: { parentId: taxonomy.id } })"
                >
                  <Plus class="w-3 h-3" />
                  Add Child
                </ILink>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="hover:text-red-500"
                @click="onDelete(taxonomy)"
              >
                <Trash2 class="w-3 h-3" />
                Delete
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
