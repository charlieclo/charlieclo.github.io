<template>
  <div class="layout__container">
    <Header :navigationItems="navigations" />
    <router-view
      v-slot="{ Component }"
      class="layout__content"
    >
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <Footer :navigationItems="navigations" />
  </div>
</template>

<script setup>
import Header from '@/components/portfolio/Header.vue'
import Footer from '@/components/portfolio/Footer.vue'
import { computed } from '@vue/reactivity'
import { useStore } from 'vuex'

const store = useStore()

const navigations = computed(() => store.getters['portfolio/getNavigations'])
</script>

<style lang="scss" scoped>
.layout {
  &__container {
    @apply h-screen;
    @apply flex flex-col flex-nowrap;
    @apply overflow-x-hidden overflow-y-auto scroll-smooth;

    &::-webkit-scrollbar {
      @apply w-1;
    }

    &::-webkit-scrollbar-track {
      @apply bg-gray-400;
    }

    &::-webkit-scrollbar-thumb {
      @apply bg-gray-700;
    }
  }

  &__content {
    @apply mb-14 md:mb-0;
    @apply flex-full;
  }
}

.fade {
  &-enter {
    &-from {
      @apply opacity-0;
    }

    &-active {
      @apply transition-opacity;
    }
  }

  &-leave {
    &-active {
      @apply transition-opacity;
    }

    &-to {
      @apply opacity-0;
    }
  }
}
</style>