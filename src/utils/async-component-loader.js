import { defineAsyncComponent } from 'vue'

const loadIcon = (name) => defineAsyncComponent({
  loader: () => import(`../components/icons/${name}Icon.vue`),
  errorComponent: null,
  loadingComponent: null
})

const getIcon = (name) => {
  return loadIcon(name)
}

export { getIcon }