<script setup>
import Navbar from './Navbar.vue';
</script>

<template>
  <div class="m-4 flex flex-col space-y-2">
    <Navbar class="sticky top-0 z-50 shadow-md" />
    <main>
      <router-view />
    </main>
  </div>
</template>
