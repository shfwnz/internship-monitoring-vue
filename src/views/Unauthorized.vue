<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const userRole = localStorage.getItem('role');

const goToHome = () => {
  if (!userRole) {
    router.push('/');
  } else {
    const defaultRoute =
      userRole === 'student'
        ? 'student'
        : userRole === 'teacher'
        ? 'teacher'
        : userRole === 'admin'
        ? 'admin'
        : 'home';
    router.push({ name: defaultRoute });
  }
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4"
  >
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-red-600">
          Unauthorized Access
        </h2>
        <p class="mt-2 text-gray-600">
          You don't have permission to view the requested page.
        </p>
      </div>

      <div class="mt-6">
        <div class="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <!-- Warning icon -->
              <svg
                class="h-5 w-5 text-amber-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-amber-700">
                If you believe this is an error, please contact your
                administrator.
              </p>
            </div>
          </div>
        </div>

        <button
          @click="goToHome"
          type="button"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-400 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  </div>
</template>
