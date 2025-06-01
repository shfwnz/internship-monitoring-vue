<script setup>
import { ref, onMounted, computed } from 'vue';
import { createReusableTemplate, useMediaQuery } from '@vueuse/core';
import { FileText, Plus, ChevronRight, Info } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { api, getToken } from '@/api';

// UI Components
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

// Main data
const internship = ref([]);
const industries = ref([]);
const student = ref([]);

// Form data
const formData = ref({
  selectedIndustry: '',
  start_date: '',
  end_date: '',
  file: null,
});

// UI states
const isOpen = ref(false);
const isActive = ref(false);
const isLoading = ref(true);
const error = ref(null);

// Responsive
const [UseTemplate, GridForm] = createReusableTemplate();
const isDesktop = useMediaQuery('(min-width: 768px)');

// Computed properties
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

// API functions
const fetchUserData = async () => {
  try {
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };
    const response = await api.get('/me', { headers });

    if (response.data.data) {
      isActive.value = response.data.data.profile.status;
      student.value = response.data.data.profile;
    }
  } catch (error) {
    toast.error('Failed to fetch user data');
  }
};

const fetchInternships = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };
    const response = await api.get('/internships/me', { headers });

    if (response.data.data) {
      internship.value = response.data.data;
    }
  } catch (error) {
    if (error.response?.status === 404) {
      toast.warning('Not registered yet');
    } else if (error.response?.status >= 500) {
      error.value = 'Server error. Try again later.';
      toast.error('Server error');
    } else if (error.response?.status === 401) {
      error.value = 'Session expired. Login again.';
      toast.error(error.response.data.message);
    } else {
      error.value = 'Failed to fetch data. Try again later.';
      toast.error('Fetch failed');
    }
  } finally {
    isLoading.value = false;
  }
};

const fetchIndustries = async () => {
  try {
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };

    const response = await api.get('/industries', { headers });
    industries.value = response.data.all_data;
  } catch (error) {
    toast.error('Failed to fetch industries');
  }
};

const postInternship = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const form = new FormData();

    // Append form data
    form.append('student_id', student.value.id);
    form.append('industry_id', formData.value.selectedIndustry);
    form.append('start_date', formData.value.start_date);
    form.append('end_date', formData.value.end_date);

    if (formData.value.file) {
      form.append('file', formData.value.file);
    }

    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };

    const response = await api.post('/internships', form, { headers });

    toast.success('Internship posted successfully');
    resetForm();
    await fetchInternships();
    isOpen.value = false;
  } catch (err) {
    // Handle specific error cases
    if (err.response?.status === 422) {
      const errors = err.response.data?.errors || {};
      let errorMessage = 'Validation failed: ';
      Object.keys(errors).forEach((key) => {
        errorMessage += `${key}: ${errors[key].join(', ')}. `;
      });
      error.value = errorMessage;
      toast.error(errorMessage);
    } else if (err.response?.status === 401) {
      error.value = 'Unauthorized. Please login again.';
      toast.error('Session expired. Please login again.');
    } else if (err.response?.status === 413) {
      error.value = 'File too large. Maximum size is 2MB.';
      toast.error('File too large');
    } else if (err.response?.status >= 500) {
      error.value = 'Server error. Please try again later.';
      toast.error('Server error');
    } else {
      error.value =
        err.response?.data?.message ||
        'Failed to post internship. Please try again.';
      toast.error(error.value);
    }
  } finally {
    isLoading.value = false;
  }
};

// Event handlers
const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];

  if (selectedFile) {
    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      event.target.value = '';
      formData.value.file = null;
      return;
    }

    // Validate file size (2MB)
    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      event.target.value = '';
      formData.value.file = null;
      return;
    }

    formData.value.file = selectedFile;
  } else {
    formData.value.file = null;
  }
};

