<script setup>
// Import Vue
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

// Import Lucide
import { Minimize, Maximize } from 'lucide-vue-next';

// Import API
import api from '@/api';

// Import UI components
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

const LARAVEL_BASE_URL = 'http://127.0.0.1:8000';

// State
const internshipList = ref([]);
const studentList = ref([]);
const isLoading = ref(false);

// Search
const internshipSearchQuery = ref('');
const studentSearchQuery = ref('');

// Pagination
const internshipCurrentPage = ref(1);
const studentCurrentPage = ref(1);
const itemsPerPage = ref(5);

// Toggle maximize
const internshipMaximized = ref(true);
const studentMaximized = ref(false);

// Toggle maximize functions
const toggleInternshipMaximize = () => {
  internshipMaximized.value = !internshipMaximized.value;
  if (internshipMaximized.value) {
    studentMaximized.value = false;
  }
};

const toggleStudentMaximize = () => {
  studentMaximized.value = !studentMaximized.value;
  if (studentMaximized.value) {
    internshipMaximized.value = false;
  }
};

// Computed properties
const filteredInternships = computed(() => {
  if (!internshipSearchQuery.value) {
    return internshipList.value;
  }

  const query = internshipSearchQuery.value.toLowerCase();
  return internshipList.value.filter(
    (internship) =>
      internship.student.user.name.toLowerCase().includes(query) ||
      internship.industry.name.toLowerCase().includes(query)
  );
});

const filteredStudents = computed(() => {
  if (!studentSearchQuery.value) {
    return studentList.value;
  }

  const query = studentSearchQuery.value.toLowerCase();
  return studentList.value.filter((student) =>
    student.user.name.toLowerCase().includes(query)
  );
});

const totalPagesInternship = computed(() =>
  Math.max(1, Math.ceil(filteredInternships.value.length / itemsPerPage.value))
);

const totalPagesStudent = computed(() =>
  Math.max(1, Math.ceil(filteredStudents.value.length / itemsPerPage.value))
);

