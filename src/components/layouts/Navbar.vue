<script setup>
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';

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

const profileMenu = [
  {
    name: 'Profile',
    path: '/app/profile',
  },
];
</script>

<template>
  <nav class="flex py-3 px-4 bg-white rounded-2xl">
    <div class="flex items-center justify-start">Logo</div>
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
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger> User</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul class="gap-3 p-0.5">
                <li v-for="link in profileMenu" :key="link.path">
                  <NavigationMenuLink as-child>
                    <a
                      :href="link.path"
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div class="text-sm font-medium leading-none">
                        {{ link.name }}
                      </div>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Avatar>
        <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  </nav>
</template>
