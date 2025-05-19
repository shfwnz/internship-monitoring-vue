<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api';

// components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// data
const internship = ref([]);

const isLoading = ref(true);

const fetchInternships = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await api.get('/internships/me', { headers });

    if (response.data.data) {
      internship.value = response.data.data;
    }

    console.log('Fetched internships:', internship.value);
  } catch (error) {
    console.error(error);
    toast.error('Failed to fetch internships');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchInternships();
});
</script>

<template>
  <RoleGuard :allowed-roles="['student']">
    <div class="container mx-auto py-2 flex flex-col min-h-screen">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-2 flex-grow">
        <!-- Progress Card -->
        <Card class="col-span-1 md:col-span-3 bg-white">
          <CardHeader>
            <div class="flex justify-between items-center">
              <div>
                <CardTitle class="text-xl capitalize"
                  >Internship Progress</CardTitle
                >
                <CardDescription>Current status and completion</CardDescription>
              </div>
              <Badge
                class="px-3 py-1.5 text-sm font-medium"
                :class="[
                  'bg-emerald-100 text-emerald-800 border border-emerald-200',
                ]"
              >
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-500">Progress</span>
              <span class="text-sm font-medium">65% completed</span>
            </div>

            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-amber-400 h-2.5 rounded-full"
                :style="{
                  width: `calc(${
                    ((new Date(internship.start_date) -
                      new Date(internship.end_date)) /
                      (new Date('2023-01-01') - new Date('2022-01-01'))) *
                    100
                  }%)`,
                }"
              ></div>
            </div>

            <div
              v-if="internship && internship.teacher"
              class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
            >
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">Start Date</span>
                <span class="font-medium">{{ internship.start_date }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">End Date</span>
                <span class="font-medium">{{ internship.end_date }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">Days Completed</span>
                <span class="font-medium">320 / 500</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">Supervisor</span>
                <span class="font-medium">{{
                  internship.teacher.user.name || '-'
                }}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter class="flex justify-between border-t pt-4">
            <span class="text-xs text-gray-500"
              >Last updated: {{ new Date().toLocaleString() }}</span
            >
            <Button
              variant="ghost"
              size="sm"
              class="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            >
              View Details
            </Button>
          </CardFooter>
        </Card>

        <!-- Industry Information -->
        <Card class="col-span-1 md:row-span-2">
          <CardHeader class="border-b">
            <CardTitle class="font-semibold text-2xl">Industry</CardTitle>
            <CardDescription>Company Information</CardDescription>
          </CardHeader>
          <CardContent class="flex-1 p-6 bg-white">
            <div
              class="space-y-4 text-sm"
              v-if="internship && internship.industry"
            >
              <div class="flex flex-col">
                <span class="text-sm mb-1">Name:</span>
                <span class="text-gray-600">{{
                  internship.industry.name || '-'
                }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm mb-1">Business Field:</span>
                <span class="text-gray-600">{{
                  internship.industry.business_field || '-'
                }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm mb-1">Address:</span>
                <span class="text-gray-600">
                  {{ internship.industry.address || '-' }}
                </span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm mb-1">Contact Information:</span>
                <span class="text-gray-600">{{
                  internship.industry.phone || '-'
                }}</span>
                <span class="text-gray-600">{{
                  internship.industry.email || '-'
                }}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter class="border-t justify-end">
            <Button class="bg-amber-400 hover:bg-amber-500">
              View More Details
            </Button>
          </CardFooter>
        </Card>

        <!-- Student Details -->
        <Card class="col-span-1 md:col-span-2">
          <CardHeader class="border-b">
            <CardTitle class="font-semibold text-2xl"
              >Student Details</CardTitle
            >
            <CardDescription>Student Information</CardDescription>
          </CardHeader>
          <CardContent
            v-if="internship && internship.student"
            class="grid grid-cols-1 flex-1 sm:grid-cols-2 gap-4 p-6 bg-white"
          >
            <div class="flex flex-col">
              <span class="text-sm mb-1">Student Name</span>
              <span class="text-gray-600">{{
                internship.student.user.name || 'Unknown'
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm mb-1">Student ID</span>
              <span class="text-gray-600">{{
                internship.student.nis || '-'
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm mb-1">Email</span>
              <span class="text-gray-600">{{
                internship.student.user.email || '-'
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm mb-1">Phone</span>
              <span class="text-gray-600">{{
                internship.student.phone || '-'
              }}</span>
            </div>
          </CardContent>
          <CardFooter class="justify-end p-4">
            <Button class="bg-amber-400 hover:bg-amber-500"> View All </Button>
          </CardFooter>
        </Card>

        <!-- Teacher Details -->
        <Card class="col-span-1 md:col-span-1">
          <CardHeader class="border-b">
            <CardTitle class="font-semibold text-2xl"
              >Teacher Details</CardTitle
            >
            <CardDescription>Teacher Information</CardDescription>
          </CardHeader>
          <CardContent class="p-4 flex-1">
            <div v-for="teacher in teachers" :key="teacher" class="grid gap-4">
              <div
                class="flex items-center justify-between border border-amber-100 rounded-xl p-4 bg-white hover:bg-amber-50 transition-colors shadow-sm hover:shadow"
              >
                <div class="ml-4">
                  <h3 class="font-semibold text-lg">Budi</h3>
                </div>
                <div class="flex flex-col items-end">
                  <div class="flex items-center mb-1">
                    <span class="mr-2 text-sm">NIP:</span>
                    <span
                      class="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded"
                      >123456789</span
                    >
                  </div>
                  <div class="flex items-center mb-1">
                    <span class="mr-2 text-sm">Email:</span>
                    <span
                      class="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded"
                      >123456789</span
                    >
                  </div>
                  <div class="flex items-center">
                    <span class="mr-2 text-sm">Phone:</span>
                    <span
                      class="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded"
                      >123456789</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter class="justify-end">
            <Button variant="ghost"> Contact Teacher </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </RoleGuard>
</template>
