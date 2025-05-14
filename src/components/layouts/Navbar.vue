<script setup>
import { ref } from 'vue';
import { createReusableTemplate, useMediaQuery } from '@vueuse/core';
import { Moon, Menu, Sun } from 'lucide-vue-next';

// components
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const [UseTemplate, NavItem] = createReusableTemplate();
const isDesktop = useMediaQuery('(min-width: 768px)');
const isDrawerOpen = ref(false);
const isMenuDrawerOpen = ref(false);
const isDark = ref(false);

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
</script>

<template>
  <div class="container mx-auto bg-white rounded-2xl">
    <nav class="flex py-2 px-4 items-center">
      <!-- Tombol menu untuk mobile -->
      <div v-if="!isDesktop" class="mr-2">
        <Button variant="ghost" @click="openMenuDrawer">
          <Menu />
        </Button>
      </div>

      <!-- Logo -->
      <div class="flex items-center justify-start font-bold text-xl">
        SimPKL
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
        <!-- DESKTOP (DropdownMenu) -->
        <DropdownMenu v-if="isDesktop">
          <DropdownMenuTrigger class="flex items-center space-x-2">
            <span>User</span>
            <Avatar>
              <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <router-link to="/app/profile">
              <DropdownMenuItem class="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/unovue.png"
                    alt="@unovue"
                  />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <div>
                  <p class="font-medium leading-none">Unovue</p>
                  <p class="text-xs leading-none text-muted-foreground">
                    @unovue
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
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- MOBILE (User Drawer) -->
        <div v-else>
          <button class="flex items-center space-x-2" @click="openDrawer">
            <span>User</span>
            <Avatar>
              <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
              <AvatarFallback>UN</AvatarFallback>
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
                          src="https://github.com/unovue.png"
                          alt="@unovue"
                        />
                        <AvatarFallback>UN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p class="font-medium leading-none">Unovue</p>
                        <p class="text-xs leading-none text-muted-foreground">
                          @unovue
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
                <Button variant="outline">Logout</Button>
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
          <DrawerTitle>Menu Navigasi</DrawerTitle>
          <DrawerDescription
            >Pilih halaman yang ingin Anda kunjungi</DrawerDescription
          >
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
