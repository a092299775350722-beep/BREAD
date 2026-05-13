<template>
  <button 
    @click="addToCart" 
    :class="[
      'px-5 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg',
      isAdded ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'
    ]"
  >
    {{ isAdded ? '✔ 已加入' : '加入預購' }}
  </button>
</template>

<script setup>
import { ref } from 'vue';
// 匯入我們剛剛寫好的白板函式
import { addCartItem } from '../store/cartStore.js';

// 多接收一個價格參數
const props = defineProps({
  itemName: String,
  itemPrice: Number // 新增這個
});

const isAdded = ref(false);

const addToCart = () => {
  if (isAdded.value) return; 
  
  isAdded.value = true;
  
  // 執行加到購物車的動作！
  addCartItem({
    name: props.itemName,
    price: props.itemPrice
  });
  
  setTimeout(() => {
    isAdded.value = false;
  }, 2000);
};
</script>