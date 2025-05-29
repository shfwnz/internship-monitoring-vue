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
import Industry from '@/views/Industry.vue';
import Profile from '@/views/Profile.vue';
import Unauthorized from '@/views/Unauthorized.vue';

const routes = [
  {
    path: '/',
    component: BaseLayout,
    children: [
      { path: '', name: 'home', component: Home },
      { path: 'login', name: 'login', component: Login },
      { path: 'register', name: 'register', component: Register },
      { path: 'unauthorized', name: 'unauthorized', component: Unauthorized },
    ],
  },
  {
    path: '/app',
    component: AppLayout,
    children: [
      {
        path: 'student',
        name: 'student',
        component: StudentDashboard,
        meta: { requiresAuth: true, allowedRoles: ['student'] },
      },
      {
        path: 'teacher',
        name: 'teacher',
        component: TeacherDashboard,
        meta: { requiresAuth: true, allowedRoles: ['teacher'] },
      },
      {
        path: 'industry',
        name: 'industry',
        component: Industry,
        meta: { requiresAuth: true },
      },
      { path: 'profile', name: 'profile', component: Profile },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // if user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login');
  }

  // if user is authenticated
  if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    return next(userRole === 'student' ? 'app/student' : 'app/teacher');
  }

  // role guard
  if (to.meta.allowedRoles) {
    if (!to.meta.allowedRoles.includes(userRole)) {
      // Redirect ke halaman sesuai role atau tampilkan 403
      return next(userRole === 'student' ? 'app/student' : 'app/teacher');
    }
  }

  next();
});

export default router;
