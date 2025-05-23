<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Minimize, Maximize } from 'lucide-vue-next';

import api from '@/api';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const internshipList = ref([]);
const studentList = ref([]);
const searchQuery = ref('');
const isLoading = ref(false);
const isViewStudent = ref(false);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(9);

const filteredInternships = computed(() => {
  if (!searchQuery.value) {
    return internshipList.value;
  }

  const query = searchQuery.value.toLowerCase();
  return internshipList.value.filter(
    (internship) =>
      internship.student.user.name.toLowerCase().includes(query) ||
      internship.industry.name.toLowerCase().includes(query)
  );
});

const filteredStudents = computed(() => {
  if (!searchQuery.value) {
    return studentList.value;
  }

  const query = searchQuery.value.toLowerCase();
  return studentList.value.filter((student) =>
    student.user.name.toLowerCase().includes(query)
  );
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredInternships.value.length / itemsPerPage.value))
);

const paginatedInternships = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredInternships.value.slice(start, end);
});

const canPreviousPage = computed(() => currentPage.value > 1);
const canNextPage = computed(() => currentPage.value < totalPages.value);

// Pagination Controls
const goToPage = (page) => {
  currentPage.value = page;
};

const previousPage = () => {
  if (canPreviousPage.value) currentPage.value--;
};

const nextPage = () => {
  if (canNextPage.value) currentPage.value++;
};

const fetchInternships = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/internships');
    internshipList.value = response.data.all_data;
    console.log('Fetched internships:', internshipList.value);
  } catch (error) {
    console.error(error);
    toast.error('Failed to fetch internships');
  } finally {
    isLoading.value = false;
  }
};

const fetchStudents = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/students');
    studentList.value = response.data.all_data;
    console.log('Fetched students:', studentList.value);
  } catch (error) {
    console.error(error);
    toast.error('Failed to fetch students');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchInternships();
  fetchStudents();
});

watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>

