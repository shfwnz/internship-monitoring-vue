<script setup>
// Vue core
import { ref, computed, onMounted, watch } from "vue";

// API
import { api, getToken } from "@/api";

// Third-party utilities
import { toast } from "vue-sonner";
import { createReusableTemplate, useMediaQuery } from "@vueuse/core";
import { X, Save } from "lucide-vue-next";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


// Reactive data
const industryList = ref([]);
const businessFields = ref([]);

// Form data
const formData = ref({
  industryName: "",
  selectedBusinessField: "",
  email: "",
  phone: "",
  address: "",
  website: "",
});

// UI states
const isOpen = ref(false);
const searchQuery = ref("");
const isLoading = ref(false);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(6);

// Responsive
const [UseTemplate, GridForm] = createReusableTemplate();
const isDesktop = useMediaQuery("(min-width: 768px)");

// Computed properties
const filteredIndustries = computed(() => {
  if (!searchQuery.value) return industryList.value;

  const query = searchQuery.value.toLowerCase();
  return industryList.value.filter((industry) =>
    industry.name.toLowerCase().includes(query)
  );
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredIndustries.value.length / itemsPerPage.value))
);

const paginatedIndustries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredIndustries.value.slice(start, end);
});

const canPreviousPage = computed(() => currentPage.value > 1);
const canNextPage = computed(() => currentPage.value < totalPages.value);

// API functions
const fetchIndustries = async () => {
  try {
    const response = await api.get("/industries");
    industryList.value = response.data.all_data;
  } catch (error) {
    toast.error("Failed to fetch industries");
  }
};

const fetchBusinessFields = async () => {
  try {
    const response = await api.get("/business-fields");
    businessFields.value = response.data.data;
  } catch (error) {
    toast.error("Failed to fetch business fields");
  }
};

const createIndustry = async () => {
  try {
    isLoading.value = true;
    const data = {
      name: formData.value.industryName,
      business_field_id: formData.value.selectedBusinessField,
      email: formData.value.email,
      phone: formData.value.phone,
      address: formData.value.address,
      website: formData.value.website,
    }

    const requiredFields = [
      "industryName",
      "selectedBusinessField",
      "email",
      "phone",
      "address",
      "website",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData.value[field]
    );

    if (missingFields.length > 0) {
      toast.warning("Please fill in all fields");
      return;
    }

    await api.post("/industries", data);

    toast.success("Successfully added industry");
    resetForm();
    isOpen.value = false;
    await fetchIndustries();
  } catch (error) {
    if (error.response?.status === 422) {
      const errors = error.response.data?.errors || 'Failed to add industry';
      let errorMessage = 'Validation failed: ';
      Object.keys(errors).forEach((key) => {
        errorMessage += `${key}: ${errors[key].join(', ')}. `;
      });
      toast.error(errorMessage);
    } else {
      console.error(error);
      toast.error("Failed to add industry");
    }
  } finally {
    isLoading.value = false;
  }
};

// Pagination controls
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

// Utility functions
const resetForm = () => {
  formData.value = {
    industryName: "",
    selectedBusinessField: "",
    email: "",
    phone: "",
    address: "",
    website: "",
  };
  isOpen.value = false;
};

// Watchers
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Lifecycle
onMounted(() => {
  fetchIndustries();
  fetchBusinessFields();
});
</script>

