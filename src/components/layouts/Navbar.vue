<script setup>
import { ref } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { Moon } from 'lucide-vue-next';

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

const isDesktop = useMediaQuery('(min-width: 768px)');
const isDrawerOpen = ref(false);

const openDrawer = () => {
  isDrawerOpen.value = true;
};
const closeDrawer = () => {
  isDrawerOpen.value = false;
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
    <nav class="flex py-2 px-4">
      <div class="flex items-center justify-start">SimPKL</div>
      <ul class="flex flex-1 gap-4 items-center justify-center">
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
      <div class="flex items-center justify-end gap-3">
        <!-- DESKTOP (DropdownMenu) -->
        <DropdownMenu v-if="isDesktop">
          <DropdownMenuTrigger class="flex items-center space-x-2">
            <span>User</span>
            <Avatar>
              <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
              <AvatarFallback>CN</AvatarFallback>
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
                  <AvatarFallback>CN</AvatarFallback>
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
                <Moon :size="20" />
                <p class="font-medium leading-none">Dark Mode</p>
              </div>
              <Switch :model-value="isDark" @update:model-value="toggleTheme">
                <template #thumb>
                  <Icon v-if="isDark" icon="lucide:moon" class="size-3" />
                  <Icon v-else icon="lucide:sun" class="size-3" />
                </template>
              </Switch>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- MOBILE (Drawer) -->
        <div v-else>
          <button class="flex items-center space-x-2" @click="openDrawer">
            <span>User</span>
            <Avatar>
              <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </button>

          <Drawer v-model:open="isDrawerOpen">
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle class="py-2 px-4 rounded-md hover:bg-gray-200">
                  <router-link to="/app/profile">
                    <div class="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src="https://github.com/unovue.png"
                          alt="@unovue"
                        />
                        <AvatarFallback>CN</AvatarFallback>
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
                class="px-4 pt-2 pb-6 hover:bg-gray-200 rounded-md mx-4 flex items-center gap-2"
              >
                <div class="flex items-center gap-2">
                  <Moon :size="20" />
                  <p class="font-medium leading-none">Dark Mode</p>
                </div>
                <Switch :model-value="isDark" @update:model-value="toggleTheme">
                  <template #thumb>
                    <Icon v-if="isDark" icon="lucide:moon" class="size-3" />
                    <Icon v-else icon="lucide:sun" class="size-3" />
                  </template>
                </Switch>
              </div>

              <DrawerFooter class="pt-4 border-t">
                <Button variant="outline">Logout</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  </div>
</template>
