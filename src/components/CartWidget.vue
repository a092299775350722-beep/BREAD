<template>
  <div class="fixed bottom-8 right-8 z-50">
    <button
      @click="openCart"
      class="bg-amber-800 text-white p-4 rounded-full shadow-2xl hover:bg-amber-900 transition-transform hover:scale-110 flex items-center justify-center"
    >
      <span class="text-2xl">🛒</span>
      <span 
        v-if="itemCount > 0" 
        class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center"
      >
        {{ itemCount }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { cartItems, isCartOpen } from '../store/cartStore.js';

const $cartItems = useStore(cartItems);

// 計算商品總數量（不同品項的數量總和）
const itemCount = computed(() => {
  const items = $cartItems.value;
  return Object.values(items).reduce((sum, item) => sum + (item.quantity || 0), 0);
});

const openCart = () => {
  isCartOpen.set(true);
};
</script>