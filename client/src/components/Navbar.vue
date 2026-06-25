<template>
  <nav class="bg-white shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform transition-transform duration-200 hover:scale-110">
              <!-- QR Code Logo -->
              <svg class="w-6 h-6" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Top-left finder pattern -->
                <rect x="1" y="1" width="10" height="10" rx="1.5" fill="white"/>
                <rect x="2.5" y="2.5" width="7" height="7" rx="0.5" fill="#2563EB"/>
                <rect x="4" y="4" width="4" height="4" rx="0.3" fill="white"/>
                <!-- Top-right finder pattern -->
                <rect x="15" y="1" width="10" height="10" rx="1.5" fill="white"/>
                <rect x="16.5" y="2.5" width="7" height="7" rx="0.5" fill="#2563EB"/>
                <rect x="18" y="4" width="4" height="4" rx="0.3" fill="white"/>
                <!-- Bottom-left finder pattern -->
                <rect x="1" y="15" width="10" height="10" rx="1.5" fill="white"/>
                <rect x="2.5" y="16.5" width="7" height="7" rx="0.5" fill="#2563EB"/>
                <rect x="4" y="18" width="4" height="4" rx="0.3" fill="white"/>
                <!-- Timing + data dots -->
                <rect x="12" y="4" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="4" y="12" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="8" y="12" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="12" y="12" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="16" y="12" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="20" y="12" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="24" y="12" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="12" y="8" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="16" y="16" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="20" y="16" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="20" y="20" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="16" y="20" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="20" y="24" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="24" y="20" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="24" y="24" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="12" y="16" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="12" y="20" width="2" height="2" rx="0.3" fill="white"/>
                <rect x="12" y="24" width="2" height="2" rx="0.3" fill="white"/>
              </svg>
            </div>
            <div>
              <span class="text-xl font-bold text-gray-800">QR Generator</span>
            </div>
          </router-link>
        </div>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link 
            v-for="link in navLinks" 
            :key="link.path"
            :to="link.path"
            class="relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group"
            :class="isActive(link.path) ? 
              'bg-primary-50 text-primary-700' : 
              'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          >
            <span class="flex items-center space-x-1">
              <component :is="link.icon" class="w-4 h-4" />
              <span>{{ link.name }}</span>
            </span>
            <!-- Active indicator -->
            <span 
              v-if="isActive(link.path)"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
            />
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 
                   hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 
                   focus:ring-inset focus:ring-primary-500 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <!-- Hamburger icon -->
            <svg 
              v-if="!isMobileMenuOpen"
              class="h-6 w-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <!-- Close icon -->
            <svg 
              v-else
              class="h-6 w-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <Transition name="slide-down">
      <div 
        v-if="isMobileMenuOpen"
        class="md:hidden border-t border-gray-200 bg-white"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link 
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            @click="isMobileMenuOpen = false"
            class="block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
            :class="isActive(link.path) ? 
              'bg-primary-50 text-primary-700 border-l-4 border-primary-600' : 
              'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'"
          >
            <span class="flex items-center space-x-3">
              <component :is="link.icon" class="w-5 h-5" />
              <span>{{ link.name }}</span>
            </span>
          </router-link>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, h } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMobileMenuOpen = ref(false)

// SVG icon components using render functions
const DashboardIcon = {
  render() {
    return h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
      innerHTML: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>'
    })
  }
}

const QRIcon = {
  render() {
    return h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
      innerHTML: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2m4 0h-2m4-6V7m-4-4v1m6 11h2m-6 0h-2m-2 0h-2m4 0h2m-2-6v6m-4-4v1"/>'
    })
  }
}

const HistoryIcon = {
  render() {
    return h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
      innerHTML: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    })
  }
}

const StatsIcon = {
  render() {
    return h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
      innerHTML: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>'
    })
  }
}

// Navigation links configuration
const navLinks = [
  { name: 'Dashboard', path: '/' },
  { name: 'Generate', path: '/generate' },
  { name: 'History', path: '/history' },
]

// Check if a route is currently active
const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>