const paginatedInternships = computed(() => {
  const start = (internshipCurrentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredInternships.value.slice(start, end);
});

const paginatedStudents = computed(() => {
  const start = (studentCurrentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredStudents.value.slice(start, end);
});

// Internship pagination
const canPreviousPageInternship = computed(
  () => internshipCurrentPage.value > 1
);
const canNextPageInternship = computed(
  () => internshipCurrentPage.value < totalPagesInternship.value
);

const goToPageInternship = (page) => {
  internshipCurrentPage.value = page;
};

const previousPageInternship = () => {
  if (canPreviousPageInternship.value) internshipCurrentPage.value--;
};

const nextPageInternship = () => {
  if (canNextPageInternship.value) internshipCurrentPage.value++;
};

// Student pagination
const canPreviousPageStudent = computed(() => studentCurrentPage.value > 1);
const canNextPageStudent = computed(
  () => studentCurrentPage.value < totalPagesStudent.value
);

const goToPageStudent = (page) => {
  studentCurrentPage.value = page;
};

const previousPageStudent = () => {
  if (canPreviousPageStudent.value) studentCurrentPage.value--;
};

const nextPageStudent = () => {
  if (canNextPageStudent.value) studentCurrentPage.value++;
};

// Fetch data
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

const getFullFileUrl = (filePath) => {
  if (!filePath) return '#';

  if (filePath.startsWith('http')) {
    return filePath;
  }

  return `${LARAVEL_BASE_URL}/storage/${filePath}`;
};

onMounted(() => {
  fetchInternships();
  fetchStudents();
});

watch(internshipSearchQuery, () => {
  internshipCurrentPage.value = 1;
});

watch(studentSearchQuery, () => {
  studentCurrentPage.value = 1;
});
</script>

<template>
  <RoleGuard :allowed-roles="['teacher']">
    <div class="container mx-auto py-2 grid grid-cols-4 gap-4">
      <!-- Internship List -->
      <Card
        class="min-h-screen"
        :class="{
          'col-span-1 md:col-span-3': internshipMaximized,
          'col-span-1 md:col-span-1': studentMaximized,
        }"
      >
        <CardHeader class="flex justify-between items-center">
          <div class="flex flex-col">
            <CardTitle class="text-xl capitalize"
              >Internship Progress</CardTitle
            >
            <CardDescription>Current status and completion</CardDescription>
          </div>
          <div>
            <Button
              v-if="!internshipMaximized"
              @click="toggleInternshipMaximize"
              variant="outline"
              ><Maximize
            /></Button>
            <Button v-else variant="outline" disabled><Minimize /></Button>
          </div>
        </CardHeader>
        <CardContent class="flex-1 flex flex-col justify-start">
          <Input
            v-model="internshipSearchQuery"
            class="max-w-sm my-2"
            placeholder="Search..."
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Industry Name</TableHead>
                <TableHead>Teacher Name</TableHead>
                <TableHead>File</TableHead>
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
                    internship.student?.user?.name || 'Unknown'
                  }}</TableCell>
                  <TableCell>
                    {{ internship.industry?.name || 'Unknown' }}
                  </TableCell>
                  <TableCell>{{
                    internship.teacher?.user?.name || 'Unknown'
                  }}</TableCell>
                  <TableCell>
                    <a
                      :href="getFullFileUrl(internship.file)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-500 hover:underline"
                      >View</a
                    >
                  </TableCell>
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
                  @click="previousPageInternship"
                  :disabled="!canPreviousPageInternship"
                />
              </PaginationItem>

              <div class="flex items-center mx-2">
                <span class="text-sm"
                  >{{ internshipCurrentPage }} /
                  {{ totalPagesInternship }}</span
                >
              </div>

              <PaginationItem>
                <PaginationNext
                  @click="nextPageInternship"
                  :disabled="!canNextPageInternship"
                />
              </PaginationItem>
            </div>

            <!-- Desktop -->
            <div
              class="hidden md:grid md:grid-cols-4 md:gap-4 md:items-center md:w-full"
            >
              <div class="flex gap-12 justify-end">
                <PaginationItem v-if="totalPagesInternship > 2">
                  <PaginationFirst
                    @click="goToPageInternship(1)"
                    :disabled="internshipCurrentPage === 1"
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious
                    @click="previousPageInternship"
                    :disabled="!canPreviousPageInternship"
                  />
                </PaginationItem>
              </div>

              <!-- Page Numbers -->
              <div class="col-span-2 flex justify-center space-x-2">
                <template v-for="page in totalPagesInternship" :key="page">
                  <!-- Show first page, last page, and pages around current page -->
                  <PaginationItem
                    v-if="
                      page === 1 ||
                      page === totalPagesInternship ||
                      (page >= internshipCurrentPage - 1 &&
                        page <= internshipCurrentPage + 1)
                    "
                  >
                    <Button
                      variant="outline"
                      :class="{
                        'bg-blue-100': internshipCurrentPage === page,
                      }"
                      @click="goToPageInternship(page)"
                    >
                      {{ page }}
                    </Button>
                  </PaginationItem>

                  <!-- Show ellipsis where needed -->
                  <PaginationItem
                    v-else-if="
                      (page === 2 && internshipCurrentPage > 3) ||
                      (page === totalPagesInternship - 1 &&
                        internshipCurrentPage < totalPagesInternship - 2)
                    "
                  >
                    <PaginationEllipsis />
                  </PaginationItem>
                </template>
              </div>

              <div class="flex gap-12 justify-start">
                <PaginationItem>
                  <PaginationNext
                    @click="nextPageInternship"
                    :disabled="!canNextPageInternship"
                  />
                </PaginationItem>
                <PaginationItem v-if="totalPagesInternship > 2">
                  <PaginationLast
                    @click="goToPageInternship(totalPagesInternship)"
                    :disabled="internshipCurrentPage === totalPagesInternship"
                  />
                </PaginationItem>
              </div>
            </div>
          </Pagination>
        </CardFooter>
      </Card>

      <!-- Student List -->
      <Card
        class="min-h-screen"
        :class="{
          'col-span-1 md:col-span-3': studentMaximized,
          'col-span-1 md:col-span-1': internshipMaximized,
        }"
      >
        <CardHeader class="flex justify-between items-center">
          <div class="flex flex-col">
            <CardTitle class="text-xl capitalize">Student Data</CardTitle>
            <CardDescription>Current status and completion</CardDescription>
          </div>
          <div>
            <Button
              v-if="!studentMaximized"
              @click="toggleStudentMaximize"
              variant="outline"
              ><Maximize
            /></Button>
            <Button v-else variant="outline" disabled><Minimize /></Button>
          </div>
        </CardHeader>
        <CardContent class="flex-1 flex flex-col justify-start">
          <Input
            v-model="studentSearchQuery"
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
                <TableHead>Gender</TableHead>
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

              <template v-else-if="paginatedStudents.length > 0">
                <TableRow
                  v-for="student in paginatedStudents"
                  :key="student.id"
                >
                  <TableCell class="font-medium">{{
                    student.user?.name || 'Unknown'
                  }}</TableCell>
                  <TableCell>
                    {{ student.nis || 'Unknown' }}
                  </TableCell>
                  <TableCell>{{ student.user?.email || 'Unknown' }}</TableCell>
                  <TableCell>{{ student.user?.phone || 'Unknown' }}</TableCell>
                  <TableCell>
                    {{
                      student.user?.gender === 'L'
                        ? 'Male'
                        : student.user?.gender === 'P'
                        ? 'Female'
                        : 'Unknown'
                    }}
                  </TableCell>
                  <TableCell>{{
                    student.status ? 'Active' : 'Inactive'
                  }}</TableCell>
                  <TableCell class="text-right"
                    >{{ student.user?.address || 'Unknown' }}
                  </TableCell>
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
            <span class="font-medium">{{ paginatedStudents.length }}</span>
            of
            <span class="font-medium">{{ filteredStudents.length }}</span>
            students
          </div>

          <!-- Pagination Controls -->
          <Pagination class="gap-2 sm:gap-4 md:gap-8">
            <!-- Mobile -->
            <div class="flex md:hidden gap-2">
              <PaginationItem>
                <PaginationPrevious
                  @click="previousPageStudent"
                  :disabled="!canPreviousPageStudent"
                />
              </PaginationItem>

              <div class="flex items-center mx-2">
                <span class="text-sm"
                  >{{ studentCurrentPage }} / {{ totalPagesStudent }}</span
                >
              </div>

              <PaginationItem>
                <PaginationNext
                  @click="nextPageStudent"
                  :disabled="!canNextPageStudent"
                />
              </PaginationItem>
            </div>

            <!-- Desktop -->
            <div
              class="hidden md:grid md:grid-cols-4 md:gap-4 md:items-center md:w-full"
            >
              <div class="flex gap-12 justify-end">
                <PaginationItem v-if="totalPagesStudent > 2">
                  <PaginationFirst
                    @click="goToPageStudent(1)"
                    :disabled="studentCurrentPage === 1"
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious
                    @click="previousPageStudent"
                    :disabled="!canPreviousPageStudent"
                  />
                </PaginationItem>
              </div>

              <!-- Page Numbers -->
              <div class="col-span-2 flex justify-center space-x-2">
                <template v-for="page in totalPagesStudent" :key="page">
                  <!-- Show first page, last page, and pages around current page -->
                  <PaginationItem
                    v-if="
                      page === 1 ||
                      page === totalPagesStudent ||
                      (page >= studentCurrentPage - 1 &&
                        page <= studentCurrentPage + 1)
                    "
                  >
                    <Button
                      variant="outline"
                      :class="{ 'bg-blue-100': studentCurrentPage === page }"
                      @click="goToPageStudent(page)"
                    >
                      {{ page }}
                    </Button>
                  </PaginationItem>

                  <!-- Show ellipsis where needed -->
                  <PaginationItem
                    v-else-if="
                      (page === 2 && studentCurrentPage > 3) ||
                      (page === totalPagesStudent - 1 &&
                        studentCurrentPage < totalPagesStudent - 2)
                    "
                  >
                    <PaginationEllipsis />
                  </PaginationItem>
                </template>
              </div>

              <div class="flex gap-12 justify-start">
                <PaginationItem>
                  <PaginationNext
                    @click="nextPageStudent"
                    :disabled="!canNextPageStudent"
                  />
                </PaginationItem>
                <PaginationItem v-if="totalPagesStudent > 2">
                  <PaginationLast
                    @click="goToPageStudent(totalPagesStudent)"
                    :disabled="studentCurrentPage === totalPagesStudent"
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