const handleSubmit = () => {
  error.value = null;

  // Form validation
  if (!formData.value.selectedIndustry) {
    toast.error('Please select an industry');
    return;
  }

  if (!formData.value.start_date || !formData.value.end_date) {
    toast.error('Please select start and end dates');
    return;
  }

  // Date validation
  const startDate = new Date(formData.value.start_date);
  const endDate = new Date(formData.value.end_date);

  if (endDate <= startDate) {
    toast.error('End date must be after start date');
    return;
  }

  if (!formData.value.file) {
    toast.error('Please upload a cover letter');
    return;
  }

  // Final file validation
  if (formData.value.file.size > 2 * 1024 * 1024) {
    toast.error('File size must be less than 2MB');
    return;
  }

  if (formData.value.file.type !== 'application/pdf') {
    toast.error('Only PDF files are allowed');
    return;
  }

  postInternship().then(() => {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });
};

const resetForm = () => {
  formData.value = {
    selectedIndustry: '',
    start_date: '',
    end_date: '',
    file: null,
  };
  error.value = null;

  // Reset file input
  const fileInput = document.getElementById('cover_letter');
  if (fileInput) {
    fileInput.value = '';
  }
};

// Lifecycle
onMounted(() => {
  fetchUserData();
  fetchInternships();
  fetchIndustries();
});
</script>

