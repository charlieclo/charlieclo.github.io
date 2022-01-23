<template>
  <div class="home__full">
    <div class="home__container">
      <div class="hero__container">
        <h1 class="hero__title animate-fade-in-bottom">Home</h1>
        <h4 class="hero__subtitle">A home with beautiful view</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.home {
  &__full {
    @apply container mx-auto;
  }

  &__container {
    @apply h-full;
    @apply bg-white;
    @apply flex flex-col;
  }
}

.hero {
  &__container {
    @apply flex flex-col items-center gap-4;
  }

  &__title {
    @apply font-bold;
    @apply uppercase;
  }

  &__subtitle {
    @apply font-light;
  }
}
</style>