<template>
  <div class="container mx-auto py-6 max-w-4xl flex flex-col max-h-screen">
    <!-- Form -->
    <UseTemplate>
      <form @submit.prevent="createIndustry()" class="grid items-start gap-4 px-4 w-full">
        <div class="grid gap-2">
          <Label for="name" class="font-medium">Industry Name</Label>
          <Input v-model="formData.industryName" id="name" placeholder="Enter industry name" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="business_field" class="font-medium">Business Field</Label>
            <Select v-model="formData.selectedBusinessField" id="business_field">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a business field" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Business Field</SelectLabel>
                  <SelectItem v-for="field in businessFields" :key="field.id" :value="field.id">
                    <SelectItemText>{{ field.name }}</SelectItemText>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div class="grid gap-2">
            <Label for="website" class="font-medium">Website</Label>
            <Input v-model="formData.website" id="website" placeholder="https://example.com" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="email" class="font-medium">Email</Label>
            <Input v-model="formData.email" id="email" type="email" placeholder="contact@example.com" />
          </div>
          <div class="grid gap-2">
            <Label for="phone" class="font-medium">Phone</Label>
            <Input v-model="formData.phone" id="phone" placeholder="+62 xxx xxxx xxxx" />
          </div>
        </div>
        <div class="grid gap-2">
          <Label for="address" class="font-medium">Address</Label>
          <Textarea v-model="formData.address" id="address" placeholder="Full address" rows="2" />
        </div>
      </form>
    </UseTemplate>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-2 flex-grow">
      <!-- Industry List -->
      <Card class="col-span-1 md:col-span-3">
        <CardHeader class="flex flex-col justify-center items-center">
          <CardTitle class="text-xl capitalize">Industry List</CardTitle>
          <CardDescription class="text-sm lowercase">A simple, structured list of industries for your
            convenience</CardDescription>
        </CardHeader>
        <CardContent class="flex-1 flex flex-col justify-start">
          <Input v-model="searchQuery" class="max-w-sm my-2" placeholder="Find Industry..." />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Business Field</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Website</TableHead>
                <TableHead class="text-right"> Address </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="industry in paginatedIndustries" :key="industry.id || industry.name">
                <TableCell class="font-medium">
                  {{ industry.name }}
                </TableCell>
                <TableCell>
                  <Badge variant="default" class="bg-amber-500">
                    {{ industry.business_field?.name }}
                  </Badge>
                </TableCell>
                <TableCell>{{ industry.email }}</TableCell>
                <TableCell>{{ industry.phone }}</TableCell>
                <TableCell>{{ industry.website }}</TableCell>
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
        <CardFooter class="flex flex-col items-center gap-4">
          <div class="text-sm text-gray-500">
            Showing
            <span class="font-medium">{{ paginatedIndustries.length }}</span> of
            <span class="font-medium">{{ filteredIndustries.length }}</span>
            industries
          </div>

          <!-- Pagination Controls -->
          <Pagination v-if="totalPages > 1" class="gap-2 sm:gap-4 md:gap-8">
            <!-- Mobile -->
            <div class="flex md:hidden gap-2">
              <PaginationItem>
                <PaginationPrevious @click="previousPage" :disabled="!canPreviousPage" />
              </PaginationItem>

              <div class="flex items-center mx-2">
                <span class="text-sm">{{ currentPage }} / {{ totalPages }}</span>
              </div>

              <PaginationItem>
                <PaginationNext @click="nextPage" :disabled="!canNextPage" />
              </PaginationItem>
            </div>

            <!-- Desktop -->
            <div class="hidden md:grid md:grid-cols-4 md:gap-4 md:items-center md:w-full">
              <div class="flex gap-12 justify-end">
                <PaginationItem v-if="totalPages > 2">
                  <PaginationFirst @click="goToPage(1)" :disabled="currentPage === 1" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious @click="previousPage" :disabled="!canPreviousPage" />
                </PaginationItem>
              </div>

              <!-- Page Numbers -->
              <div class="col-span-2 flex justify-center space-x-2">
                <template v-for="page in totalPages" :key="page">
                  <!-- Show first page, last page, and pages around current page -->
                  <PaginationItem v-if="
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ">
                    <Button variant="outline" :class="{ 'bg-amber-100': currentPage === page }" @click="goToPage(page)">
                      {{ page }}
                    </Button>
                  </PaginationItem>

                  <!-- Show ellipsis where needed -->
                  <PaginationItem v-else-if="
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2)
                  ">
                    <PaginationEllipsis />
                  </PaginationItem>
                </template>
              </div>

              <div class="flex gap-12 justify-start">
                <PaginationItem>
                  <PaginationNext @click="nextPage" :disabled="!canNextPage" />
                </PaginationItem>
                <PaginationItem v-if="totalPages > 2">
                  <PaginationLast @click="goToPage(totalPages)" :disabled="currentPage === totalPages" />
                </PaginationItem>
              </div>
            </div>
          </Pagination>
        </CardFooter>
      </Card>

      <!-- add industry form -->
      <Card class="justify-center">
        <CardHeader>
          <CardTitle class="text-xl capitalize font-bold">
            Didn't find your industry?
          </CardTitle>
          <CardDescription class="text-sm text-justify">
            Tell us what you're looking for so we can better serve your needs
          </CardDescription>
        </CardHeader>

        <!-- form -->
        <CardContent class="h-full items-center flex justify-center py-6">
          <!-- desktop form -->
          <!-- eslint-disable-next-line -->
          <Dialog v-if="isDesktop" v-model:open="isOpen">
            <DialogTrigger as-child>
              <Button variant="default" class="bg-amber-400 hover:bg-amber-500">
                Add Industry
              </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[500px]">
              <DialogHeader class="border-b-2 pb-4">
                <DialogTitle class="text-xl">Add New Industry</DialogTitle>
                <DialogDescription>
                  Please provide information about the industry you're looking
                  for.
                </DialogDescription>
              </DialogHeader>
              <GridForm />
              <div class="flex justify-end gap-2">
                <Button @click="resetForm" variant="outline" :disabled="isLoading"
                  class="border-amber-300 hover:bg-amber-50">
                  <X class="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" @click="createIndustry" :disabled="isLoading"
                  class="bg-amber-400 hover:bg-amber-500">
                  <Save class="h-4 w-4 mr-2" />
                  {{ isLoading ? 'Saving...' : 'Submit Industry' }}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <!-- mobile form -->
          <!-- eslint-disable-next-line -->
          <Drawer v-else v-model:open="isOpen">
            <DrawerTrigger as-child>
              <Button variant="default" class="bg-amber-400 hover:bg-amber-500">
                Add Industry
              </Button>
            </DrawerTrigger>

            <DrawerContent class="border-t-amber-400 border-t-4">
              <DrawerHeader class="text-left border-b border-amber-200 pb-4">
                <DrawerTitle class="text-xl">Add New Industry</DrawerTitle>
                <DrawerDescription>
                  Please provide information about the industry you're looking
                  for.
                </DrawerDescription>
              </DrawerHeader>
              <GridForm />
              <DrawerFooter>
                <Button type="submit" @click="createIndustry" :disabled="isLoading"
                  class="bg-amber-400 hover:bg-amber-500">
                  <Save class="h-4 w-4 mr-2" />
                  {{ isLoading ? 'Saving...' : 'Submit Industry' }}
                </Button>
                <DrawerClose>
                  <Button @click="resetForm" variant="outline" :disabled="isLoading" class="w-full">
                    <X class="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </CardContent>

        <CardFooter class="border-t flex justify-between">
          <span class="text-sm">Help us improve our database</span>
          <span class="text-sm text-right">Thank you for your contribution</span>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
