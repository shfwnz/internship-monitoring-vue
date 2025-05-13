<script setup>
import { ref, computed, onMounted } from 'vue';
import { createReusableTemplate, useMediaQuery } from '@vueuse/core';
import api from '@/api';

// Base components
import { Button } from '../components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast, Toaster } from 'vue-sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const isOpen = ref(false);
const industryList = ref([]);
const industryName = ref('');
const businessField = ref('');
const email = ref('');
const phone = ref('');
const address = ref('');

const [UseTemplate, GridForm] = createReusableTemplate();
const isDesktop = useMediaQuery('(min-width: 768px)');

// pagination
const currentPage = ref(1);
const itemsPerPage = ref(5);

// fetch industries
const fetchIndustries = async () => {
  try {
    const response = await api.get('/industries');
    industryList.value = response.data.all_data;
  } catch (error) {
    console.error(error);
  }
};

// paginated industries
const paginatedIndustries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return industryList.value.slice(start, end);
});

// create industry
const createIndustry = async () => {
  try {
    if (
      !industryName.value ||
      !businessField.value ||
      !email.value ||
      !phone.value ||
      !address.value
    ) {
      toast.warning('Please fill in all fields');
      return;
    }

    const response = await api.post('/industries', {
      name: industryName.value,
      business_field: businessField.value,
      email: email.value,
      phone: phone.value,
      address: address.value,
    });
    industryList.value.push(response.data.added_data);
    toast.success('Successfully added industry');
    resetForm();
    isOpen.value = false;
  } catch (error) {
    console.error(error);
  }
};

// reset form
const resetForm = () => {
  industryName.value = '';
  businessField.value = '';
  email.value = '';
  phone.value = '';
  address.value = '';
};

onMounted(() => {
  fetchIndustries();
});
</script>

<template>
  <div class="grid grid-cols-4 gap-2">
    <!-- Industry List -->
    <Card class="col-span-3">
      <CardHeader class="flex flex-col justify-center items-center">
        <CardTitle class="text-2xl capitalize">Industry List</CardTitle>
        <CardDescription class="text-sm lowercase"
          >A simple, structured list of industries for your
          convenience</CardDescription
        >
      </CardHeader>
      <CardContent>
        <Input class="max-w-sm my-2" placeholder="Find Industry..." />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[100px]"> Name </TableHead>
              <TableHead>Business Field</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead class="text-right"> Address </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="industry in paginatedIndustries"
              :key="industry.name"
            >
              <TableCell class="font-medium">
                {{ industry.name }}
              </TableCell>
              <TableCell>
                <Badge variant="default" class="bg-amber-500">
                  {{ industry.business_field }}
                </Badge>
              </TableCell>
              <TableCell>{{ industry.email }}</TableCell>
              <TableCell>{{ industry.phone }}</TableCell>
              <TableCell class="text-right">{{ industry.address }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter class="flex justify-between">
        <div class="text-sm text-gray-500">
          Showing
          <span class="font-medium">{{ paginatedIndustries.length }}</span> of
          <span class="font-medium">{{ industryList.length }}</span> industries
        </div>
        <!-- eslint-disable -->
        <Pagination
          v-model:page="currentPage"
          :total="industryList.length"
          :items-per-page="itemsPerPage"
          :sibling-count="1"
          show-edges
        >
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationItem
              v-for="page in Math.ceil(industryList.length / itemsPerPage)"
              :key="page"
            >
              <PaginationLink :is-active="currentPage === page">
                {{ page }}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <!-- eslint-enable -->
      </CardFooter>
    </Card>

    <!-- add industry form -->
    <Card class="justify-center">
      <CardHeader>
        <CardTitle class="text-2xl capitalize font-bold">
          Didn't find your industry?
        </CardTitle>
        <CardDescription class="text-sm">
          Tell us what you're looking for so we can better serve your needs
        </CardDescription>
      </CardHeader>

      <!-- form -->
      <CardContent class="h-full items-center flex justify-center py-6">
        <UseTemplate>
          <form
            @submit.prevent="createIndustry()"
            class="grid items-start gap-4 px-4 w-full"
          >
            <div class="grid gap-2">
              <Label html-for="name" class="font-medium">Industry Name</Label>
              <Input
                v-model="industryName"
                id="name"
                placeholder="Enter industry name"
              />
            </div>
            <div class="grid gap-2">
              <Label html-for="business_field" class="font-medium"
                >Business Field</Label
              >
              <Input
                v-model="businessField"
                id="business_field"
                placeholder="e.g. Manufacturing, Retail, Technology"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="grid gap-2">
                <Label html-for="email" class="font-medium">Email</Label>
                <Input
                  v-model="email"
                  id="email"
                  type="email"
                  placeholder="contact@example.com"
                />
              </div>
              <div class="grid gap-2">
                <Label html-for="phone" class="font-medium">Phone</Label>
                <Input
                  v-model="phone"
                  id="phone"
                  placeholder="+62 xxx xxxx xxxx"
                />
              </div>
            </div>
            <div class="grid gap-2">
              <Label html-for="address" class="font-medium">Address</Label>
              <Input
                v-model="address"
                id="address"
                placeholder="Full address"
              />
            </div>
          </form>
        </UseTemplate>

        <!-- desktop form -->
        <!-- eslint-disable-next-line -->
        <Dialog v-if="isDesktop" v-model:open="isOpen">
          <DialogTrigger as-child>
            <Button
              variant="default"
              class="bg-amber-400 hover:bg-amber-500 font-medium shadow-md transition-all duration-300 hover:shadow-lg"
            >
              Add Industry
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[500px]">
            <DialogHeader class="border-b-2 pb-4">
              <DialogTitle class="text-2xl">Add New Industry</DialogTitle>
              <DialogDescription>
                Please provide information about the industry you're looking
                for.
              </DialogDescription>
            </DialogHeader>
            <GridForm />

            <Button
              type="submit"
              class="bg-amber-400 hover:bg-amber-500"
              @click="createIndustry()"
            >
              Submit Industry
            </Button>
          </DialogContent>
        </Dialog>

        <!-- mobile form -->
        <!-- eslint-disable-next-line -->
        <Drawer v-else v-model:open="isOpen">
          <DrawerTrigger as-child>
            <Button
              variant="default"
              class="bg-amber-400 hover:bg-amber-500 font-medium shadow-md"
            >
              Add Industry
            </Button>
          </DrawerTrigger>
          <DrawerContent class="border-t-amber-400 border-t-4">
            <DrawerHeader class="text-left border-b border-amber-200 pb-4">
              <DrawerTitle class="text-2xl">Add New Industry</DrawerTitle>
              <DrawerDescription>
                Please provide information about the industry you're looking
                for.
              </DrawerDescription>
            </DrawerHeader>
            <div class="px-4 py-2">
              <GridForm />
            </div>
            <DrawerFooter class="pt-2">
              <Button
                type="submit"
                class="bg-amber-400 hover:bg-amber-500"
                @click="createIndustry()"
              >
                Submit Industry
              </Button>
              <DrawerClose as-child>
                <Button
                  variant="outline"
                  class="border-amber-300 hover:bg-amber-50"
                  @click="resetForm"
                >
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardContent>

      <!-- footer -->
      <CardFooter class="border-t flex justify-between">
        <span class="text-sm">Help us improve our industry database</span>
        <span class="text-sm font-medium">Thank you for your contribution</span>
      </CardFooter>
    </Card>

    <Toaster position="top-right" richColors />
  </div>
</template>
