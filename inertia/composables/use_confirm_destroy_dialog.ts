import { getCurrentInstance, h, onUnmounted, ref, render } from 'vue'
import ConfirmDestroyDialog, { ShowProps } from '~/components/ConfirmDestroyDialog.vue'

export default function useConfirmDestroyDialog({ to = 'body' } = {}) {
  const self = getCurrentInstance()
  const exposed = ref<Record<string, any> | null>()
  const close = () => ((exposed.value = null), render(null, document.querySelector(to)!))

  onUnmounted(close)

  // const show = (props: ShowProps) => {
  const vnode = h(ConfirmDestroyDialog)
  vnode.key = Math.random()
  vnode.appContext = self!.appContext
  render(vnode, document.querySelector(to)!)
  exposed.value = vnode.component!.exposed
  return exposed
  // }

  // return { show }
}
