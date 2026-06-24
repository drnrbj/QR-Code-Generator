<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Generate QR Code</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- Form Section (60%) -->
      <div class="lg:col-span-3">
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">QR Code Settings</h2>

          <form @submit.prevent="generateQR" class="space-y-6">
            <!-- QR Type & Size Row (Top) -->
            <div class="grid grid-cols-2 gap-4">
              <!-- QR Type Dropdown -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  QR Type <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <select v-model="form.qrType" class="input-field h-10 w-full appearance-none pr-10"
                    @change="onTypeChange">
                    <option value="URL">URL</option>
                    <option value="Plain Text">Plain Text</option>
                    <option value="Email">Email</option>
                    <option value="Phone Number">Phone Number</option>
                    <option value="WiFi">WiFi</option>
                  </select>
                  <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <!-- QR Size -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  QR Size
                </label>
                <div class="relative">
                  <select v-model="form.size" class="input-field h-10 w-full appearance-none pr-10">
                    <option :value="200">200 x 200</option>
                    <option :value="300">300 x 300</option>
                    <option :value="400">400 x 400</option>
                    <option :value="500">500 x 500</option>
                  </select>
                  <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- QR Content Input (hidden for WiFi) -->
            <div v-if="form.qrType !== 'WiFi'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                QR Content <span class="text-red-500">*</span>
              </label>
              <div class="relative flex items-center">
                <input v-model="form.content" type="text" :placeholder="contentPlaceholder"
                  class="input-field pr-16 w-full"
                  :class="{ 'border-red-500 focus:ring-red-500': validationErrors.content }" required
                  @input="clearValidationError('content')" />
                <span class="absolute right-3 text-xs text-gray-400">
                  {{ form.content.length }} chars
                </span>
              </div>
              <p v-if="validationErrors.content" class="mt-1 text-sm text-red-600">
                {{ validationErrors.content }}
              </p>
            </div>

            <!-- WiFi Fields (Conditional) -->
            <div v-if="form.qrType === 'WiFi'" class="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 class="font-semibold text-gray-900">WiFi Configuration</h3>
              <p class="text-sm text-gray-500">The QR code will be generated from the WiFi details below.</p>

              <!-- SSID -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Network Name (SSID) <span class="text-red-500">*</span>
                </label>
                <input v-model="wifiConfig.ssid" type="text" placeholder="Enter WiFi network name" class="input-field"
                  :class="{ 'border-red-500': validationErrors.wifiSSID }" @input="clearValidationError('wifiSSID')" />
                <p v-if="validationErrors.wifiSSID" class="mt-1 text-sm text-red-600">
                  {{ validationErrors.wifiSSID }}
                </p>
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input v-model="wifiConfig.password" type="text" placeholder="Enter WiFi password"
                  class="input-field" />
              </div>

              <!-- Security Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Security Type
                </label>
                <div class="relative">
                  <select v-model="wifiConfig.security" class="input-field h-10 w-full appearance-none pr-10">
                    <option value="WPA2">WPA2</option>
                    <option value="WPA">WPA</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                  <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Colors Grid -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Foreground Color -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Foreground Color
                </label>
                <div class="flex items-center space-x-3">
                  <input v-model="form.foregroundColor" type="color"
                    class="w-12 h-10 rounded border border-gray-300 cursor-pointer" />
                  <span class="text-sm text-gray-600">{{ form.foregroundColor }}</span>
                </div>
              </div>

              <!-- Background Color -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div class="flex items-center space-x-3">
                  <input v-model="form.backgroundColor" type="color"
                    class="w-12 h-10 rounded border border-gray-300 cursor-pointer" />
                  <span class="text-sm text-gray-600">{{ form.backgroundColor }}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-200">
              <button type="submit" class="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg
           hover:bg-blue-700 transition-colors duration-200
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed" :disabled="generating">
                <svg v-if="generating" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{{ generating ? 'Generating...' : 'Generate QR' }}</span>
              </button>

              <button type="button" @click="saveQR" class="bg-blue-100 text-blue-700 px-6 py-2 rounded-lg
           hover:bg-blue-200 transition-colors duration-200
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!generatedQR || saving">
                {{ saving ? 'Saving...' : 'Save QR' }}
              </button>

              <button type="button" @click="downloadQR" class="bg-blue-100 text-blue-700 px-6 py-2 rounded-lg
           hover:bg-blue-200 transition-colors duration-200
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!generatedQR">
                Download
              </button>

              <button type="button" @click="clearForm" class="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg
           hover:bg-gray-200 transition-colors duration-200
           focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Preview Section (40%) -->
      <div class="lg:col-span-2">
        <div class="card p-6 sticky top-24">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Preview</h2>

          <!-- Generated QR Preview -->
          <div v-if="generatedQR" class="text-center">
            <div class="bg-gray-50 rounded-lg p-6 mb-4">
              <img :src="generatedQR" alt="Generated QR Code" class="mx-auto max-w-full h-auto"
                style="max-height: 300px;" />
            </div>

            <!-- QR Info -->
            <div class="space-y-2 text-left">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Type:</span>
                <span class="font-medium">{{ form.qrType }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Size:</span>
                <span class="font-medium">{{ form.size }}x{{ form.size }}</span>
              </div>
              <div v-if="form.qrType !== 'WiFi'" class="flex justify-between text-sm">
                <span class="text-gray-600">Content:</span>
                <span class="font-medium truncate ml-2 max-w-[200px]">
                  {{ form.content }}
                </span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="10" height="10" rx="1.5" fill="#9CA3AF" />
                <rect x="2.5" y="2.5" width="7" height="7" rx="0.5" fill="#F3F4F6" />
                <rect x="4" y="4" width="4" height="4" rx="0.3" fill="#9CA3AF" />
                <rect x="15" y="1" width="10" height="10" rx="1.5" fill="#9CA3AF" />
                <rect x="16.5" y="2.5" width="7" height="7" rx="0.5" fill="#F3F4F6" />
                <rect x="18" y="4" width="4" height="4" rx="0.3" fill="#9CA3AF" />
                <rect x="1" y="15" width="10" height="10" rx="1.5" fill="#9CA3AF" />
                <rect x="2.5" y="16.5" width="7" height="7" rx="0.5" fill="#F3F4F6" />
                <rect x="4" y="18" width="4" height="4" rx="0.3" fill="#9CA3AF" />
                <rect x="12" y="4" width="2" height="2" rx="0.3" fill="#9CA3AF" />
                <rect x="4" y="12" width="2" height="2" rx="0.3" fill="#9CA3AF" />
                <rect x="8" y="12" width="2" height="2" rx="0.3" fill="#9CA3AF" />
                <rect x="12" y="12" width="2" height="2" rx="0.3" fill="#9CA3AF" />
                <rect x="16" y="12" width="2" height="2" rx="0.3" fill="#9CA3AF" />
                <rect x="20" y="12" width="2" height="2" rx="0.3" fill="#9CA3AF" />
                <rect x="12" y="8" width="2" height="2" rx="0.3" fill="#9CA3AF" />
                <rect x="16" y="16" width="2" height="2" rx="0.3" fill="#9CA3AF" />
                <rect x="20" y="16" width="2" height="2" rx="0.3" fill="#9CA3AF" />
                <rect x="20" y="20" width="2" height="2" rx="0.3" fill="#9CA3AF" />
                <rect x="16" y="20" width="2" height="2" rx="0.3" fill="#9CA3AF" />
                <rect x="20" y="24" width="2" height="2" rx="0.3" fill="#9CA3AF" />
                <rect x="24" y="20" width="2" height="2" rx="0.3" fill="#9CA3AF" />
                <rect x="12" y="16" width="2" height="2" rx="0.3" fill="#9CA3AF" />
                <rect x="12" y="20" width="2" height="2" rx="0.3" fill="#9CA3AF" />
                <rect x="12" y="24" width="2" height="2" rx="0.3" fill="#9CA3AF" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No QR Code Yet</h3>
            <p class="text-gray-600 text-sm">
              Fill in the form and click "Generate QR" to see preview
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <Toast v-model="toast.visible" :message="toast.message" :type="toast.type" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { qrService } from '../services/qrService';
import Toast from '../components/Toast.vue';

// Form state
const form = reactive({
  content: '',
  qrType: 'URL',
  size: 300,
  foregroundColor: '#000000',
  backgroundColor: '#FFFFFF'
});

// WiFi configuration
const wifiConfig = reactive({
  ssid: '',
  password: '',
  security: 'WPA2'
});

// Generated QR state
const generatedQR = ref(null);
const generating = ref(false);
const saving = ref(false);
const validationErrors = reactive({});

// Toast notification state
const toast = reactive({
  visible: false,
  message: '',
  type: 'info'
});

/**
 * Dynamic placeholder based on QR type
 */
const contentPlaceholder = computed(() => {
  const placeholders = {
    'URL': 'Enter URL (e.g., https://example.com)',
    'Plain Text': 'Enter any text',
    'Email': 'Enter email address (e.g., user@example.com)',
    'Phone Number': 'Enter phone number (e.g., +1234567890)',
    'WiFi': 'Network name will be used from WiFi settings'
  };
  return placeholders[form.qrType] || 'Enter content';
});

/**
 * Watch for QR type changes
 */
const onTypeChange = () => {
  // Reset content when switching types
  form.content = '';
  
  // Reset WiFi fields when switching away from WiFi
  if (form.qrType !== 'WiFi') {
    wifiConfig.ssid = '';
    wifiConfig.password = '';
    wifiConfig.security = 'WPA2';
  }
  
  // Clear validation errors on type change
  Object.keys(validationErrors).forEach(key => delete validationErrors[key]);
};

/**
 * Clear specific validation error
 */
const clearValidationError = (field) => {
  if (validationErrors[field]) {
    delete validationErrors[field];
  }
};

/**
 * Show toast notification
 */
const showToast = (message, type = 'info') => {
  toast.message = message;
  toast.type = type;
  toast.visible = true;
};

/**
 * Validate form fields
 */
const validateForm = () => {
  // Clear previous errors
  Object.keys(validationErrors).forEach(key => delete validationErrors[key]);

  // Skip content validation for WiFi
  if (form.qrType !== 'WiFi') {
    if (!form.content.trim()) {
      validationErrors.content = 'Content is required';
      return false;
    }
  }

  // Validate WiFi fields
  if (form.qrType === 'WiFi') {
    if (!wifiConfig.ssid.trim()) {
      validationErrors.wifiSSID = 'WiFi SSID is required';
      return false;
    }
  }

  // Validate email format
  if (form.qrType === 'Email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.content)) {
      validationErrors.content = 'Please enter a valid email address';
      return false;
    }
  }

  return true;
};

