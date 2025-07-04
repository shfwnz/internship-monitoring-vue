<script setup>
// Core Vue imports
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

// API and utilities
import { api, getToken, LARAVEL_BASE_URL } from '@/api';
import { useMediaQuery } from '@vueuse/core';
import { toast } from 'vue-sonner';

// Icons
import { Moon, Menu, Sun, UserCircle } from 'lucide-vue-next';

// UI Components - Basic
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// UI Components - Dropdown
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// UI Components - Drawer
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

// REACTIVE DATA
const router = useRouter();

const isDrawerOpen = ref(false);
const isMenuDrawerOpen = ref(false);
const isDark = ref(false);
const isLoading = ref(true);

const currentUser = ref(null);

const isDesktop = useMediaQuery('(min-width: 768px)');

// COMPUTED PROPERTIES
const links = computed(() => {
  const userRole = currentUser.value?.role || localStorage.getItem('role');

  const allLinks = {
    student: [
      {
        name: 'Dashboard',
        path: '/app/student',
      },
      {
        name: 'Industry',
        path: '/app/industry',
      },
    ],
    teacher: [
      {
        name: 'Dashboard',
        path: '/app/teacher',
      },
      {
        name: 'Industry',
        path: '/app/industry',
      },
    ],
  };

  return allLinks[userRole] || [];
});

const userInitials = computed(() => {
  if (!currentUser.value) return 'U';

  const names = currentUser.value.name?.split(' ') || [];

  if (names.length >= 2) {
    return (names[0]?.[0] + names[names.length - 1]?.[0]).toUpperCase();
  } else if (names.length === 1) {
    return names[0]?.[0]?.toUpperCase() || 'U';
  }

  if (currentUser.value.username) {
    return currentUser.value.username[0].toUpperCase();
  } else if (currentUser.value.email) {
    return currentUser.value.email[0].toUpperCase();
  }

  return 'U';
});

const userDisplayName = computed(() => {
  if (!currentUser.value) return 'User';

  return (
    currentUser.value.name ||
    currentUser.value.username ||
    currentUser.value.email ||
    'User'
  );
});

// API FUNCTIONS
const fetchUser = async () => {
  isLoading.value = true;

  try {
    // Load cached user data first
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      currentUser.value = JSON.parse(cachedUser);
    }

    // Fetch fresh data from API
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };
    const response = await api.get('/me', { headers });

    if (response.data.user) {
      currentUser.value = response.data.user;
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
  } catch (error) {
    if (error.response?.status === 404) {
      toast.warning('Not registered yet');

      setTimeout(() => {
        router.push('/register');
      }, 1000);
    } else if (error.response?.status >= 500) {
      toast.error('Server error');
    } else if (error.response?.status === 401) {
      toast.error(error.response.data.message);

      setTimeout(() => {
        logout(true);
      }, 1000);
    } else {
      toast.error('Fetch failed');
    }
  } finally {
    isLoading.value = false;
  }
};

const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const cleanPath = imagePath.replace(/^\/+/, '').replace(/\/+/g, '/');
  const fullUrl = `${LARAVEL_BASE_URL}/storage/${cleanPath}`;

  console.log('Full URL:', fullUrl);
  return fullUrl;
};

const logout = async (isSessionExpired = false) => {
  try {
    // Call logout API if not session expired
    if (!isSessionExpired) {
      await api.post('/logout');
    }

    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');

    // Show success message
    if (!isSessionExpired) {
      toast.success('Logout successful');
    }

    // Redirect to login
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  } catch (err) {
    // Clear storage even if API call fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');

    toast.success('There was an error logging out.');

    setTimeout(() => {
      router.push('/login');
    }, 100);
  }
};

