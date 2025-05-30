<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  FileText,
  Users,
  BookOpen,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Shield,
  Clock,
  BarChart3,
  UserCheck,
  Building2,
  GraduationCap,
  ChevronDown,
} from 'lucide-vue-next';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const router = useRouter();

// Animation states
const isVisible = ref(false);

// Stats data
const stats = ref([
  { label: 'Active Students', value: '500+', icon: Users },
  { label: 'Partner Industries', value: '50+', icon: Building2 },
  { label: 'Supervising Teachers', value: '25+', icon: GraduationCap },
  { label: 'Success Rate', value: '95%', icon: TrendingUp },
]);

// Features data
const features = ref([
  {
    icon: FileText,
    title: 'Internship Registration',
    description:
      'Easy online registration system for students to submit their internship information and cover letters.',
    color: 'amber',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description:
      'Real-time monitoring of internship progress with visual indicators and completion percentages.',
    color: 'blue',
  },
  {
    icon: UserCheck,
    title: 'Teacher Supervision',
    description:
      'Dedicated teacher assignment for guidance and monitoring throughout the internship period.',
    color: 'green',
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description:
      'Role-based access control ensuring data security and appropriate user permissions.',
    color: 'purple',
  },
]);

// How it works steps
const steps = ref([
  {
    step: '1',
    title: 'Student Registration',
    description:
      'Students register their internship details including industry, dates, and cover letter.',
    icon: FileText,
  },
  {
    step: '2',
    title: 'Teacher Assignment',
    description:
      'System automatically assigns supervising teachers for guidance and monitoring.',
    icon: UserCheck,
  },
  {
    step: '3',
    title: 'Progress Monitoring',
    description:
      'Real-time tracking of internship progress with regular updates and feedback.',
    icon: BarChart3,
  },
  {
    step: '4',
    title: 'Completion & Evaluation',
    description:
      'Final evaluation and certification upon successful internship completion.',
    icon: CheckCircle,
  },
]);

// Navigation functions
const navigateToLogin = () => {
  router.push('/login');
};