/**
 * Generate QR Code
 */
const generateQR = async () => {
  if (!validateForm()) {
    showToast('Please fix the validation errors', 'error');
    return;
  }

  generating.value = true;

  try {
    const data = {
      content: form.qrType === 'WiFi' ? wifiConfig.ssid : form.content,
      qrType: form.qrType,
      size: form.size,
      foregroundColor: form.foregroundColor,
      backgroundColor: form.backgroundColor
    };

    if (form.qrType === 'WiFi') {
      data.wifiSSID = wifiConfig.ssid;
      data.wifiPassword = wifiConfig.password;
      data.wifiSecurity = wifiConfig.security;
    }

    const response = await qrService.generateQR(data);
    generatedQR.value = response.qrImage;
    showToast('QR code generated successfully!', 'success');

  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to generate QR code';
    showToast(errorMessage, 'error');
  } finally {
    generating.value = false;
  }
};

/**
 * Save QR Code to database
 */
const saveQR = async () => {
  if (!generatedQR.value) {
    showToast('Generate a QR code first', 'error');
    return;
  }

  saving.value = true;

  try {
    const data = {
      content: form.qrType === 'WiFi' ? wifiConfig.ssid : form.content,
      qrType: form.qrType,
      qrImage: generatedQR.value,
      size: form.size,
      foregroundColor: form.foregroundColor,
      backgroundColor: form.backgroundColor
    };

    await qrService.saveQR(data);
    showToast('QR code saved to database!', 'success');

  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to save QR code';
    showToast(errorMessage, 'error');
  } finally {
    saving.value = false;
  }
};

/**
 * Clear form and reset all fields
 */
const clearForm = () => {
  form.content = '';
  form.qrType = 'URL';
  form.size = 300;
  form.foregroundColor = '#000000';
  form.backgroundColor = '#FFFFFF';

  wifiConfig.ssid = '';
  wifiConfig.password = '';
  wifiConfig.security = 'WPA2';

  generatedQR.value = null;

  Object.keys(validationErrors).forEach(key => delete validationErrors[key]);

  showToast('Form cleared', 'info');
};

/**
 * Download generated QR code as PNG
 */
const downloadQR = () => {
  if (!generatedQR.value) {
    showToast('Generate a QR code first', 'error');
    return;
  }

  try {
    const link = document.createElement('a');
    link.href = generatedQR.value;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `qr-code-${timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('QR code downloaded!', 'success');
  } catch (error) {
    showToast('Failed to download QR code', 'error');
  }
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>