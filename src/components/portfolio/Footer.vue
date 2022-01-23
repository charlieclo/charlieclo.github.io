<template>
  <div class="footer__full">
    <div class="footer__navigation">
      <router-link
        v-for="(navigationItem, index) in basicNavigationItems"
        :key="index"
        :to="navigationItem.url"
        class="footer__navigation-item"
      >
        <h5>{{ navigationItem.name }}</h5>
        <component
          :is="getIcon(navigationItem.icon)"
          class="icon"
        />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from '@vue/reactivity'
import { getIcon } from '@/utils/async-component-loader'

const props = defineProps({
  navigationItems: {
    type: Array,
    default: () => []
  }
})

const { navigationItems } = toRefs(props)

const basicNavigationItems = navigationItems.value.filter((item) => item.type === 'Basic').sort((itemA, itemB) => itemA.order - itemB.order)
</script>

<style lang="scss" scoped>
.footer {
  &__full {
    @apply w-full;
    @apply border-2 rounded-t-2xl;
    @apply shadow-2xl;
    @apply absolute bottom-0;
    @apply z-10;
    @apply bg-royal-white;
  }

  &__navigation {
    @apply container mx-auto;
    @apply flex md:hidden justify-around items-center;

    &-item {
      @apply w-12 h-12 py-3 md:p-0;
      @apply flex flex-row-reverse flex-full justify-center items-center gap-1;
      @apply text-royal-black font-semibold;
      @apply transition-colors;
      @apply hover:text-royal-blue;

      .icon {
        @apply w-5 h-5;
      }

      &.active {
        @apply text-royal-blue;
      }
    }
  }
}
</style>