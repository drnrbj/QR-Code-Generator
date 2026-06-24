<template>
  <Teleport to="body">
    <Transition name="toast">
      <div 
        v-if="visible"
        class="fixed bottom-4 right-4 z-50 max-w-sm w-full"
      >
        <div 
          class="rounded-lg shadow-lg p-4 flex items-start space-x-3"
          :class="toastClasses"
          role="alert"
        >
          <!-- Icon -->
          <div class="flex-shrink-0">
            <!-- Success Icon -->
            <svg 
              v-if="type === 'success'"
              class="w-5 h-5 text-green-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clip-rule="evenodd"/>
            </svg>
            <!-- Error Icon -->
            <svg 
              v-if="type === 'error'"
              class="w-5 h-5 text-red-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                    clip-rule="evenodd"/>
            </svg>
            <!-- Info Icon -->
            <svg 
              v-if="type === 'info'"
              class="w-5 h-5 text-blue-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" 
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                    clip-rule="evenodd"/>
            </svg>
          </div>

          <!-- Message -->
          <div class="flex-1">
            <p class="text-sm font-medium" :class="textColorClass">
              {{ message }}
            </p>
          </div>

          <!-- Close Button -->
          <button 
            @click="close"
            class="flex-shrink-0 ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" 
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                    clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  },
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const visible = ref(props.modelValue);
let timer = null;

// Watch for external visibility changes
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal;
  if (newVal) {
    startAutoDismiss();
  }
});

// Computed classes based on toast type
const toastClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-50 border border-green-200';
    case 'error':
      return 'bg-red-50 border border-red-200';
    case 'info':
      return 'bg-blue-50 border border-blue-200';
    default:
      return 'bg-gray-50 border border-gray-200';
  }
});

const textColorClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-800';
    case 'error':
      return 'text-red-800';
    case 'info':
      return 'text-blue-800';
    default:
      return 'text-gray-800';
  }
});

/**
 * Start auto-dismiss timer
 */
const startAutoDismiss = () => {
  clearTimer();
  if (props.duration > 0) {
    timer = setTimeout(() => {
      close();
    }, props.duration);
  }
};

/**
 * Clear the auto-dismiss timer
 */
const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

/**
 * Close the toast notification
 */
const close = () => {
  visible.value = false;
  emit('update:modelValue', false);
  emit('close');
  clearTimer();
};

// Start timer when mounted if visible
if (visible.value) {
  startAutoDismiss();
}

// Cleanup timer on unmount
onUnmounted(() => {
  clearTimer();
});
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>