<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createReusableTemplate, useMediaQuery } from '@vueuse/core';
import { Moon, Menu, Sun, UserCircle } from 'lucide-vue-next';

// Router
const router = useRouter();

// Make the template reusable
const [UseTemplate, NavItem] = createReusableTemplate();

// Is Desktop?
const isDesktop = useMediaQuery('(min-width: 768px)');

// Drawer
const isDrawerOpen = ref(false);
const isMenuDrawerOpen = ref(false);

// Theme
const isDark = ref(false);

// User data
const currentUser = ref(null);
const isLoading = ref(true);

// Computed properties for user display
const userInitials = computed(() => {
  if (!currentUser.value) return 'U';

  // Get first letter of first name and last name if available
  const names = currentUser.value.name?.split(' ') || [];
  if (names.length >= 2) {
    return (names[0]?.[0] + names[names.length - 1]?.[0]).toUpperCase();
  } else if (names.length === 1) {
    return names[0]?.[0]?.toUpperCase() || 'U';
  }

  // Fallback to username or email
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

// Handle drawers
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

const links = [
  {
    name: 'Dashboard',
    path: '/app/student',
  },
  {
    name: 'Industry',
    path: '/app/industry',
  },
];

// Fetch the current logged-in user data
const fetchUser = async () => {
  isLoading.value = true;

  try {
    // First try to get from localStorage if available
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      currentUser.value = JSON.parse(cachedUser);
    }

    // Then make the API call to get fresh data
    const response = await api.get('/user');

    if (response.data.user) {
      currentUser.value = response.data.user;
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('User data fetched successfully:', currentUser.value);
    } else {
      console.warn('No user data returned from API');

      // If no user data and no cached data, possible auth issue
      if (!currentUser.value) {
        handleAuthError();
      }
    }
  } catch (err) {
    console.error('Error fetching user data:', err);
    handleAuthError(err);
  } finally {
    isLoading.value = false;
  }
};

// Handle auth errors
const handleAuthError = (err) => {
  // Check for unauthorized status
  if (err?.response?.status === 401) {
    toast.error('Session expired. Please login again.');
    logout(true);
  } else {
    // Use cached user data if available, otherwise show warning
    if (!currentUser.value) {
      toast.warning(
        'Could not retrieve user information. Some features may be limited.'
      );
    }
  }
};

const logout = async (isSessionExpired = false) => {
  try {
    // Only make API call if not already expired
    if (!isSessionExpired) {
      await api.post('/logout');
    }

    // Clear local storage and redirect regardless of API result
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');

    if (!isSessionExpired) {
      toast.success('Logout successful');
    }

    router.push('/login');
  } catch (err) {
    console.error('Logout error:', err);

    // Still clear storage and redirect on error
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');

    toast.error(
      'There was an issue logging out, but you have been logged out locally.'
    );
    router.push('/login');
  }
};

// Load user data on component mount
onMounted(() => {
  fetchUser();
});
</script>

<template>
  <div class="container mx-auto bg-white rounded-2xl">
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

      <!-- Navigasi desktop -->
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
            <span>{{ userDisplayName }}</span>
            <Avatar>
              <AvatarImage
                v-if="currentUser?.avatar_url"
                :src="currentUser.avatar_url"
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
                    v-if="currentUser?.avatar_url"
                    :src="currentUser.avatar_url"
                    :alt="userDisplayName"
                  />
                  <AvatarFallback>{{ userInitials }}</AvatarFallback>
                </Avatar>
                <div>
                  <p class="font-medium leading-none">{{ userDisplayName }}</p>
                  <p class="text-xs leading-none text-muted-foreground">
                    {{ currentUser?.email || currentUser?.username || '@user' }}
                  </p>
                </div>
              </DropdownMenuItem>
            </router-link>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
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
            <span>{{ userDisplayName }}</span>
            <Avatar>
              <AvatarImage
                v-if="currentUser?.avatar_url"
                :src="currentUser.avatar_url"
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
                          v-if="currentUser?.avatar_url"
                          :src="currentUser.avatar_url"
                          :alt="userDisplayName"
                        />
                        <AvatarFallback>{{ userInitials }}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p class="font-medium leading-none">
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
                class="px-4 pt-2 pb-6 hover:bg-gray-200 rounded-md mx-4 flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <Moon v-if="!isDark" :size="20" />
                  <Sun v-else :size="20" />
                  <p class="font-medium leading-none">Dark Mode</p>
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
          <DrawerTitle>simPKL</DrawerTitle>
          <DrawerDescription class="capitalize">
            Pilih menu yang ingin anda akses
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
