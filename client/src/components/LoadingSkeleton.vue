<template>
  <div>
    <!-- Card Skeleton -->
    <div v-if="type === 'card'" class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-pulse">
      <div class="p-4 bg-gray-100">
        <div class="h-48 bg-gray-200 rounded"></div>
      </div>
      <div class="p-4 space-y-3">
        <div class="h-5 bg-gray-200 rounded-full w-20"></div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div class="h-3 bg-gray-200 rounded w-32"></div>
        <div class="flex justify-between pt-3 border-t border-gray-100">
          <div class="h-8 bg-gray-200 rounded w-20"></div>
          <div class="h-8 bg-gray-200 rounded w-20"></div>
          <div class="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>

    <!-- Text Skeleton -->
    <div v-else-if="type === 'text'" class="animate-pulse space-y-2">
      <div class="h-4 bg-gray-200 rounded w-full"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      <div class="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>

    <!-- Circle Skeleton -->
    <div v-else-if="type === 'circle'" class="animate-pulse flex justify-center">
      <div class="h-20 w-20 bg-gray-200 rounded-full"></div>
    </div>

    <!-- Chart Skeleton -->
    <div v-else-if="type === 'chart'" class="animate-pulse">
      <div class="h-6 bg-gray-200 rounded w-48 mb-4"></div>
      <div class="h-64 bg-gray-200 rounded"></div>
    </div>

    <!-- Stats Card Skeleton -->
    <div v-else-if="type === 'stats'" class="card p-6 animate-pulse">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div class="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div class="h-8 bg-gray-200 rounded w-24 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-32"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'card',
    validator: (value) => ['card', 'text', 'circle', 'chart', 'stats'].includes(value)
  }
});
</script>