function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const PUBLIC_VAPID_KEY = "BDcXKhk7xvHGmFcuP9GNf6ZTQMvV8nwuSh9ybypsz9ql4402q64Zgv5ESwYt_85z2tpON0HyoeQi8v3oKqdKYWc";

export async function subscribeUserToPush(userId) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push-уведомления не поддерживаются вашим браузером.");
  }

  await navigator.serviceWorker.register("/service-worker.js");

  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
  });

  const subscriptionData = subscription.toJSON();

  const payload = {
    userId: userId,
    endpoint: subscriptionData.endpoint,
    keys: {
      p256dh: subscriptionData.keys.p256dh,
      auth: subscriptionData.keys.auth,
    },
  };

  const response = await fetch(
    "http://localhost/api/PushNotifications/subscribe",
    {
      // Укажите ваш порт бэкенда
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error("Ошибка при сохранении подписки на сервере");
  }

  return true;
}
