public interface ITelegramService
{
    Task SendNotificationAsync(long chatId, string message);
}