<template>
  <RoleGuard :allowed-roles="['student']">
    <!-- Form Request -->
    <UseTemplate>
      <form @submit.prevent="handleSubmit" class="grid items-start gap-4 px-4">
        <div class="grid gap-2">
          <Label for="industry_id">Industry</Label>
          <Select v-model="formData.selectedIndustry">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select a industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Industries</SelectLabel>
                <SelectItem
                  v-for="industry in industries"
                  :key="industry.id"
                  :value="industry.id.toString()"
                >
                  {{ industry.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="start_date">Start Date</Label>
            <Input id="start_date" v-model="formData.start_date" type="date" />
          </div>
          <div class="grid gap-2">
            <Label for="end_date">End Date</Label>
            <Input id="end_date" v-model="formData.end_date" type="date" />
          </div>
        </div>

        <div class="grid gap-2">
          <Label for="cover_letter">Upload Cover Letter</Label>
          <Input
            id="cover_letter"
            type="file"
            @change="handleFileChange"
            accept=".pdf"
          />
          <p class="text-sm text-gray-500">Format: .pdf, Max: 2MB</p>
        </div>
        <Button type="submit" class="bg-amber-400 hover:bg-amber-500">
          Save changes
        </Button>
      </form>
    </UseTemplate>

    <div class="container mx-auto py-6 max-w-4xl flex flex-col min-h-screen">
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
            <div v-if="isActive" class="flex justify-between items-center">
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
            class="flex flex-1 justify-center items-center p-4 sm:p-8"
          >
            <div class="w-full max-w-4xl mx-auto">
              <!-- Top Section: Mobile-First Layout -->
              <div class="relative mb-6 sm:mb-8">
                <div
                  class="flex flex-col items-center gap-4 sm:flex-row sm:justify-start sm:gap-6"
                >
                  <!-- Animated Icon Container -->
                  <div class="relative flex-shrink-0">
                    <div
                      class="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <FileText
                        class="w-10 h-10 sm:w-12 sm:h-12 text-amber-600 animate-pulse"
                      />
                    </div>

                    <!-- Floating particles effect -->
                    <div
                      class="absolute -top-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 bg-amber-300 rounded-full animate-bounce"
                      style="animation-delay: 0.2s"
                    ></div>
                    <div
                      class="absolute -bottom-1 -left-3 w-2 h-2 sm:w-3 sm:h-3 bg-amber-400 rounded-full animate-bounce"
                      style="animation-delay: 0.4s"
                    ></div>
                    <div
                      class="absolute top-3 -left-2 w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                      style="animation-delay: 0.6s"
                    ></div>
                  </div>

                  <!-- Title and Description -->
                  <div class="flex flex-col text-center sm:text-left flex-1">
                    <h3
                      class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3 leading-tight"
                    >
                      Internship information not submitted yet
                    </h3>
                    <p
                      class="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl"
                    >
                      Start your internship journey! Register your internship
                      information to begin the monitoring process and get
                      teacher guidance.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Main Content Section -->
              <div
                class="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:items-start"
              >
                <!-- Left Column -->
                <div class="space-y-4 sm:space-y-6 order-2 lg:order-1">
                  <div
                    class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 sm:p-6 border border-amber-100"
                  >
                    <h4
                      class="font-semibold text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2"
                    >
                      <ChevronRight
                        class="w-4 h-4 sm:w-5 sm:h-5 text-amber-600"
                      />
                      Next step:
                    </h4>
                    <div class="space-y-2 sm:space-y-3">
                      <div
                        class="flex items-center text-xs sm:text-sm text-gray-600 p-2 rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        <div
                          class="w-2 h-2 sm:w-3 sm:h-3 bg-amber-400 rounded-full mr-3 sm:mr-4 flex-shrink-0"
                        ></div>
                        <span class="font-medium"
                          >Register your internship information</span
                        >
                      </div>
                      <div
                        class="flex items-center text-xs sm:text-sm text-gray-600 p-2 rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        <div
                          class="w-2 h-2 sm:w-3 sm:h-3 bg-amber-300 rounded-full mr-3 sm:mr-4 flex-shrink-0"
                        ></div>
                        <span class="font-medium"
                          >Get a teacher to guide you</span
                        >
                      </div>
                      <div
                        class="flex items-center text-xs sm:text-sm text-gray-600 p-2 rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        <div
                          class="w-2 h-2 sm:w-3 sm:h-3 bg-amber-200 rounded-full mr-3 sm:mr-4 flex-shrink-0"
                        ></div>
                        <span class="font-medium"
                          >Start the monitoring process</span
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Help -->
                  <div
                    class="p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-100"
                  >
                    <div class="flex items-start gap-2 sm:gap-3">
                      <Info
                        class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5"
                      />
                      <div class="text-left">
                        <p
                          class="text-xs sm:text-sm text-blue-700 font-semibold mb-1"
                        >
                          Need help?
                        </p>
                        <p
                          class="text-xs sm:text-sm text-blue-600 leading-relaxed"
                        >
                          Contact admin or your teacher.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right Column -->
                <div
                  class="flex flex-col justify-center items-center md:space-y-3 space-y-4 order-1 lg:order-2 h-full"
                >
                  <!-- Desktop Dialog -->
                  <Dialog v-if="isDesktop" v-model:open="isOpen">
                    <DialogTrigger as-child>
                      <Button
                        class="relative bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 font-semibold py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 text-sm sm:text-base w-full sm:w-auto"
                      >
                        <span
                          class="flex items-center justify-center gap-2 sm:gap-3"
                        >
                          <Plus class="w-4 h-4 sm:w-5 sm:h-5" />
                          Register Internship
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle class="text-xl"
                          >Internship Registration</DialogTitle
                        >
                        <DialogDescription>
                          Fill in the internship monitoring form
                        </DialogDescription>
                      </DialogHeader>
                      <GridForm />
                    </DialogContent>
                  </Dialog>

                  <!-- Mobile Drawer -->
                  <Drawer v-else v-model:open="isOpen">
                    <DrawerTrigger as-child>
                      <Button
                        class="relative bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform active:scale-95 transition-all duration-200 border-0 w-full text-base"
                      >
                        <span class="flex items-center justify-center gap-3">
                          <Plus class="w-5 h-5" />
                          Register Internship
                        </span>
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader class="text-left">
                        <DrawerTitle class="text-xl"
                          >Internship Registration</DrawerTitle
                        >
                        <DrawerDescription>
                          Fill in the internship monitoring form
                        </DrawerDescription>
                      </DrawerHeader>
                      <GridForm />
                      <DrawerFooter class="pt-2">
                        <DrawerClose as-child>
                          <Button variant="outline" @click="resetForm"
                            >Cancel</Button
                          >
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>

                  <!-- Aditional Info -->
                  <div
                    class="text-center text-xs sm:text-sm text-gray-500 mt-2 sm:mt-4 px-2"
                  >
                    <p class="mb-1 lowercase">
                      Register to unlock progress tracking and teacher guidance
                    </p>
                    <p class="lowercase">
                      Make the most of your internship experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <!-- Active Internship Card -->
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
              v-if="
                internship && (internship.start_date || internship.end_date)
              "
              class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
            >
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">Start Date</span>
                <span class="font-medium">{{
                  internship.start_date || '-'
                }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">End Date</span>
                <span class="font-medium">{{
                  internship.end_date || '-'
                }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">Duration</span>
                <span class="font-medium">{{ durationMonths || '-' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">Teacher</span>
                <span class="font-medium">{{
                  internship.teacher?.user?.name || 'Not assigned'
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
              disabled
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
            <div class="space-y-4 text-sm" v-if="internship">
              <div class="flex flex-col">
                <span class="text-sm mb-1">Name:</span>
                <span class="text-gray-600">{{
                  internship.industry?.name || '-'
                }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm mb-1">Business Field:</span>
                <badge class="bg-amber-500">{{
                  internship.industry?.business_field?.name || '-'
                }}</badge>
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
              disabled
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
          <CardContent class="p-4 flex-1" v-if="internship">
            <div class="grid gap-4">
              <div
                class="border border-amber-100 rounded-xl p-4 bg-white hover:bg-amber-100 transition-colors shadow-sm hover:shadow"
              >
                <div class="flex items-start mb-4">
                  <h3 class="font-semibold text-lg text-gray-800">
                    {{ internship.student?.user?.name || 'Unknown' }}
                  </h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div class="flex items-center">
                    <span class="text-gray-500 text-sm w-16">NIS:</span>
                    <span
                      class="text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-md flex-1"
                    >
                      {{ internship.student?.nis || '-' }}
                    </span>
                  </div>

                  <div class="flex items-center">
                    <span class="text-gray-500 text-sm w-16">Email:</span>
                    <span
                      class="text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-md flex-1 truncate"
                    >
                      {{ internship.student?.user?.email || '-' }}
                    </span>
                  </div>

                  <div class="flex items-center">
                    <span class="text-gray-500 text-sm w-16">Phone:</span>
                    <span
                      class="text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-md flex-1"
                    >
                      {{ internship.student?.user?.phone || '-' }}
                    </span>
                  </div>

                  <div class="flex items-center">
                    <span class="text-gray-500 text-sm w-16">Gender:</span>
                    <span
                      class="text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-md flex-1"
                    >
                      {{
                        internship.student?.user?.gender === 'L'
                          ? 'Male'
                          : internship.student?.user?.gender === 'P'
                          ? 'Female'
                          : '-'
                      }}
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
              disabled
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
                Teacher
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="p-4 flex-1" v-if="internship">
            <div class="grid gap-4">
              <div
                class="border border-blue-100 rounded-xl p-4 bg-white hover:bg-blue-100 transition-colors shadow-sm hover:shadow"
              >
                <div class="flex items-start mb-4">
                  <h3 class="font-semibold text-lg text-gray-800">
                    {{ internship.teacher?.user?.name || 'Unknown' }}
                  </h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div class="flex items-center">
                    <span class="text-gray-500 text-sm w-16">NIP:</span>
                    <span
                      class="text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-md flex-1"
                    >
                      {{ internship.teacher?.nip || '-' }}
                    </span>
                  </div>

                  <div class="flex items-center">
                    <span class="text-gray-500 text-sm w-16">Email:</span>
                    <span
                      class="text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-md flex-1 truncate"
                    >
                      {{ internship.teacher?.user?.email || '-' }}
                    </span>
                  </div>

                  <div class="flex items-center">
                    <span class="text-gray-500 text-sm w-16">Phone:</span>
                    <span
                      class="text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-md flex-1"
                    >
                      {{ internship.teacher?.user?.phone || '-' }}
                    </span>
                  </div>

                  <div class="flex items-center">
                    <span class="text-gray-500 text-sm w-16">Gender:</span>
                    <span
                      class="text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-md flex-1"
                    >
                      {{
                        internship.teacher?.user?.gender === 'L'
                          ? 'Male'
                          : internship.teacher?.user?.gender === 'P'
                          ? 'Female'
                          : '-'
                      }}
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
              disabled
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </RoleGuard>
</template>
