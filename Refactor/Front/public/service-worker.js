self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.message,
            icon: '/icon-pc.png', 
            badge: '/icon-andorid.png', 
            vibrate: [100, 50, 100], // Вибрация
            data: { url: data.url || '/' } 
        };

        // Cистемное уведомление
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close(); 
    // Открываем вкладку браузера по ссылке из уведомления
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});