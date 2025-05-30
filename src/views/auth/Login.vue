<script setup>
// Vue
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Third party
import { toast, Toaster } from 'vue-sonner';

// API
import { api, LARAVEL_BASE_URL } from '@/api';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const router = useRouter();
const error = ref('');

const formData = ref({
  email: '',
  password: '',
});

const isLoading = ref(false);

const login = async () => {
  isLoading.value = true;
  try {
    const response = await api.post('/login', {
      email: formData.value.email,
      password: formData.value.password,
    });

    if (response.data.success) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Set role
      const userableType = response.data.user.userable_type;
      const role = userableType.toLowerCase().split('\\').pop();
      localStorage.setItem('role', role);

      toast.success('Login Successful');

      if (role === 'student') {
        router.push('app/student');
      } else if (role === 'teacher') {
        router.push('app/teacher');
      }
    } else {
      error.value = response.data.message || 'Login failed';
      toast.error('Login Failed', {
        description: error.value,
      });
    }
  } catch (err) {
    console.error(err);
    error.value =
      err.response?.data?.message || 'Login failed. Please try again.';
    toast.error('Login Error', {
      description: error.value,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="h-screen flex justify-center items-center">
    <Card
      class="flex flex-col justify-center px-6 py-12 w-full max-w-md h-full md:h-auto rounded-none md:rounded-xl"
    >
      <CardHeader class="flex flex-col items-center">
        <CardTitle class="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Welcome to simPKL</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="login">
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                v-model="formData.email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="password">Password</Label>
              <Input
                id="password"
                type="password"
                v-model="formData.password"
                placeholder="Enter your password"
                required
              />
            </div>

            <div v-if="error" class="text-red-500 text-sm mt-2">
              {{ error }}
            </div>

            <Button
              type="submit"
              variant="default"
              class="bg-amber-400 hover:bg-amber-500 mt-4 w-full"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Logging in...</span>
              <span v-else>Login</span>
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-between">
        <a href="/register" class="text-sm text-blue-600 hover:underline"
          >Don't have an account?</a
        >
      </CardFooter>
    </Card>
  </div>
</template>
