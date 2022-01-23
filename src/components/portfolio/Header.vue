<template>
  <div class="header__full">
    <div class="header__container"> 
      <h1 class="header__title">CLO</h1>
      <div class="header__navigation">
        <router-link
          v-for="(navigationItem, index) in navigationItems"
          :key="index"
          :to="navigationItem.url"
          class="header__navigation-item"
          :class="{ 'as-button': navigationItem.type === 'Button' }"
        >
          <component
            :is="getIcon(navigationItem.icon)"
            class="icon"
            :class="{ 'animate-wobble-bottom': navigationItem.type === 'Button' }"
          />
          <p>{{ navigationItem.name }}</p>
        </router-link>
      </div>
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
</script>

<style lang="scss" scoped>
.header {
  &__full {
    @apply max-w-full;
    @apply md:sticky top-0;
    @apply z-10;
    @apply bg-royal-blue;
  }

  &__container {
    @apply container mx-auto px-6 md:px-0 py-2 md:py-4;
    @apply flex justify-between items-center;
  }

  &__title {
    @apply px-1 border-y-4 border-white;
    @apply font-obidee-sans font-bold text-white;
  }

  &__navigation {
    @apply flex flex-row gap-6;

    &-item {
      @apply p-3 md:p-4 rounded;
      @apply hidden md:flex flex-row flex-nowrap justify-center items-center gap-1;
      @apply text-sm md:text-base text-royal-white font-semibold;
      @apply cursor-pointer;
      @apply transition-colors;
      @apply hover:bg-royal-white hover:text-royal-blue;

      &.active {
        @apply bg-royal-white;
        @apply text-royal-blue;
      }

      &.as-button {
        @apply border-2 border-royal-blue rounded-xl;
        @apply shadow-sm shadow-royal-black;
        @apply flex;
        @apply bg-royal-white;
        @apply text-royal-blue;
        @apply hover:border-royal-white hover:bg-blue-600 hover:text-royal-white;
      }

      .icon {
        @apply w-6 h-6;
      }
    }
  }
}
</style>