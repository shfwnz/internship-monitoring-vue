<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  allowedRoles: {
    type: Array,
    required: true,
  },
  fallbackRoute: {
    type: String,
    default: '/unauthorized',
  },
});

const router = useRouter();
const userRole = ref(localStorage.getItem('role') || null);
const hasAccess = ref(false);

onMounted(() => {
  // Check if user has the required role
  hasAccess.value = props.allowedRoles.includes(userRole.value);

  // If no access, redirect to fallback route
  if (!hasAccess.value) {
    console.warn(
      `Unauthorized access attempt. User role: ${
        userRole.value
      }, Required roles: ${props.allowedRoles.join(', ')}`
    );
    router.push(props.fallbackRoute);
  }
});
</script>

<template>
  <slot v-if="hasAccess" />
  <div v-else class="flex items-center justify-center h-screen">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h2>
      <p class="mb-4">You don't have permission to view this page.</p>
      <button
        @click="router.push('/')"
        class="bg-amber-400 hover:bg-amber-500 px-4 py-2 rounded"
      >
        Return to Home
      </button>
    </div>
  </div>
</template>
