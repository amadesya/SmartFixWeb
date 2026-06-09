using Microsoft.AspNetCore.SignalR;

namespace SmartFixApi.Hubs
{
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"[SignalR] Клиент успешно подключился. Connection ID: {Context.ConnectionId}");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"[SignalR] Клиент отключился. Connection ID: {Context.ConnectionId}");
            await base.OnDisconnectedAsync(exception);
        }
    }
}