<script setup>
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
        <CardContent> Card Content </CardContent>
        <CardFooter> Card Footer </CardFooter>
      </Card>
    </div>
  </RoleGuard>
</template>
