<script setup>
import Navbar from './Navbar.vue';
</script>

<template>
  <div class="m-4 flex flex-col space-y-2">
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>
