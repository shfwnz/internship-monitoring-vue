import { createWebHistory, createRouter } from 'vue-router';

// Layout
import AppLayout from '@/components/layouts/AppLayout.vue';
import BaseLayout from '@/components/layouts/BaseLayout.vue';

// Auth
import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';

// Views
import Home from '@/views/Home.vue';
import StudentDashboard from '@/views/dashboard/StudentDashboard.vue';
import TeacherDashboard from '@/views/dashboard/TeacherDashboard.vue';
import AdminDashboard from '@/views/dashboard/AdminDashboard.vue';
import Industry from '@/views/Industry.vue';
import Profile from '@/views/Profile.vue';

const routes = [
  {
    path: '/',
    component: BaseLayout,
    children: [
      { path: '', name: 'home', component: Home },
      { path: 'login', name: 'login', component: Login },
      { path: 'register', name: 'register', component: Register },
    ],
  },
  {
    path: '/app',
    component: AppLayout,
    children: [
      { path: 'student', name: 'student', component: StudentDashboard },
      { path: 'teacher', name: 'teacher', component: TeacherDashboard },
      { path: 'admin', name: 'admin', component: AdminDashboard },
      { path: 'industry', name: 'industry', component: Industry },
      { path: 'profile', name: 'profile', component: Profile },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
