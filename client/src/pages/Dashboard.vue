<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-600">Overview and analytics of your QR codes</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading">
      <!-- Stats Cards Skeleton -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div v-for="i in 5" :key="i" class="card p-6 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-20 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded w-16 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-12 text-center">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="fetchAllData" class="btn-primary">Try Again</button>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Stats Cards Row -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard
          v-for="(stat, index) in statCards"
          :key="index"
          :title="stat.title"
          :value="stat.value"
          :bg-color="stat.color"
          :loading="false"
        >
          <template #icon>
            <svg class="w-6 h-6" :class="stat.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon"/>
            </svg>
          </template>
        </StatsCard>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Daily QR Codes Chart -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">QR Codes Generated Per Day</h2>
          <div class="relative" style="height: 300px;">
            <canvas ref="dailyChartRef"></canvas>
          </div>
          <p v-if="dailyStats.length === 0" class="text-center text-gray-500 mt-4">No data available yet</p>
        </div>

        <!-- Type Distribution Chart -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">QR Code Types Distribution</h2>
          <div class="relative" style="height: 300px;">
            <canvas ref="typeChartRef"></canvas>
          </div>
          <p v-if="typeDistribution.length === 0" class="text-center text-gray-500 mt-4">No data available yet</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <router-link 
            to="/generate"
            class="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg 
                   hover:bg-blue-100 transition-all duration-200 hover:scale-105"
          >
            <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Generate New QR</h3>
              <p class="text-sm text-gray-600">Create a new QR code</p>
            </div>
          </router-link>

          <router-link 
            to="/history"
            class="flex items-center space-x-3 p-4 bg-green-50 rounded-lg 
                   hover:bg-green-100 transition-all duration-200 hover:scale-105"
          >
            <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">View History</h3>
              <p class="text-sm text-gray-600">Browse all QR codes</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <Toast v-model="toast.visible" :message="toast.message" :type="toast.type" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import { qrService } from '../services/qrService';
import StatsCard from '../components/StatsCard.vue';
import Toast from '../components/Toast.vue';

Chart.register(...registerables);

const loading = ref(true);
const error = ref(null);
const stats = ref({});
const dailyStats = ref([]);
const typeDistribution = ref([]);

const dailyChartRef = ref(null);
const typeChartRef = ref(null);
let dailyChart = null;
let typeChart = null;

const toast = ref({ visible: false, message: '', type: 'info' });

const statCards = computed(() => [
  {
    title: 'Total QR Codes',
    value: stats.value.totalQRs || 0,
    color: 'blue',
    iconColor: 'text-blue-700',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    title: 'Today',
    value: stats.value.todayQRs || 0,
    color: 'green',
    iconColor: 'text-green-700',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
  },
  {
    title: 'URL',
    value: stats.value.urlQRs || 0,
    color: 'indigo',
    iconColor: 'text-indigo-700',
    icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101'
  },
  {
    title: 'Email',
    value: stats.value.emailQRs || 0,
    color: 'yellow',
    iconColor: 'text-yellow-700',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5'
  },
  {
    title: 'WiFi',
    value: stats.value.wifiQRs || 0,
    color: 'purple',
    iconColor: 'text-purple-700',
    icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01'
  }
]);

const createDailyChart = async () => {
  await nextTick();
  if (!dailyChartRef.value) return;
  if (dailyChart) dailyChart.destroy();

  const ctx = dailyChartRef.value.getContext('2d');
  const labels = dailyStats.value.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  const data = dailyStats.value.map(item => item.count);

  dailyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'QR Codes Generated',
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
        x: { grid: { display: false } }
      }
    }
  });
};

const createTypeChart = async () => {
  await nextTick();
  if (!typeChartRef.value) return;
  if (typeChart) typeChart.destroy();

  const ctx = typeChartRef.value.getContext('2d');
  const typeColors = {
    'URL': 'rgba(59, 130, 246, 0.8)',
    'Plain Text': 'rgba(107, 114, 128, 0.8)',
    'Email': 'rgba(16, 185, 129, 0.8)',
    'Phone Number': 'rgba(245, 158, 11, 0.8)',
    'WiFi': 'rgba(139, 92, 246, 0.8)'
  };

  const labels = typeDistribution.value.map(item => item.type);
  const data = typeDistribution.value.map(item => item.count);
  const backgroundColor = typeDistribution.value.map(item => typeColors[item.type] || 'rgba(156, 163, 175, 0.8)');

  typeChart = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
};

const fetchAllData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const [statsRes, dailyRes, typeRes] = await Promise.all([
      qrService.getStats(),
      qrService.getDailyStats(),
      qrService.getTypeDistribution()
    ]);

    stats.value = statsRes.data;
    dailyStats.value = dailyRes.data;
    typeDistribution.value = typeRes.data;

    await createDailyChart();
    await createTypeChart();
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load data';
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchAllData());

onUnmounted(() => {
  if (dailyChart) dailyChart.destroy();
  if (typeChart) typeChart.destroy();
});
</script>