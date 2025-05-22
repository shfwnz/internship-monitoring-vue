<script setup>
import { Input } from '@/components/ui/input';
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
</script>

<template>
  <RoleGuard :allowed-roles="['teacher']">
    <div class="container mx-auto py-2 flex flex-col min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle class="text-xl capitalize"
            >Student Internship monitoring</CardTitle
          >
          <CardDescription class="lowercase"
            >All student internship information</CardDescription
          >
        </CardHeader>
        <CardContent class="flex-1 flex flex-col justify-start">
          <Input class="max-w-sm my-2" placeholder="Find Student..." />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Industry Name</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead class="text-right"> Address </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="industry in paginatedIndustries"
                :key="industry.id || industry.name"
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
              <TableRow>
                <TableCell colspan="5" class="text-center py-4">
                  No industries found. Please try another search or add a new
                  industry.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter> Card Footer </CardFooter>
      </Card>
    </div>
  </RoleGuard>
</template>
