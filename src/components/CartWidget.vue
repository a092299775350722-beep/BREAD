<template>
  <div class="fixed bottom-8 right-8 z-50">
    <button
      @click="isCartOpen.set(true)"
      class="bg-amber-800 text-white p-4 rounded-full shadow-2xl hover:bg-amber-900 transition-transform hover:scale-110 flex items-center gap-2"
    >
      <span class="text-2xl">🛒</span>
      <span v-if="$cartItems.length > 0" class="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full absolute -top-2 -right-2">
        {{ $cartItems.length }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { useStore } from '@nanostores/vue';
import { cartItems, isCartOpen } from '../store/cartStore.js';

const $cartItems = useStore(cartItems);
</script>