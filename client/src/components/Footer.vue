<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm text-gray-500">
            &copy; {{ currentYear }} QR Code Manager. All rights reserved.
          </p>
          <p class="text-sm text-gray-500 mt-2 md:mt-0">
            Made with ❤️ using Vue.js + Express.js
          </p>
        </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());

const quickLinks = [
  { name: 'Dashboard', path: '/' },
  { name: 'Generate QR', path: '/generate' },
  { name: 'History', path: '/history' },
  { name: 'Statistics', path: '/statistics' }
];
</script>