const navigateToRegister = () => {
  router.push('/register');
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Lifecycle
onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"
  >
    <!-- Navigation -->
    <nav
      class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-200"
    >
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg"
            >
              <GraduationCap class="w-6 h-6 text-white" />
            </div>
            <div class="flex flex-col">
              <h1 class="text-xl font-bold text-gray-800">InternshipTracker</h1>
              <p class="text-xs text-gray-600">Monitoring System</p>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <button
              @click="scrollToSection('features')"
              class="text-gray-600 hover:text-amber-600 font-medium transition-colors"
            >
              Features
            </button>
            <button
              @click="scrollToSection('how-it-works')"
              class="text-gray-600 hover:text-amber-600 font-medium transition-colors"
            >
              How It Works
            </button>
            <button
              @click="scrollToSection('stats')"
              class="text-gray-600 hover:text-amber-600 font-medium transition-colors"
            >
              Statistics
            </button>
          </div>

          <!-- Auth Buttons -->
          <div class="flex items-center space-x-3">
            <Button
              variant="ghost"
              @click="navigateToLogin"
              class="text-gray-600 hover:text-amber-600"
            >
              Login
            </Button>
            <Button
              @click="navigateToRegister"
              class="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative py-20 overflow-hidden">
      <!-- Background Elements -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10"
      ></div>
      <div
        class="absolute top-20 left-20 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 right-20 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"
      ></div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <!-- Left Content -->
          <div class="space-y-8" :class="{ 'animate-fade-in-up': isVisible }">
            <div class="space-y-6">
              <Badge
                class="bg-amber-100 text-amber-800 border border-amber-200 px-4 py-2"
              >
                🎓 Student Internship Management
              </Badge>

              <h1
                class="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Track Your
                <span
                  class="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500"
                >
                  Internship
                </span>
                Journey
              </h1>

              <p class="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Comprehensive internship monitoring system that connects
                students, teachers, and industries. Monitor progress, track
                completion, and ensure successful internship experiences.
              </p>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4">
              <Button
                @click="navigateToRegister"
                size="lg"
                class="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                Start Monitoring
                <ArrowRight class="ml-2 w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                @click="scrollToSection('features')"
                class="border-2 border-amber-300 text-amber-700 hover:bg-amber-50 px-8 py-4 text-lg font-semibold"
              >
                <Play class="mr-2 w-5 h-5" />
                Learn More
              </Button>
            </div>

            <!-- Trust Indicators -->
            <div class="flex items-center space-x-6 pt-8">
              <div class="flex items-center space-x-2">
                <div class="flex">
                  <Star class="w-5 h-5 text-amber-400 fill-current" />
                  <Star class="w-5 h-5 text-amber-400 fill-current" />
                  <Star class="w-5 h-5 text-amber-400 fill-current" />
                  <Star class="w-5 h-5 text-amber-400 fill-current" />
                  <Star class="w-5 h-5 text-amber-400 fill-current" />
                </div>
                <span class="text-sm text-gray-600"
                  >Trusted by 500+ students</span
                >
              </div>
            </div>
          </div>

          <!-- Right Content - Interactive Dashboard Preview -->
          <div class="relative" :class="{ 'animate-fade-in-right': isVisible }">
            <div class="relative z-10">
              <!-- Mock Dashboard Card -->
              <Card
                class="transform rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl border-0 bg-white/90 backdrop-blur"
              >
                <CardHeader>
                  <div class="flex justify-between items-center">
                    <div>
                      <CardTitle class="text-xl">Internship Progress</CardTitle>
                      <CardDescription
                        >Current status and completion</CardDescription
                      >
                    </div>
                    <Badge
                      class="bg-emerald-100 text-emerald-800 border border-emerald-200"
                    >
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent class="space-y-6">
                  <!-- Progress Bar -->
                  <div>
                    <div class="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>75% completed</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                      <div
                        class="bg-gradient-to-r from-amber-400 to-orange-400 h-3 rounded-full transition-all duration-1000 ease-out"
                        style="width: 75%"
                      ></div>
                    </div>
                  </div>

                  <!-- Info Grid -->
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                      <p class="text-xs text-gray-500">Industry</p>
                      <p class="font-medium">Tech Solutions Inc.</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-xs text-gray-500">Duration</p>
                      <p class="font-medium">3 months</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-xs text-gray-500">Teacher</p>
                      <p class="font-medium">Mrs. Johnson</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-xs text-gray-500">Status</p>
                      <p class="font-medium text-emerald-600">On Track</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Floating Elements -->
              <div
                class="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-bounce"
              >
                <CheckCircle class="w-10 h-10 text-white" />
              </div>

              <div
                class="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse"
              >
                <BarChart3 class="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div
        class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <button
          @click="scrollToSection('stats')"
          class="text-amber-600 hover:text-amber-700"
        >
          <ChevronDown class="w-8 h-8" />
        </button>
      </div>
    </section>

    <!-- Stats Section -->
    <section id="stats" class="py-20 bg-white/50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Educational Institutions
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform has successfully managed thousands of internship
            programs
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(stat, index) in stats"
            :key="index"
            class="text-center group hover:transform hover:scale-105 transition-all duration-300"
          >
            <div
              class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl"
            >
              <component :is="stat.icon" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-3xl font-bold text-gray-900 mb-2">
              {{ stat.value }}
            </h3>
            <p class="text-gray-600 font-medium">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <Badge
            class="bg-amber-100 text-amber-800 border border-amber-200 mb-4"
          >
            ✨ Features
          </Badge>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Internship Management
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools designed to streamline the entire internship
            process from registration to completion
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="(feature, index) in features" :key="index" class="group">
            <Card
              class="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur group-hover:transform group-hover:scale-105"
            >
              <CardHeader class="pb-4">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  :class="{
                    'bg-amber-100': feature.color === 'amber',
                    'bg-blue-100': feature.color === 'blue',
                    'bg-green-100': feature.color === 'green',
                    'bg-purple-100': feature.color === 'purple',
                  }"
                >
                  <component
                    :is="feature.icon"
                    class="w-6 h-6"
                    :class="{
                      'text-amber-600': feature.color === 'amber',
                      'text-blue-600': feature.color === 'blue',
                      'text-green-600': feature.color === 'green',
                      'text-purple-600': feature.color === 'purple',
                    }"
                  />
                </div>
                <CardTitle class="text-xl font-semibold text-gray-900">
                  {{ feature.title }}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-gray-600 leading-relaxed">
                  {{ feature.description }}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section
      id="how-it-works"
      class="py-20 bg-gradient-to-br from-amber-50 to-orange-50"
    >
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <Badge
            class="bg-amber-100 text-amber-800 border border-amber-200 mb-4"
          >
            🚀 Process
          </Badge>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple four-step process to manage your internship journey
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="relative text-center group"
          >
            <!-- Connection Line -->
            <div
              v-if="index < steps.length - 1"
              class="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-amber-300 to-orange-300 z-0"
            ></div>

            <!-- Step Card -->
            <div class="relative z-10">
              <div
                class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300"
              >
                <component :is="step.icon" class="w-10 h-10 text-white" />
              </div>

              <div
                class="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
              >
                <div
                  class="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4"
                >
                  {{ step.step }}
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">
                  {{ step.title }}
                </h3>
                <p class="text-gray-600 text-sm leading-relaxed">
                  {{ step.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      class="py-20 bg-gradient-to-r from-amber-500 to-orange-500 relative overflow-hidden"
    >
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="absolute top-0 left-0 w-full h-full opacity-10">
        <div
          class="absolute top-20 left-20 w-32 h-32 border border-white/30 rounded-full"
        ></div>
        <div
          class="absolute bottom-20 right-20 w-48 h-48 border border-white/20 rounded-full"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/10 rounded-full"
        ></div>
      </div>

      <div class="container mx-auto px-4 text-center relative z-10">
        <div class="max-w-4xl mx-auto space-y-8">
          <h2 class="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Ready to Transform Your Internship Experience?
          </h2>
          <p class="text-xl text-amber-100 max-w-2xl mx-auto">
            Join hundreds of students and teachers already using our platform to
            manage successful internship programs.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              @click="navigateToRegister"
              size="lg"
              class="bg-white text-amber-600 hover:bg-amber-50 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Get Started Now
              <ArrowRight class="ml-2 w-5 h-5" />
            </Button>

            <Button
              @click="navigateToLogin"
              variant="outline"
              size="lg"
              class="border-2 border-white text-white hover:bg-white hover:text-amber-600 px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center"
              >
                <GraduationCap class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="font-bold text-lg">InternshipTracker</h3>
                <p class="text-sm text-gray-400">Monitoring System</p>
              </div>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed">
              Empowering students and educators with comprehensive internship
              management solutions.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2 text-sm">
              <li>
                <button
                  @click="scrollToSection('features')"
                  class="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  @click="scrollToSection('how-it-works')"
                  class="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  @click="scrollToSection('stats')"
                  class="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  Statistics
                </button>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="font-semibold mb-4">Support</h4>
            <ul class="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  class="text-gray-400 hover:text-amber-400 transition-colors"
                  >Help Center</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-gray-400 hover:text-amber-400 transition-colors"
                  >Contact Us</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-gray-400 hover:text-amber-400 transition-colors"
                  >Documentation</a
                >
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="font-semibold mb-4">Contact</h4>
            <div class="space-y-2 text-sm text-gray-400">
              <p>📧 support@internshiptracker.com</p>
              <p>📞 +62 123 456 7890</p>
              <p>📍 Jakarta, Indonesia</p>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-12 pt-8 text-center">
          <p class="text-gray-400 text-sm">
            © 2024 InternshipTracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
}

.animate-fade-in-right {
  animation: fade-in-right 0.8s ease-out 0.2s both;
}
</style>
