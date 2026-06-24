<template>
  <div class="animate-fade-in">

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 leading-tight">History</h1>
      </div>
      <div v-if="!loading && !error">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
          <span class="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
          <span class="text-sm font-semibold text-blue-700">{{ totalCount }} total</span>
        </div>
      </div>
    </div>

    <!-- Search + Filter Bar -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-3">
        <!-- Search -->
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input v-model="searchQuery" type="text" placeholder="Search by content or type..." class="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder-gray-400 transition-all" @input="onSearchInput" />
          <button v-if="searchQuery" @click="clearSearch"
            class="absolute inset-y-0 right-0 pr-3.5 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Divider -->
        <div class="hidden md:block w-px bg-gray-100"></div>

        <!-- Sort -->
        <div class="md:w-44">
          <div class="relative">
            <select v-model="sortBy" @change="onSortChange" class="w-full py-2.5 px-3 pr-10 text-sm rounded-lg border border-gray-200 bg-gray-50
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
             text-gray-700 transition-all appearance-none cursor-pointer">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="type">By Type</option>
            </select>
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="bg-white rounded-xl border border-gray-100 p-5 animate-pulse shadow-sm">
        <div class="flex items-start gap-4">
          <div class="w-16 h-16 bg-gray-100 rounded-lg shrink-0"></div>
          <div class="flex-1 space-y-2.5 pt-1">
            <div class="h-3 bg-gray-100 rounded w-16"></div>
            <div class="h-4 bg-gray-100 rounded w-3/4"></div>
            <div class="h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-50 flex gap-2">
          <div class="h-8 bg-gray-100 rounded-lg flex-1"></div>
          <div class="h-8 bg-gray-100 rounded-lg flex-1"></div>
          <div class="h-8 w-8 bg-gray-100 rounded-lg shrink-0"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
      <div class="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-base font-semibold text-gray-900 mb-1">Something went wrong</h3>
      <p class="text-sm text-gray-400 mb-5 max-w-xs mx-auto">{{ error }}</p>
      <button @click="fetchQRCodes"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Try again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="qrCodes.length === 0" class="bg-white rounded-xl border border-gray-100 shadow-sm p-14 text-center">
      <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-blue-400" viewBox="0 0 26 26" fill="none">
          <rect x="1" y="1" width="10" height="10" rx="1.5" fill="#93C5FD" />
          <rect x="2.5" y="2.5" width="7" height="7" rx="0.5" fill="#EFF6FF" />
          <rect x="4" y="4" width="4" height="4" rx="0.3" fill="#93C5FD" />
          <rect x="15" y="1" width="10" height="10" rx="1.5" fill="#93C5FD" />
          <rect x="16.5" y="2.5" width="7" height="7" rx="0.5" fill="#EFF6FF" />
          <rect x="18" y="4" width="4" height="4" rx="0.3" fill="#93C5FD" />
          <rect x="1" y="15" width="10" height="10" rx="1.5" fill="#93C5FD" />
          <rect x="2.5" y="16.5" width="7" height="7" rx="0.5" fill="#EFF6FF" />
          <rect x="4" y="18" width="4" height="4" rx="0.3" fill="#93C5FD" />
          <rect x="12" y="4" width="2" height="2" rx="0.3" fill="#93C5FD" />
          <rect x="4" y="12" width="2" height="2" rx="0.3" fill="#93C5FD" />
          <rect x="8" y="12" width="2" height="2" rx="0.3" fill="#93C5FD" />
          <rect x="12" y="12" width="2" height="2" rx="0.3" fill="#93C5FD" />
          <rect x="16" y="12" width="2" height="2" rx="0.3" fill="#93C5FD" />
          <rect x="20" y="12" width="2" height="2" rx="0.3" fill="#93C5FD" />
          <rect x="12" y="16" width="2" height="2" rx="0.3" fill="#93C5FD" />
          <rect x="16" y="16" width="2" height="2" rx="0.3" fill="#93C5FD" />
          <rect x="20" y="20" width="2" height="2" rx="0.3" fill="#93C5FD" />
          <rect x="16" y="20" width="2" height="2" rx="0.3" fill="#93C5FD" />
          <rect x="12" y="20" width="2" height="2" rx="0.3" fill="#93C5FD" />
          <rect x="12" y="24" width="2" height="2" rx="0.3" fill="#93C5FD" />
          <rect x="20" y="24" width="2" height="2" rx="0.3" fill="#93C5FD" />
        </svg>
      </div>
      <h3 class="text-base font-semibold text-gray-900 mb-1">
        {{ searchQuery ? 'No results found' : 'No QR codes yet' }}
      </h3>
      <p class="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
        {{ searchQuery
          ? 'Try different keywords or clear the search filter.'
          : 'Generate your first QR code and it will appear here.'
        }}
      </p>
      <div class="flex justify-center gap-3">
        <button v-if="searchQuery" @click="clearSearch"
          class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          Clear search
        </button>
        <router-link to="/generate"
          class="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Generate QR code
        </router-link>
      </div>
    </div>

    <!-- QR Codes Grid -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <QRCard v-for="qrCode in qrCodes" :key="qrCode._id" :qrCode="qrCode" @download="downloadQR" @view="viewDetails"
          @delete="confirmDelete" />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8">
        <Pagination :current-page="currentPage" :total-pages="totalPages" :total-items="totalCount"
          @page-change="onPageChange" />
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmDialog v-model="showDeleteDialog" title="Delete QR Code"
      message="Are you sure you want to delete this QR code? This action cannot be undone." confirm-text="Delete"
      cancel-text="Cancel" @confirm="deleteQR" @cancel="showDeleteDialog = false" />

    <!-- Toast -->
    <Toast v-model="toast.visible" :message="toast.message" :type="toast.type" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { qrService } from '../services/qrService';
