<script setup>
// Vue
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// Third party
import { toast, Toaster } from 'vue-sonner';

// API
import api from '@/api';

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

const formData = ref({
  name: '',
  email: '',
  password: '',
  role: '',
  nis: '',
  nip: '',
});

const showRegistrationForm = ref(false);
const loading = ref(false);

const handleRole = (role) => {
  formData.value.role = role;
  showRegistrationForm.value = true;
};

const roleTitle = computed(() => {
  return formData.value.role === 'teacher' ? 'Teacher' : 'Student';
});

const goBack = () => {
  showRegistrationForm.value = false;
  formData.value.role = '';
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    const payload = {
      role: formData.value.role,
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
    };

    if (formData.value.role === 'student') {
      payload.nis = formData.value.nis;
    } else {
      payload.nip = formData.value.nip;
    }

    const response = await api.post('/register', payload);

    if (response.data.success) {
      toast.success('Registration successful');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } else {
      toast.error(response.data.message || 'Registration failed');
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Registration failed');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="h-screen flex justify-center items-center">
    <Card
      v-if="!showRegistrationForm"
      class="flex flex-col justify-center px-6 py-12 w-full h-full md:h-auto max-w-md rounded-none md:rounded-3xl"
    >
      <CardHeader class="flex flex-col items-center">
        <CardTitle class="text-2xl font-bold">Who are you?</CardTitle>
        <CardDescription>Select your role</CardDescription>
      </CardHeader>
      <CardContent class="grid grid-cols-2 gap-4">
        <Button
          class="bg-blue-400 hover:bg-blue-500"
          @click="handleRole('teacher')"
          >Teacher</Button
        >
        <Button
          class="bg-amber-400 hover:bg-amber-500"
          @click="handleRole('student')"
          >Student</Button
        >
      </CardContent>
      <CardFooter class="flex justify-center">
        <router-link to="/login" class="text-sm text-blue-600 hover:underline"
          >Already have an account?</router-link
        >
      </CardFooter>
    </Card>

    <!-- Registration Form -->
    <Card
      v-else
      class="flex flex-col justify-center px-6 py-12 w-full h-full md:h-auto max-w-md rounded-none md:rounded-3xl"
    >
      <CardHeader class="flex flex-col items-center">
        <CardTitle class="text-2xl font-bold"
          >Register as {{ roleTitle }}</CardTitle
        >
        <CardDescription class="lowercase"
          >Enter your information below</CardDescription
        >
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-1.5">
            <Label for="name">Full Name</Label>
            <Input
              id="name"
              v-model="formData.name"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div class="space-y-1.5">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              v-model="formData.email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="space-y-1.5">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              v-model="formData.password"
              placeholder="Enter your password"
              required
            />
          </div>

          <div class="space-y-1.5" v-if="formData.role === 'teacher'">
            <Label for="nip">Teacher ID (NIP)</Label>
            <Input
              id="nip"
              v-model="formData.nip"
              placeholder="Enter your Teacher ID (NIP)"
              required
            />
          </div>

          <div class="space-y-1.5" v-if="formData.role === 'student'">
            <Label for="nis">Student ID (NIS)</Label>
            <Input
              id="nis"
              v-model="formData.nis"
              placeholder="Enter your Student ID (NIS)"
              required
            />
          </div>

          <div class="flex justify-between pt-4">
            <Button
              type="button"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800"
              @click="goBack"
              :disabled="loading"
            >
              Back
            </Button>

            <Button
              type="submit"
              class="bg-blue-400 hover:bg-blue-500"
              v-if="formData.role === 'teacher'"
              :disabled="loading"
            >
              {{ loading ? 'Processing...' : 'Register' }}
            </Button>
            <Button
              type="submit"
              class="bg-amber-400 hover:bg-amber-500"
              v-else
              :disabled="loading"
            >
              {{ loading ? 'Processing...' : 'Register' }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
