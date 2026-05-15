<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-10 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- 登入畫面 -->
      <div v-if="!isLoggedIn" class="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center border border-amber-100">
        <div class="text-6xl mb-4">🍞</div>
        <h2 class="text-2xl font-bold text-amber-900 mb-6">春華製作所登入</h2>
        <input 
        v-model="password" 
        type="password" 
        @keyup.enter="login"
        class="w-full border border-gray-200 rounded-xl p-3 mb-4 text-center focus:ring-2 focus:ring-amber-400 outline-none"
        placeholder="請輸入通關密碼"
        />
        <button @click="login" class="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition shadow-md">
          開門
        </button>
        <p v-if="errorMessage" class="text-red-500 mt-4 text-sm">{{ errorMessage }}</p>
      </div>
      
      <!-- 管理面板（登入後） -->
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100">
        <!-- 分頁標籤 -->
        <div class="flex border-b border-amber-200 bg-amber-50/50">
          <button 
          @click="activeTab = 'orders'"
          class="px-6 py-3 font-medium text-lg transition-all"
          :class="activeTab === 'orders' 
          ? 'bg-white text-amber-800 border-b-2 border-amber-600 -mb-px' 
          : 'text-stone-500 hover:text-amber-700'"
          >
          📋 訂單管理
        </button>
        <button 
        @click="activeTab = 'products'"
        class="px-6 py-3 font-medium text-lg transition-all"
        :class="activeTab === 'products' 
        ? 'bg-white text-amber-800 border-b-2 border-amber-600 -mb-px' 
        : 'text-stone-500 hover:text-amber-700'"
        >
        🥖 商品管理
      </button>
    </div>
    
    <!-- 訂單管理內容 -->
    <div v-if="activeTab === 'orders'" class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-amber-900">訂單列表</h2>
        <button @click="logout" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition">
          登出
        </button>
      </div>
      <div v-if="orders.length === 0" class="text-center py-16 text-gray-400">
        🍞 目前沒有任何訂單
      </div>
      <div v-else class="space-y-6">
        <div v-for="order in orders" :key="order.id" class="border border-amber-100 rounded-xl p-5 bg-amber-50/30 hover:shadow-md transition">
          <div class="flex flex-wrap justify-between items-start gap-3 mb-3">
            <div>
              <span class="font-mono text-sm text-amber-700 bg-amber-100 px-2 py-1 rounded">訂單編號：{{ order.id }}</span>
              <span class="ml-3 text-sm text-gray-500">{{ order.date }}</span>
            </div>
            <select v-model="order.status" @change="updateOrderStatus(order.id, order.status)" 
            class="border rounded-full px-4 py-1 text-sm font-medium"
            :class="{
              'bg-yellow-100 text-yellow-800 border-yellow-200': order.status === '待處理',
              'bg-green-100 text-green-800 border-green-200': order.status === '已完成'
            }">
            <option value="待處理">待處理</option>
            <option value="已完成">已完成</option>
          </select>
        </div>
        <div class="bg-white rounded-lg p-3 mb-3 text-sm space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-amber-600">👤</span> <span class="font-medium">姓名：</span> {{ order.customer?.name || '未填寫' }}
          </div>
          <div class="flex items-center gap-2">
            <span class="text-amber-600">📞</span> <span class="font-medium">電話：</span> {{ order.customer?.phone || '未填寫' }}
          </div>
          <div v-if="order.customer?.note" class="flex items-start gap-2">
            <span class="text-amber-600">📝</span> <span class="font-medium">備註：</span> {{ order.customer.note }}
          </div>
        </div>
        <div class="space-y-1">
          <div v-for="item in order.items" :key="item.name" class="flex justify-between text-sm">
            <span>{{ item.name }} × {{ item.quantity }}</span>
            <span class="font-medium">NT$ {{ item.price * item.quantity }}</span>
          </div>
        </div>
        <div class="text-right font-bold mt-3 pt-2 border-t border-amber-200">
          總計：NT$ {{ order.total }}
        </div>
      </div>
    </div>
  </div>
  
  <!-- 商品管理內容 -->
  <div v-if="activeTab === 'products'" class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-amber-900">商品清單</h2>
      <button @click="saveProductsToMock" class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg shadow transition">
        💾 儲存變更（模擬）
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white rounded-xl shadow">
        <thead class="bg-amber-100 text-amber-800">
          <tr>
            <th class="px-4 py-2 text-left">商品名稱</th>
            <th class="px-4 py-2 text-left">價格</th>
            <th class="px-4 py-2 text-left">描述</th>
            <th class="px-4 py-2 text-left">圖片網址</th>
            <th class="px-4 py-2 text-left">狀態</th>
            <th class="px-4 py-2 text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, idx) in editableProducts" :key="idx" class="border-b border-amber-50 hover:bg-amber-50/30">
            <td class="px-4 py-2"><input v-model="product.title" class="w-full border border-gray-200 rounded px-2 py-1" /></td>
            <td class="px-4 py-2"><input v-model.number="product.price" type="number" class="w-24 border border-gray-200 rounded px-2 py-1" /></td>
            <td class="px-4 py-2"><input v-model="product.description" class="w-48 border border-gray-200 rounded px-2 py-1" /></td>
            <!-- 商品管理表格：圖片欄位改用上傳按鈕 + 預覽 -->
            <td class="px-4 py-2">
              <div class="flex items-center gap-2">
                <!-- 圖片預覽 -->
                <div v-if="product.imageBase64 || product.image" class="w-12 h-12 bg-amber-100 rounded flex items-center justify-center overflow-hidden">
                  <img :src="product.imageBase64 || product.image" class="max-w-full max-h-full object-cover" />
                </div>
                <div v-else class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                  無圖
                </div>
                <!-- 上傳按鈕 -->
                <label class="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm transition">
                  📁 選圖
                  <input type="file" accept="image/*" class="hidden" @change="(e) => handleImageUpload(idx, e)" />
                </label>
              </div>
            </td>
            <td class="px-4 py-2">
              <select v-model="product.status" class="border rounded-full px-2 py-1 text-sm">
                <option value="上架">上架</option>
                <option value="下架">下架</option>
              </select>
            </td>
            <td class="px-4 py-2 text-center">
              <button @click="removeProduct(idx)" class="text-red-500 hover:text-red-700 text-sm">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-6">
      <button @click="addProduct" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition">
        ＋ 新增商品
      </button>
    </div>
    <div class="mt-4 text-sm text-stone-500 bg-amber-50 p-3 rounded-lg">
      💡 提示：目前商品資料僅為前端模擬，儲存變更只會顯示提示，尚未連接 Google Sheets。
    </div>
  </div>