import QRCard from '../components/QRCard.vue';
import LoadingSkeleton from '../components/LoadingSkeleton.vue';
import Pagination from '../components/Pagination.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import Toast from '../components/Toast.vue';

const router = useRouter();

const qrCodes = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const sortBy = ref('newest');
const currentPage = ref(1);
const totalPages = ref(0);
const totalCount = ref(0);
const itemsPerPage = 10;

const showDeleteDialog = ref(false);
const deleteId = ref(null);

const toast = ref({ visible: false, message: '', type: 'info' });

let debounceTimer = null;

const showToast = (message, type = 'info') => {
  toast.value.message = message;
  toast.value.type = type;
  toast.value.visible = true;
};

const fetchQRCodes = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = {
      page: currentPage.value,
      limit: itemsPerPage,
      sort: sortBy.value
    };
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim();

    const response = await qrService.getAllQRCodes(params);
    qrCodes.value = response.data;
    totalPages.value = response.totalPages;
    totalCount.value = response.count;
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load QR codes';
  } finally {
    loading.value = false;
  }
};

const onSearchInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    currentPage.value = 1;
    fetchQRCodes();
  }, 300);
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
  fetchQRCodes();
};

const onSortChange = () => {
  currentPage.value = 1;
  fetchQRCodes();
};

const onPageChange = (page) => {
  currentPage.value = page;
  fetchQRCodes();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const downloadQR = (qrCode) => {
  try {
    const link = document.createElement('a');
    link.href = qrCode.qrImage;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sanitizedType = qrCode.qrType.toLowerCase().replace(/\s+/g, '-');
    link.download = `qr-code-${sanitizedType}-${timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('QR code downloaded!', 'success');
  } catch {
    showToast('Failed to download QR code', 'error');
  }
};

const viewDetails = (id) => router.push(`/history/${id}`);

const confirmDelete = (id) => {
  deleteId.value = id;
  showDeleteDialog.value = true;
};

const deleteQR = async () => {
  if (!deleteId.value) return;
  try {
    await qrService.deleteQRCode(deleteId.value);
    showToast('QR code deleted', 'success');
    qrCodes.value = qrCodes.value.filter(c => c._id !== deleteId.value);
    if (qrCodes.value.length === 0 && currentPage.value > 1) currentPage.value--;
    fetchQRCodes();
  } catch (err) {
    showToast(err.response?.data?.message || 'Failed to delete QR code', 'error');
  } finally {
    deleteId.value = null;
    showDeleteDialog.value = false;
  }
};

watch(
  () => router.currentRoute.value.query,
  (newQuery) => {
    if (newQuery.search) {
      searchQuery.value = newQuery.search;
      fetchQRCodes();
    }
  }
);

onMounted(() => fetchQRCodes());
onUnmounted(() => { if (debounceTimer) clearTimeout(debounceTimer); });
</script>