// UI CONTROLS
const openDrawer = () => {
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

const openMenuDrawer = () => {
  isMenuDrawerOpen.value = true;
};

const closeMenuDrawer = () => {
  isMenuDrawerOpen.value = false;
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
};

// LIFECYCLE
onMounted(() => {
  fetchUser();
});
</script>

<template>
  <div class="container mx-auto max-w-4xl bg-white rounded-2xl">
    <nav class="flex py-2 px-4 items-center">
      <!-- Mobile Menu -->
      <div v-if="!isDesktop" class="mr-2">
        <Button variant="ghost" @click="openMenuDrawer">
          <Menu />
        </Button>
      </div>

      <!-- Logo -->
      <div class="flex items-center justify-start font-bold text-xl">
        simPKL
      </div>

      <!-- Desktop Navigation -->
      <div v-if="isDesktop" class="flex-1 flex items-center justify-center">
        <UseTemplate>
          <ul class="flex gap-4 items-center justify-center">
            <li v-for="link in links" :key="link.path">
              <router-link
                :to="link.path"
                class="px-3 py-2 rounded-2xl transition-all duration-200 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                active-class="bg-amber-400 text-gray-800 font-medium"
              >
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </UseTemplate>
        <NavItem />
      </div>

      <!-- User profile section -->
      <div class="flex items-center justify-end gap-3 ml-auto">
        <!-- Loading state -->
        <div v-if="isLoading" class="animate-pulse flex items-center space-x-2">
          <div class="w-24 h-5 bg-gray-200 rounded"></div>
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>

        <!-- DESKTOP (DropdownMenu) -->
        <DropdownMenu v-else-if="isDesktop">
          <DropdownMenuTrigger class="flex items-center space-x-2">
            <span class="max-w-25 truncate">{{ userDisplayName }}</span>
            <Avatar>
              <AvatarImage
                :src="getFullImageUrl(currentUser.image)"
                :alt="userDisplayName"
              />
              <AvatarFallback>{{ userInitials }}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <router-link to="/app/profile">
              <DropdownMenuItem class="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    :src="getFullImageUrl(currentUser.image)"
                    :alt="userDisplayName"
                  />
                  <AvatarFallback>{{ userInitials }}</AvatarFallback>
                </Avatar>
                <div>
                  <p class="font-medium leading-none max-w-25 truncate">
                    {{ userDisplayName }}
                  </p>
                  <p
                    class="text-xs leading-none text-muted-foreground truncate"
                  >
                    {{ currentUser?.email || currentUser?.username || '@user' }}
                  </p>
                </div>
              </DropdownMenuItem>
            </router-link>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Moon v-if="!isDark" :size="20" />
                <Sun v-else :size="20" />
                <p class="font-medium leading-none">Dark Mode</p>
              </div>
              <Switch :model-value="isDark" @update:model-value="toggleTheme" />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button variant="outline" @click="logout" class="w-full"
                >Logout</Button
              >
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- MOBILE (User Drawer) -->
        <div v-else-if="!isLoading">
          <button class="flex items-center space-x-2" @click="openDrawer">
            <span class="max-w-20 truncate">{{ userDisplayName }}</span>
            <Avatar>
              <AvatarImage
                :src="getFullImageUrl(currentUser.image)"
                :alt="userDisplayName"
              />
              <AvatarFallback>{{ userInitials }}</AvatarFallback>
            </Avatar>
          </button>

          <!-- User Profile Drawer -->
          <Drawer v-model:open="isDrawerOpen">
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle class="py-2 px-4 rounded-md hover:bg-gray-200">
                  <router-link to="/app/profile" @click="closeDrawer">
                    <div class="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          :src="getFullImageUrl(currentUser.image)"
                          :alt="userDisplayName"
                        />
                        <AvatarFallback>{{ userInitials }}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p class="font-medium leading-none max-w-20 truncate">
                          {{ userDisplayName }}
                        </p>
                        <p class="text-xs leading-none text-muted-foreground">
                          {{
                            currentUser?.email ||
                            currentUser?.username ||
                            '@user'
                          }}
                        </p>
                      </div>
                    </div>
                  </router-link>
                </DrawerTitle>
              </DrawerHeader>

              <div
                class="px-4 py-2 mb-6 hover:bg-gray-200 rounded-md mx-4 flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <Moon v-if="!isDark" :size="20" />
                  <Sun v-else :size="20" />
                  <p class="font-medium leading-none">Mode</p>
                </div>
                <Switch
                  :model-value="isDark"
                  @update:model-value="toggleTheme"
                />
              </div>

              <DrawerFooter class="pt-4 border-t">
                <Button variant="outline" @click="logout">Logout</Button>
                <DrawerClose asChild>
                  <Button variant="ghost">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu Drawer -->
    <Drawer v-model:open="isMenuDrawerOpen">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle class="font-bold text-xl">simPKL</DrawerTitle>
          <DrawerDescription class="lowercase">
            Choose the menu you want to access
          </DrawerDescription>
        </DrawerHeader>
        <div class="p-4">
          <ul class="space-y-2">
            <li v-for="link in links" :key="link.path">
              <router-link
                :to="link.path"
                class="block px-4 py-3 rounded-md transition-all duration-200 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                active-class="bg-amber-400 text-gray-800 font-medium"
                @click="closeMenuDrawer"
              >
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>