</div>
</div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// 模擬商品資料（未來會從 Google Sheets 讀取）
import { products as mockProducts } from '../mock/products.js';
// 處理圖片上傳（轉為 Base64）
const handleImageUpload = (index, event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    editableProducts.value[index].imageBase64 = e.target.result;
    // 也可同步更新 image 欄位（如果未來要存網址）
  };
  reader.readAsDataURL(file);
};
const isLoggedIn = ref(false);
const password = ref('');
const errorMessage = ref('');
const orders = ref([]);
const activeTab = ref('orders'); // 'orders' 或 'products'

// 商品管理用的可編輯列表（複製 mock 資料）
const editableProducts = ref([]);

// 載入訂單
const loadOrders = () => {
  const stored = localStorage.getItem('orders');
  orders.value = stored ? JSON.parse(stored) : [];
};

// 更新訂單狀態
const updateOrderStatus = (orderId, newStatus) => {
  const updatedOrders = orders.value.map(order => 
  order.id === orderId ? { ...order, status: newStatus } : order
  );
  orders.value = updatedOrders;
  localStorage.setItem('orders', JSON.stringify(updatedOrders));
};

// 登出
const logout = () => {
  isLoggedIn.value = false;
  password.value = '';
  errorMessage.value = '';
};

// 登入 API
const login = async () => {
  errorMessage.value = '驗證中...'; 
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value })
    });
    const data = await res.json();
    if (data.success) {
      isLoggedIn.value = true;
      errorMessage.value = '';
      loadOrders();
      // 載入商品資料（複製 mock）
      editableProducts.value = mockProducts.map(p => ({ ...p, status: '上架' }));
    } else {
      errorMessage.value = '密碼錯誤，請重新輸入。';
      password.value = '';
    }
  } catch (error) {
    errorMessage.value = '系統連線異常，請檢查伺服器狀態。';
  }
};

// 商品管理方法
const addProduct = () => {
  editableProducts.value.push({
    title: '新商品',
    price: 0,
    description: '請輸入描述',
    image: '',
    status: '上架'
  });
};

const removeProduct = (index) => {
  if (confirm('確定刪除此商品？')) {
    editableProducts.value.splice(index, 1);
  }
};

const saveProductsToMock = () => {
  // 這裡只是模擬儲存，未來會串接 Google Sheets API
  console.log('儲存商品清單：', editableProducts.value);
  alert('商品資料已儲存（模擬），未來將實際寫入 Google Sheets。');
};

// 如果已經登入（例如重新整理），先保持登入畫面，不做自動登入
</script>