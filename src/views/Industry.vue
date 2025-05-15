<script setup>
import { ref, computed, onMounted, watch } from 'vue';
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
const searchQuery = ref('');

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
    console.log('Fetched industries:', industryList.value);
  } catch (error) {
    console.error(error);
    toast.error('Failed to fetch industries');
  }
};

// Filter industries based on search query
const filteredIndustries = computed(() => {
  if (!searchQuery.value) return industryList.value;

  return industryList.value.filter((industry) => {
    const query = searchQuery.value.toLowerCase();
    return (
      industry.name.toLowerCase().includes(query) ||
      industry.business_field.toLowerCase().includes(query) ||
      industry.email.toLowerCase().includes(query)
    );
  });
});

// Calculate total pages
const totalPages = computed(() => {
  return Math.max(
    1,
    Math.ceil(filteredIndustries.value.length / itemsPerPage.value)
  );
});

// paginated industries
const paginatedIndustries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredIndustries.value.slice(start, end);
});

// Pagination controls
const canPreviousPage = computed(() => currentPage.value > 1);
const canNextPage = computed(() => currentPage.value < totalPages.value);

const goToPage = (page) => {
  currentPage.value = page;
};

const previousPage = () => {
  if (canPreviousPage.value) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (canNextPage.value) {
    currentPage.value++;
  }
};

// Reset to first page when search query changes
watch(searchQuery, () => {
  currentPage.value = 1;
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
    toast.error('Failed to add industry');
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
  <div class="container mx-auto py-2 flex flex-col min-h-screen">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-2 flex-grow">
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
          <Input
            v-model="searchQuery"
            class="max-w-sm my-2"
            placeholder="Find Industry..."
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead> Name </TableHead>
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
              <TableRow v-if="paginatedIndustries.length === 0">
                <TableCell colspan="5" class="text-center py-4">
                  No industries found. Please try another search or add a new
                  industry.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter class="flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Showing
            <span class="font-medium">{{ paginatedIndustries.length }}</span> of
            <span class="font-medium">{{ filteredIndustries.length }}</span>
            industries
          </div>

          <!-- Pagination Controls -->
          <Pagination v-if="totalPages > 1" class="gap-8">
            <PaginationItem v-if="totalPages > 2">
              <PaginationFirst
                @click="goToPage(1)"
                :disabled="currentPage === 1"
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                @click="previousPage"
                :disabled="!canPreviousPage"
              />
            </PaginationItem>

            <!-- Page Numbers -->
            <div class="flex">
              <template v-for="page in totalPages" :key="page">
                <!-- Show first page, last page, and pages around current page -->
                <PaginationItem
                  v-if="
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  "
                >
                  <Button
                    variant="outline"
                    :class="{ 'bg-amber-100': currentPage === page }"
                    @click="goToPage(page)"
                  >
                    {{ page }}
                  </Button>
                </PaginationItem>

                <!-- Show ellipsis where needed -->
                <PaginationItem
                  v-else-if="
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2)
                  "
                >
                  <PaginationEllipsis />
                </PaginationItem>
              </template>
            </div>

            <PaginationItem>
              <PaginationNext @click="nextPage" :disabled="!canNextPage" />
            </PaginationItem>
            <PaginationItem v-if="totalPages > 2">
              <PaginationLast
                @click="goToPage(totalPages)"
                :disabled="currentPage === totalPages"
              />
            </PaginationItem>
          </Pagination>
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
          <span class="text-sm font-medium"
            >Thank you for your contribution</span
          >
        </CardFooter>
      </Card>

      <Toaster position="top-right" richColors />
    </div>
  </div>
</template>
