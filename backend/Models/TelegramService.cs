using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Telegram.Bot;
using Telegram.Bot.Types.Enums;

public class TelegramService : ITelegramService
{
    private readonly ITelegramBotClient _botClient;

    public TelegramService(IConfiguration configuration)
    {
        // Добавляем проверку на null, чтобы компилятор не ругался на string?
        var token = configuration["TelegramBot:Token"]
                    ?? throw new ArgumentException("Токен бота не найден в конфигурации");

        _botClient = new TelegramBotClient(token);
    }

    public async Task SendNotificationAsync(long chatId, string message)
    {
        try
        {
            // Метод теперь называется просто SendMessage (БЕЗ Async на конце!)
            await _botClient.SendMessage(
                chatId: chatId,
                text: message,
                parseMode: ParseMode.Html
            );
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка отправки в Telegram: {ex.Message}");
        }
    }
}