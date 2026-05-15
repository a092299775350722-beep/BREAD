import { atom, map } from 'nanostores';

// 購物車內容：用 map 儲存物件，key 是商品名稱
export const cartItems = map({});

// 側邊欄開關：用 atom 儲存布林值
export const isCartOpen = atom(false);

// 加入商品函式
export function addCartItem(item) {
  const current = cartItems.get();
  const existing = current[item.name];
  if (existing) {
    cartItems.setKey(item.name, {
      ...existing,
      quantity: existing.quantity + 1,
    });
  } else {
    cartItems.setKey(item.name, {
      name: item.name,
      price: Number(item.price),
      quantity: 1,
    });
  }
}

// 增加數量
export function increaseQty(name) {
  const current = cartItems.get()[name];
  if (current) {
    cartItems.setKey(name, {
      ...current,
      quantity: current.quantity + 1,
    });
  }
}

// 減少數量
export function decreaseQty(name) {
  const current = cartItems.get()[name];
  if (current) {
    if (current.quantity <= 1) {
      cartItems.setKey(name, undefined);
    } else {
      cartItems.setKey(name, {
        ...current,
        quantity: current.quantity - 1,
      });
    }
  }
}