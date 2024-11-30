/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { createApp, h } from 'vue'
import type { DefineComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import AppLayout from '~/layouts/AppLayout.vue'
import { TuyauPlugin } from '@tuyau/inertia/vue'
import { tuyau } from '~/lib/tuyau'
import { plugin as VueTippy } from 'vue-tippy'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'

const appName = import.meta.env.VITE_APP_NAME || 'Adocasts CMS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: async (name) => {
    const page = await resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue')
    )
    page.default.layout = page.default.layout || AppLayout
    return page
  },

  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .use(TuyauPlugin, { client: tuyau })
      .use(VueTippy, {
        directive: 'tippy',
        component: 'tippy',
      })
      .mount(el)
  },
})
