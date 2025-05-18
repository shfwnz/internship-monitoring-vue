<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

// components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// data
const internship = ref([]);
const progress = ref(0);

// const fetchUser = async () => {
//   try {
//     // const response = await api.get('/user');
//     localStorage.setItem('user', JSON.stringify(response.data.user));
//   } catch (err) {
//     console.error(err);
//   }
// };

const fetchInternships = async () => {
  try {
    const response = await api.get('/internships');
    internship.value = response.data.all_data;
    console.log('Fetched internships:', internship.value);
  } catch (error) {
    console.error(error);
    toast.error('Failed to fetch internships');
  }
};

onMounted(() => {
  // fetchUser();
  fetchInternships();
});
</script>

<template>
  <RoleGuard :allowed-roles="['student']">
    <div class="container mx-auto py-2 flex flex-col min-h-screen">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-2 flex-grow">
        <!-- Progress Card -->
        <Card class="col-span-1 md:col-span-3 bg-white">
          <CardHeader>
            <div class="flex justify-between items-center">
              <div>
                <CardTitle class="text-xl capitalize"
                  >Progres Prakerin</CardTitle
                >
                <CardDescription
                  >Status dan penyelesaian saat ini</CardDescription
                >
              </div>
              <Badge
                class="px-3 py-1.5 text-sm font-medium"
                :class="[
                  'bg-emerald-100 text-emerald-800 border border-emerald-200',
                ]"
              >
                Aktif
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-500">Progres</span>
              <span class="text-sm font-medium">65% selesai</span>
            </div>

            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-amber-400 h-2.5 rounded-full"
                style="width: 65%"
              ></div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">Tanggal Mulai</span>
                <span class="font-medium">12/08/2022</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">Tanggal Berakhir</span>
                <span class="font-medium">15/02/2023</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">Jam Selesai</span>
                <span class="font-medium">320 / 500</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">Pembimbing</span>
                <span class="font-medium">Budi Santoso</span>
              </div>
            </div>
          </CardContent>
          <CardFooter class="flex justify-between border-t pt-4">
            <span class="text-xs text-gray-500"
              >Terakhir diperbarui: 12/12/2022</span
            >
            <Button
              variant="ghost"
              size="sm"
              class="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            >
              Lihat Detail
            </Button>
          </CardFooter>
        </Card>

        <!-- Industry Information -->
        <Card class="col-span-1 md:row-span-2">
          <CardHeader class="border-b">
            <CardTitle class="font-semibold text-2xl">Industri</CardTitle>
            <CardDescription> Informasi Perusahaan </CardDescription>
          </CardHeader>
          <CardContent class="flex-1 p-6 bg-white">
            <div
              v-for="industry in internship"
              :key="industry.id"
              class="space-y-4 text-sm"
            >
              <div class="flex flex-col">
                <span class="text-sm mb-1">Nama:</span>
                <span class="text-gray-600">{{ industry.name }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm mb-1">Bidang Usaha:</span>
                <span class="text-gray-600">{{ industry.business_field }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm mb-1">Alamat:</span>
                <span class="text-gray-600">
                  {{ industry.address }}
                </span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm mb-1">Informasi Kontak:</span>
                <span class="text-gray-600">{{ industry.phone }}</span>
                <span class="text-gray-600">{{ industry.email }}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter class="border-t justify-end">
            <Button class="bg-amber-400 hover:bg-amber-500">
              Lihat Detail Lainnya
            </Button>
          </CardFooter>
        </Card>

        <!-- Student Details -->
        <Card class="col-span-1 md:col-span-2">
          <CardHeader class="border-b">
            <CardTitle class="font-semibold text-2xl">Detail Siswa</CardTitle>
            <CardDescription>Informasi Siswa</CardDescription>
          </CardHeader>
          <CardContent
            class="grid grid-cols-1 flex-1 sm:grid-cols-2 gap-4 p-6 bg-white"
          >
            <div class="flex flex-col">
              <span class="text-sm mb-1">Nama Siswa</span>
              <span class="text-gray-600">Budi Santoso</span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm mb-1">NIS</span>
              <span class="text-gray-600">1234567890</span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm mb-1">Email</span>
              <span class="text-gray-600">1234567890</span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm mb-1">Telepon</span>
              <span class="text-gray-600">1234567890</span>
            </div>
          </CardContent>
          <CardFooter class="justify-end p-4">
            <Button class="bg-amber-400 hover:bg-amber-500">
              Lihat Semua
            </Button>
          </CardFooter>
        </Card>

        <!-- Teacher Details -->
        <Card class="col-span-1 md:col-span-1">
          <CardHeader class="border-b">
            <CardTitle class="font-semibold text-2xl">Detail Guru</CardTitle>
            <CardDescription>Informasi Guru</CardDescription>
          </CardHeader>
          <CardContent class="p-4 flex-1">
            <div v-for="teacher in teachers" :key="teacher" class="grid gap-4">
              <div
                class="flex items-center justify-between border border-amber-100 rounded-xl p-4 bg-white hover:bg-amber-50 transition-colors shadow-sm hover:shadow"
              >
                <div class="ml-4">
                  <h3 class="font-semibold text-lg">Budi</h3>
                </div>
                <div class="flex flex-col items-end">
                  <div class="flex items-center mb-1">
                    <span class="mr-2 text-sm">NIP:</span>
                    <span
                      class="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded"
                      >123456789</span
                    >
                  </div>
                  <div class="flex items-center mb-1">
                    <span class="mr-2 text-sm">Email:</span>
                    <span
                      class="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded"
                      >123456789</span
                    >
                  </div>
                  <div class="flex items-center">
                    <span class="mr-2 text-sm">Telepon:</span>
                    <span
                      class="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded"
                      >123456789</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter class="justify-end">
            <Button variant="ghost"> Hubungi Guru </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </RoleGuard>
</template>