<template>
  <RoleGuard :allowed-roles="['teacher']">
    <div class="container mx-auto py-2 grid grid-cols-4 gap-4">
      <Card class="min-h-screen col-span-3">
        <CardHeader class="flex justify-between items-center">
          <div class="flex flex-col">
            <CardTitle class="text-xl capitalize"
              >Internship Progress</CardTitle
            >
            <CardDescription>Current status and completion</CardDescription>
          </div>
          <Button variant="outline"><Minimize /></Button>
        </CardHeader>
        <CardContent class="flex-1 flex flex-col justify-start">
          <Input
            v-model="searchQuery"
            class="max-w-sm my-2"
            placeholder="Search..."
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Industry Name</TableHead>
                <TableHead>Teacher Name</TableHead>
                <TableHead class="text-right">Start Date - End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="isLoading">
                <TableCell colspan="5" class="text-center py-4">
                  Loading internships...
                </TableCell>
              </TableRow>

              <template v-else-if="paginatedInternships.length > 0">
                <TableRow
                  v-for="internship in paginatedInternships"
                  :key="internship.id"
                >
                  <TableCell class="font-medium">{{
                    internship.student.user.name || 'Unknown'
                  }}</TableCell>
                  <TableCell>
                    {{ internship.industry.name || 'Unknown' }}
                  </TableCell>
                  <TableCell>{{
                    internship.teacher.user.name || 'Unknown'
                  }}</TableCell>

                  <TableCell class="text-right"
                    >{{ internship.start_date || 'Unknown' }} -
                    {{ internship.end_date || 'Unknown' }}</TableCell
                  >
                </TableRow>
              </template>

              <TableRow v-else>
                <TableCell colspan="5" class="text-center py-4">
                  No Data Found, Please try login again
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter class="flex flex-col items-center gap-4">
          <div class="text-sm text-gray-500">
            Showing
            <span class="font-medium">{{ paginatedInternships.length }}</span>
            of
            <span class="font-medium">{{ filteredInternships.length }}</span>
            internships
          </div>

          <!-- Pagination Controls -->
          <Pagination class="gap-2 sm:gap-4 md:gap-8">
            <!-- Mobile -->
            <div class="flex md:hidden gap-2">
              <PaginationItem>
                <PaginationPrevious
                  @click="previousPage"
                  :disabled="!canPreviousPage"
                />
              </PaginationItem>

              <div class="flex items-center mx-2">
                <span class="text-sm"
                  >{{ currentPage }} / {{ totalPages }}</span
                >
              </div>

              <PaginationItem>
                <PaginationNext @click="nextPage" :disabled="!canNextPage" />
              </PaginationItem>
            </div>

            <!-- Desktop -->
            <div
              class="hidden md:grid md:grid-cols-4 md:gap-4 md:items-center md:w-full"
            >
              <div class="flex gap-12 justify-end">
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
              </div>

              <!-- Page Numbers -->
              <div class="col-span-2 flex justify-center space-x-2">
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

              <div class="flex gap-12 justify-start">
                <PaginationItem>
                  <PaginationNext @click="nextPage" :disabled="!canNextPage" />
                </PaginationItem>
                <PaginationItem v-if="totalPages > 2">
                  <PaginationLast
                    @click="goToPage(totalPages)"
                    :disabled="currentPage === totalPages"
                  />
                </PaginationItem>
              </div>
            </div>
          </Pagination>
        </CardFooter>
      </Card>

      <Card class="min-h-screen col-span-1">
        <CardHeader class="flex justify-between items-center">
          <div class="flex flex-col">
            <CardTitle class="text-xl capitalize">Student Data</CardTitle>
            <CardDescription>Current status and completion</CardDescription>
          </div>
          <Button variant="outline"><Maximize /></Button>
        </CardHeader>
        <CardContent class="flex-1 flex flex-col justify-start">
          <Input
            v-model="searchQuery"
            class="max-w-sm my-2"
            placeholder="Search..."
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>NIS</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead class="text-right">Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="isLoading">
                <TableCell colspan="5" class="text-center py-4">
                  Loading Data...
                </TableCell>
              </TableRow>

              <template v-else-if="paginatedInternships.length > 0">
                <TableRow
                  v-for="internship in paginatedInternships"
                  :key="internship.id"
                >
                  <TableCell class="font-medium">{{
                    internship.student.user.name || 'Unknown'
                  }}</TableCell>
                  <TableCell>
                    {{ internship.industry.name || 'Unknown' }}
                  </TableCell>
                  <TableCell>{{
                    internship.teacher.user.name || 'Unknown'
                  }}</TableCell>

                  <TableCell class="text-right"
                    >{{ internship.start_date || 'Unknown' }} -
                    {{ internship.end_date || 'Unknown' }}</TableCell
                  >
                </TableRow>
              </template>

              <TableRow v-else>
                <TableCell colspan="5" class="text-center py-4">
                  No Data Found, Please try login again
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter class="flex flex-col items-center gap-4">
          <div class="text-sm text-gray-500">
            Showing
            <span class="font-medium">{{ paginatedInternships.length }}</span>
            of
            <span class="font-medium">{{ filteredInternships.length }}</span>
            internships
          </div>

          <!-- Pagination Controls -->
          <Pagination class="gap-2 sm:gap-4 md:gap-8">
            <!-- Mobile -->
            <div class="flex md:hidden gap-2">
              <PaginationItem>
                <PaginationPrevious
                  @click="previousPage"
                  :disabled="!canPreviousPage"
                />
              </PaginationItem>

              <div class="flex items-center mx-2">
                <span class="text-sm"
                  >{{ currentPage }} / {{ totalPages }}</span
                >
              </div>

              <PaginationItem>
                <PaginationNext @click="nextPage" :disabled="!canNextPage" />
              </PaginationItem>
            </div>

            <!-- Desktop -->
            <div
              class="hidden md:grid md:grid-cols-4 md:gap-4 md:items-center md:w-full"
            >
              <div class="flex gap-12 justify-end">
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
              </div>

              <!-- Page Numbers -->
              <div class="col-span-2 flex justify-center space-x-2">
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

              <div class="flex gap-12 justify-start">
                <PaginationItem>
                  <PaginationNext @click="nextPage" :disabled="!canNextPage" />
                </PaginationItem>
                <PaginationItem v-if="totalPages > 2">
                  <PaginationLast
                    @click="goToPage(totalPages)"
                    :disabled="currentPage === totalPages"
                  />
                </PaginationItem>
              </div>
            </div>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  </RoleGuard>
</template>
