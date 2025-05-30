<script setup>
// Import Vue
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

import { createReusableTemplate, useMediaQuery } from '@vueuse/core';
import { toast } from 'vue-sonner';

// Import Lucide icons
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  School,
  Briefcase,
  Settings,
} from 'lucide-vue-next';

// Import API
import api from '@/api';

// Import UI components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RoleGuard from '@/components/RoleGuard.vue';

const LARAVEL_BASE_URL = 'http://127.0.0.1:8000';

// Router
const router = useRouter();

// State
const userProfile = ref({});
const isLoading = ref(false);
const isEditing = ref(false);
const isEditOpen = ref(false);
const isEditClose = ref(false);

// Form data for editing
const editForm = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  gender: '',
  nis: '',
  nip: '',
});

// Responsive
const [UseTemplate, GridForm] = createReusableTemplate();
const isDesktop = useMediaQuery('(min-width: 768px)');

// Profile image upload
const selectedImage = ref(null);
const imagePreview = ref(null);

// Computed properties
const userInitials = computed(() => {
  if (!userProfile.value.name) return 'U';
  return userProfile.value.name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const genderDisplay = computed(() => {
  const gender = userProfile.value.gender;
  if (gender === 'L') return 'Male';
  if (gender === 'P') return 'Female';
  return 'Not specified';
});

const roleDisplay = computed(() => {
  if (userProfile.value.roles[0] === 'teacher') return 'Teacher';
  if (userProfile.value.roles[0] === 'student') return 'Student';
  if (userProfile.value.roles[0] === 'admin') return 'Administrator';
  return 'User';
});

const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${LARAVEL_BASE_URL}/storage/${imagePath}`;
};

// Methods
const fetchProfile = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await api.get('/me', { headers });

    userProfile.value = response.data.data;
    console.log('Fetched profile:', userProfile.value);
  } catch (error) {
    console.error('Error fetching profile:', error);
    toast.error('Failed to fetch profile data');
  } finally {
    isLoading.value = false;
  }
};

const openEdit = () => {
  isEditOpen.value = true;
};

const closeEdit = () => {
  isEditOpen.value = false;
  // Reset form to original values
  const user = userProfile.value || {};
  editForm.value = {
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    gender: user.gender || '',
    nis: user.profile.nis || '',
    nip: user.profile.nip || '',
  };
  selectedImage.value = null;
  imagePreview.value = null;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedImage.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const saveProfile = async () => {
  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('name', editForm.value.name);
    formData.append('email', editForm.value.email);
    formData.append('phone', editForm.value.phone);
    formData.append('address', editForm.value.address);
    formData.append('gender', editForm.value.gender);

    let endPoint = '';
    let id = userProfile.value.profile.id;

    if (userProfile.value.roles[0] === 'student') {
      endPoint = `/students/${id}`;

      formData.append('nis', editForm.value.nis);
      if (selectedImage.value) {
        formData.append('image', selectedImage.value);
      }
    } else if (userProfile.value.roles[0] === 'teacher') {
      endPoint = `/teachers/${id}`;

      formData.append('nip', editForm.value.nip);
      if (selectedImage.value) {
        formData.append('image', selectedImage.value);
      }
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const response = await api.put(endPoint, formData, { headers });

    if (userProfile.value.roles[0] === 'student') {
      userProfile.value =
        response.data.updated_data || response.data.data || {};
    } else if (userProfile.value.roles[0] === 'teacher') {
      userProfile.value =
        response.data.updated_data || response.data.data || {};
    } else {
      userProfile.value = response.data.data || {};
    }
    toast.success('Profile updated successfully');
    closeEdit();
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error('Failed to update profile');
  } finally {
    isLoading.value = false;
  }
};

const changePassword = () => {
  // Navigate to change password page or open modal
  router.push('/change-password');
};

onMounted(() => {
  fetchProfile();
});
</script>

<template>
  <RoleGuard :allowed-roles="['teacher', 'student', 'admin']">
    <UseTemplate>
      <form class="grid items-start gap-4 px-4 w-full">
        <!-- Profile Image Upload -->
        <div class="space-y-4">
          <Label>Profile Picture</Label>
          <div class="flex items-center gap-4">
            <Avatar class="h-20 w-20">
              <AvatarImage
                :src="imagePreview || getFullImageUrl(userProfile.image)"
                :alt="editForm.name"
              />
              <AvatarFallback>{{ userInitials }}</AvatarFallback>
            </Avatar>
            <div>
              <Label for="image-upload" class="cursor-pointer">
                <Button variant="outline" size="sm" as="span">
                  <Camera class="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </Label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageUpload"
              />
            </div>
          </div>
        </div>

        <!-- Form Fields -->
        <div class="space-y-4 w-full">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="name">Full Name</Label>
              <Input
                id="name"
                v-model="editForm.name"
                placeholder="Enter your full name"
              />
            </div>
            <div class="space-y-2" v-if="userProfile.roles[0] === 'student'">
              <Label for="nis">NIS</Label>
              <Input
                id="nis"
                v-model="editForm.nis"
                placeholder="Enter your student id"
              />
            </div>
            <div class="space-y-2" v-if="userProfile.roles[0] === 'teacher'">
              <Label for="nip">NIP</Label>
              <Input
                id="nip"
                v-model="editForm.nip"
                placeholder="Enter your teacher id"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="editForm.email"
                type="email"
                placeholder="Enter your email"
              />
            </div>
            <div class="space-y-2">
              <Label for="phone">Phone Number</Label>
              <Input
                id="phone"
                v-model="editForm.phone"
                placeholder="Enter your phone"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="gender">Gender</Label>
            <Select v-model="editForm.gender">
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Male</SelectItem>
                <SelectItem value="P">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="address">Address</Label>
            <Textarea
              id="address"
              v-model="editForm.address"
              placeholder="Enter your address"
              rows="1"
            />
          </div>
        </div>
      </form>
    </UseTemplate>

    <div class="container mx-auto py-6 max-w-4xl">
      <!-- Loading State -->
      <div
        v-if="isLoading && !userProfile.user"
        class="flex justify-center items-center min-h-[400px]"
      >
        <div class="text-lg">Loading profile...</div>
      </div>

      <!-- Profile Content -->
      <div v-else class="space-y-6">
        <!-- Header Card -->
        <Card>
          <CardHeader class="pb-4">
            <div
              class="flex flex-col md:flex-row items-center md:items-center gap-6"
            >
              <!-- Profile Picture -->
              <div class="relative">
                <Avatar class="h-24 w-24 md:h-32 md:w-32">
                  <AvatarImage
                    :src="getFullImageUrl(userProfile.image)"
                    :alt="userProfile.user?.name"
                  />
                  <AvatarFallback class="text-2xl">{{
                    userInitials
                  }}</AvatarFallback>
                </Avatar>
              </div>

              <!-- Basic Info -->
              <div class="flex-1 space-y-2">
                <div
                  class="flex flex-col items-center md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div class="flex flex-col items-center md:items-start">
                    <CardTitle class="text-2xl md:text-3xl">
                      {{ userProfile.name || 'Unknown User' }}
                    </CardTitle>
                    <CardDescription class="text-base mt-1">
                      {{ userProfile.email || 'No email' }}
                    </CardDescription>
                  </div>

                  <div class="flex gap-2">
                    <Badge variant="outline" class="text-sm">
                      {{ roleDisplay }}
                    </Badge>
                    <Button @click="openEdit" variant="outline" size="sm">
                      <Edit class="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>

                <!-- Quick Stats -->
                <div
                  class="grid gap-4 mt-4"
                  :class="{
                    'grid-cols-2 md:grid-cols-4':
                      userProfile.roles[0] === 'student',
                    'grid-cols-3 md:grid-cols-3':
                      userProfile.roles[0] === 'teacher',
                  }"
                >
                  <div class="text-center p-3 bg-gray-50 rounded-lg">
                    <div class="text-sm text-gray-500">Gender</div>
                    <div class="font-medium">{{ genderDisplay }}</div>
                  </div>
                  <div class="text-center p-3 bg-gray-50 rounded-lg">
                    <div class="text-sm text-gray-500">Phone</div>
                    <div class="font-medium">
                      {{ userProfile.phone || 'Not set' }}
                    </div>
                  </div>
                  <div
                    class="text-center p-3 bg-gray-50 rounded-lg"
                    v-if="
                      userProfile.roles[0] === 'student' && userProfile.profile
                    "
                  >
                    <div class="text-sm text-gray-500">NIS</div>
                    <div class="font-medium">
                      {{ userProfile.profile?.nis }}
                    </div>
                  </div>
                  <div
                    class="text-center p-3 bg-gray-50 rounded-lg"
                    v-if="
                      userProfile.roles[0] === 'teacher' && userProfile.profile
                    "
                  >
                    <div class="text-sm text-gray-500">NIP</div>
                    <div class="font-medium">
                      {{ userProfile.profile?.nip }}
                    </div>
                  </div>
                  <div
                    v-if="userProfile.roles[0] === 'student'"
                    class="text-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div class="text-sm text-gray-500">Status</div>
                    <div class="font-medium">
                      <Badge variant="outline" class="w-fit">
                        {{
                          userProfile.profile?.status ? 'Active' : 'Inactive'
                        }}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <!-- Detailed Information Tabs -->
        <Tabs default-value="personal" class="w-full">
          <TabsList class="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <!-- Personal Information -->
          <TabsContent value="personal" class="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <User class="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div class="flex items-center gap-3">
                      <Mail class="h-4 w-4 text-gray-500" />
                      <div>
                        <div class="text-sm text-gray-500">Email</div>
                        <div class="font-medium">
                          {{ userProfile.email || 'Not specified' }}
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-3">
                      <Phone class="h-4 w-4 text-gray-500" />
                      <div>
                        <div class="text-sm text-gray-500">Phone Number</div>
                        <div class="font-medium">
                          {{ userProfile.phone || 'Not specified' }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-4">
                    <div class="flex items-start gap-3">
                      <MapPin class="h-4 w-4 text-gray-500 mt-1" />
                      <div>
                        <div class="text-sm text-gray-500">Address</div>
                        <div class="font-medium">
                          {{ userProfile.address || 'Not specified' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Academic Information -->
          <TabsContent value="academic" class="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <School class="h-5 w-5" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    v-if="
                      userProfile.roles[0] === 'student' && userProfile.profile
                    "
                    class="space-y-2"
                  >
                    <div class="text-sm text-gray-500">Student ID (NIS)</div>
                    <badge variant="outline" class="w-fit">
                      {{ userProfile.profile?.nis }}
                    </badge>
                  </div>

                  <div
                    v-if="
                      userProfile.roles[0] === 'teacher' && userProfile.profile
                    "
                    class="space-y-2"
                  >
                    <div class="text-sm text-gray-500">Teacher ID (NIP)</div>
                    <badge variant="outline" class="w-fit">
                      {{ userProfile.profile?.nip }}
                    </badge>
                  </div>

                  <div class="space-y-2">
                    <div class="text-sm text-gray-500">Role</div>
                    <Badge variant="outline" class="w-fit">{{
                      roleDisplay
                    }}</Badge>
                  </div>

                  <div
                    class="space-y-2"
                    v-if="userProfile.roles[0] === 'student'"
                  >
                    <div class="text-sm text-gray-500">Account Status</div>
                    <Badge variant="outline" class="w-fit">
                      {{ userProfile.profile?.status ? 'Active' : 'Inactive' }}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Settings -->
          <TabsContent value="settings" class="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <Settings class="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="space-y-4">
                  <Button
                    @click="changePassword"
                    variant="outline"
                    class="w-full md:w-auto"
                  >
                    Change Password
                  </Button>

                  <div class="pt-4 border-t">
                    <div class="text-sm text-gray-500 mb-2">
                      Account Actions
                    </div>
                    <div class="space-y-2">
                      <Button variant="destructive" size="sm"
                        >Delete Account</Button
                      >
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <!-- Desktop -->
      <Dialog v-if="isDesktop" v-model:open="isEditOpen">
        <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information and profile picture.
            </DialogDescription>
          </DialogHeader>
          <GridForm />
          <div class="flex justify-end gap-2">
            <Button @click="closeEdit" variant="outline" :disabled="isLoading">
              <X class="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              @click="saveProfile"
              :disabled="isLoading"
              class="bg-amber-400 hover:bg-amber-500"
            >
              <Save class="h-4 w-4 mr-2" />
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Drawer v-else v-model:open="isEditOpen">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit Profile</DrawerTitle>
            <DrawerDescription
              >Update your profile information and profile
              picture.</DrawerDescription
            >
          </DrawerHeader>
          <GridForm />
          <DrawerFooter>
            <Button
              @click="saveProfile"
              :disabled="isLoading"
              class="bg-amber-400 hover:bg-amber-500"
            >
              <Save class="h-4 w-4 mr-2" />
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </Button>
            <DrawerClose>
              <Button
                @click="closeEdit"
                variant="outline"
                :disabled="isLoading"
                class="w-full"
              >
                <X class="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  </RoleGuard>
</template>
