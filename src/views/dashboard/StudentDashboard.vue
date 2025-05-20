<script setup>
import { ref, onMounted, computed } from 'vue';
import { createReusableTemplate, useMediaQuery } from '@vueuse/core';
import { toast } from 'vue-sonner';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// data
const internship = ref([]);

const isOpen = ref(false);
const isActive = ref(false);
const isLoading = ref(true);

// Responsive Template
const [UseTemplate, GridForm] = createReusableTemplate();
const isDesktop = useMediaQuery('(min-width: 768px)');

const error = ref(null);

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
  error.value = null;
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
    error.value = 'Failed to fetch internships. Please try again later.';
    toast.error('Failed to fetch internships');
  } finally {
    isLoading.value = false;
  }
};

const fetchIndustries = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/industries');
    industryList.value = response.data.all_data;
    console.log('Fetched industries:', industryList.value);
  } catch (error) {
    console.error(error);
    toast.error('Failed to fetch industries');
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
  fetchIndustries();
});
</script>

<template>
  <RoleGuard :allowed-roles="['student']">
    <!-- Form Request -->
    <UseTemplate>
      <form class="grid items-start gap-4 px-4">
        <div class="grid gap-2">
          <Label for="industry_id">Industry</Label>
          <Select>
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select a industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Industries</SelectLabel>
                <SelectItem value="apple"> Apple </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="start_date">Start Date</Label>
            <Input id="start_date" type="date" />
          </div>
          <div class="grid gap-2">
            <Label for="end_date">End Date</Label>
            <Input id="end_date" type="date" />
          </div>
        </div>

        <div class="grid gap-2">
          <Label for="cover_letter">Upload Cover Letter</Label>
          <Input id="cover_letter" type="file" accept=".pdf,.docx" />
          <p class="text-sm text-gray-500">Format: PDF or DOCX. Max: 2MB</p>
        </div>
        <Button type="submit" class="bg-amber-400 hover:bg-amber-500">
          Save changes
        </Button>
      </form>
    </UseTemplate>

    <div class="container mx-auto py-2 flex flex-col min-h-screen">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <div class="flex flex-col items-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"
          ></div>
          <p class="mt-4 text-gray-600">Loading internship data...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center h-64">
        <div class="text-center p-6 bg-red-50 rounded-lg border border-red-200">
          <p class="text-red-600 mb-4">{{ error }}</p>
          <Button
            @click="fetchInternships"
            class="bg-amber-400 hover:bg-amber-500"
          >
            Try Again
          </Button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-2 flex-grow">
        <!-- Progress Card -->
        <Card
          class="col-span-1 bg-white"
          :class="isActive ? 'md:col-span-3' : 'md:col-span-4'"
        >
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

          <CardContent
            v-if="!isActive"
            class="space-y-4 flex-1 flex flex-col justify-center"
          >
            <!-- eslint-disable-next-line -->
            <Dialog v-if="isDesktop" v-model:open="isOpen">
              <DialogTrigger as-child>
                <Button class="bg-amber-300 hover:bg-amber-400 text-amber-800">
                  Make Request
                </Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle class="capitalize text-2xl"
                    >Submit an internship details</DialogTitle
                  >
                  <DialogDescription class="lowercase">
                    complete the internship monitoring form
                  </DialogDescription>
                </DialogHeader>
                <GridForm />
              </DialogContent>
            </Dialog>

            <!-- eslint-disable-next-line -->
            <Drawer v-else v-model:open="isOpen">
              <DrawerTrigger as-child>
                <Button class="bg-amber-300 hover:bg-amber-400 text-amber-800">
                  Make Request
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader class="text-left">
                  <DrawerTitle class="capitalize text-2xl"
                    >create an internship request</DrawerTitle
                  >
                  <DrawerDescription class="lowercase">
                    Complete the PKL request form
                  </DrawerDescription>
                </DrawerHeader>
                <GridForm />
                <DrawerFooter class="pt-2">
                  <DrawerClose as-child>
                    <Button variant="outline"> Cancel </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </CardContent>

          <CardContent
            v-if="isActive"
            class="space-y-4 flex-1 flex flex-col justify-center"
          >
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
          <CardFooter
            v-if="isActive"
            class="flex justify-between border-t pt-4"
          >
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
        <Card v-if="isActive" class="col-span-1 md:row-span-1">
          <CardHeader>
            <CardTitle class="font-semibold text-xl">Industry</CardTitle>
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
        <Card v-if="isActive" class="col-span-1 md:col-span-2">
          <CardHeader>
            <div class="flex justify-between items-center">
              <div>
                <CardTitle class="font-semibold text-xl"
                  >Student Details</CardTitle
                >
                <CardDescription>Student Information</CardDescription>
              </div>
              <Badge
                class="px-3 py-1.5 text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200"
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
                class="border border-amber-100 rounded-xl p-4 bg-white hover:bg-amber-50 transition-colors shadow-sm hover:shadow"
              >
                <div class="flex items-start mb-4">
                  <h3 class="font-semibold text-lg text-gray-800">
                    {{ internship.student.user.name || 'Unknown' }}
                  </h3>
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
                      {{ internship.student.user.phone || '-' }}
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
        <Card v-if="isActive" class="col-span-1 md:col-span-2">
          <CardHeader>
            <div class="flex justify-between items-center">
              <div>
                <CardTitle class="font-semibold text-xl"
                  >Teacher Details</CardTitle
                >
                <CardDescription>Teacher Information</CardDescription>
              </div>
              <Badge
                class="px-3 py-1.5 text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
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
                class="border border-blue-100 rounded-xl p-4 bg-white hover:bg-blue-50 transition-colors shadow-sm hover:shadow"
              >
                <div class="flex items-start mb-4">
                  <h3 class="font-semibold text-lg text-gray-800">
                    {{ internship.teacher.user.name || 'Unknown' }}
                  </h3>
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
                      {{ internship.teacher.user.phone || '-' }}
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
              class="text-blue-600 hover:text-blue-700"
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </RoleGuard>
</template>
