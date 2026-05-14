// 這個檔案就像是你的 Python 腳本，負責跟 Google 溝通
export const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { password, products } = data;

    // 1. 簡易密碼檢查 (安全第一)
    if (password !== import.meta.env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ message: '密碼錯誤' }), { status: 401 });
    }

    // 2. 這裡未來會填入妳之前寫過的 Google API 串接邏輯
    // 現在我們先模擬成功，確保流程是對的
    console.log('準備寫入 Google 試算表:', products);

    // 3. 呼叫 Vercel Webhook (讓前台網頁重新打包)
    if (import.meta.env.VERCEL_DEPLOY_HOOK) {
      await fetch(import.meta.env.VERCEL_DEPLOY_HOOK, { method: 'POST' });
    }

    return new Response(JSON.stringify({ message: '更新成功，正在重新發布網頁...' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: '系統錯誤' }), { status: 500 });
  }
};