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

const isActive = ref(false);
const isLoading = ref(true);

const studentStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await api.get('/me', { headers });
    console.log(response.data.data.profile);

    if (response.data.data.profile) {
      isActive.value = response.data.data.profile.status;
      console.log(isActive.value);
    }
  } catch (error) {
    console.error(error);
    toast.error('Failed to fetch user data');
  }
};

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

const durationMonths = computed(() => {
  const startDate = new Date(internship.value.start_date);
  const endDate = new Date(internship.value.end_date);

  const timeDifference = endDate.getTime() - startDate.getTime();

  const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));

  return `${months} months`;
});

const progressPercentage = computed(() => {
  const currentDate = new Date();

  const startDate = new Date(internship.value.start_date);
  const endDate = new Date(internship.value.end_date);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return 0;
  }

  const elapsedTime = currentDate.getTime() - startDate.getTime();
  const totalDuration = endDate.getTime() - startDate.getTime();

  if (elapsedTime <= 0) return 0;
  if (elapsedTime >= totalDuration) return 100;

  return Math.floor((elapsedTime / totalDuration) * 100);
});

onMounted(() => {
  studentStatus();
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
                :class="
                  isActive
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                "
              >
                {{ isActive ? 'Active' : 'Inactive' }}
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-4 flex-1 flex flex-col justify-center">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-500">Progress</span>
              <span class="text-sm font-medium"
                >{{ progressPercentage }}% completed</span
              >
            </div>

            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-amber-400 h-2.5 rounded-full"
                :style="{
                  width: `${progressPercentage}%`,
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
                <span class="text-xs text-gray-500">Duration</span>
                <span class="font-medium">{{ durationMonths }}</span>
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
              >Last updated: {{ new Date().toLocaleDateString() }}</span
            >
            <Button
              variant="ghost"
              size="sm"
              class="text-amber-600 hover:text-amber-700"
            >
              View Details
            </Button>
          </CardFooter>
        </Card>

        <!-- Industry Information -->
        <Card class="col-span-1 md:row-span-1">
          <CardHeader>
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
            <Button
              variant="ghost"
              size="sm"
              class="text-amber-600 hover:text-amber-700"
            >
              View Details
            </Button>
          </CardFooter>
        </Card>

        <!-- Student Details -->
        <Card class="col-span-1 md:col-span-2">
          <CardHeader>
            <div class="flex justify-between items-center">
              <div>
                <CardTitle class="font-semibold text-2xl"
                  >Student Details</CardTitle
                >
                <CardDescription>Student Information</CardDescription>
              </div>
              <Badge
                class="px-3 py-1.5 text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
              >
                Student
              </Badge>
            </div>
          </CardHeader>
          <CardContent
            class="p-4 flex-1"
            v-if="internship && internship.student"
          >
            <div class="grid gap-4">
              <div
                class="border border-gray-100 rounded-xl p-4 bg-white hover:bg-gray-50 transition-colors shadow-sm hover:shadow"
              >
                <div class="flex justify-between items-start mb-4">
                  <h3 class="font-semibold text-lg text-gray-800">
                    {{ internship.student.user.name || 'Unknown' }}
                  </h3>
                  <span
                    class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                  >
                    {{ internship.student.major || 'Student' }}
                  </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div class="flex items-center">
                    <span class="text-gray-500 text-sm w-16">NIS:</span>
                    <span
                      class="text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-md flex-1"
                    >
                      {{ internship.student.nis || '-' }}
                    </span>
                  </div>

                  <div class="flex items-center">
                    <span class="text-gray-500 text-sm w-16">Email:</span>
                    <span
                      class="text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-md flex-1 truncate"
                    >
                      {{ internship.student.user.email || '-' }}
                    </span>
                  </div>

                  <div class="flex items-center">
                    <span class="text-gray-500 text-sm w-16">Phone:</span>
                    <span
                      class="text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-md flex-1"
                    >
                      {{ internship.student.phone || '-' }}
                    </span>
                  </div>

                  <div class="flex items-center">
                    <span class="text-gray-500 text-sm w-16">Class:</span>
                    <span
                      class="text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-md flex-1"
                    >
                      {{ internship.student.class || '-' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter class="border-t justify-end">
            <Button
              variant="ghost"
              size="sm"
              class="text-amber-600 hover:text-amber-700"
            >
              View Details
            </Button>
          </CardFooter>
        </Card>

        <!-- Teacher Details -->
        <Card class="col-span-1 md:col-span-2">
          <CardHeader>
            <div class="flex justify-between items-center">
              <div>
                <CardTitle class="font-semibold text-2xl"
                  >Teacher Details</CardTitle
                >
                <CardDescription>Teacher Information</CardDescription>
              </div>
              <Badge
                class="px-3 py-1.5 text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200"
              >
                Supervisor
              </Badge>
            </div>
          </CardHeader>
          <CardContent
            class="p-4 flex-1"
            v-if="internship && internship.teacher"
          >
            <div class="grid gap-4">
              <div
                class="border border-amber-100 rounded-xl p-4 bg-white hover:bg-amber-50 transition-colors shadow-sm hover:shadow"
              >
                <div class="flex justify-between items-start mb-4">
                  <h3 class="font-semibold text-lg text-gray-800">
                    {{ internship.teacher.user.name || 'Unknown' }}
                  </h3>
                  <span
                    class="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium"
                  >
                    Pembimbing
                  </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div class="flex items-center">
                    <span class="text-gray-500 text-sm w-16">NIP:</span>
                    <span
                      class="text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-md flex-1"
                    >
                      {{ internship.teacher.nip || '-' }}
                    </span>
                  </div>

                  <div class="flex items-center">
                    <span class="text-gray-500 text-sm w-16">Email:</span>
                    <span
                      class="text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-md flex-1 truncate"
                    >
                      {{ internship.teacher.user.email || '-' }}
                    </span>
                  </div>

                  <div class="flex items-center">
                    <span class="text-gray-500 text-sm w-16">Phone:</span>
                    <span
                      class="text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-md flex-1"
                    >
                      {{ internship.teacher.phone || '-' }}
                    </span>
                  </div>

                  <div class="flex items-center">
                    <span class="text-gray-500 text-sm w-16">Subject:</span>
                    <span
                      class="text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-md flex-1"
                    >
                      {{ internship.teacher.subject || '-' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter class="border-t justify-end">
            <Button
              variant="ghost"
              size="sm"
              class="text-amber-600 hover:text-amber-700"
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </RoleGuard>
</template>
