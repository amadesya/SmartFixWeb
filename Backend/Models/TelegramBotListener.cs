using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
using Microsoft.EntityFrameworkCore;
using SmartFixApi.Data;

public class TelegramBotListener : BackgroundService
{
    private readonly string _botToken;
    private readonly IServiceScopeFactory _scopeFactory;

    public TelegramBotListener(IConfiguration configuration, IServiceScopeFactory scopeFactory)
    {
        _botToken = configuration["TelegramBot:Token"];
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var botClient = new TelegramBotClient(_botToken);

        // Убрали "updateHandler:" и "pollingErrorHandler:", передаем просто по порядку
        botClient.StartReceiving(
            HandleUpdateAsync,
            HandleErrorAsync,
            new ReceiverOptions { AllowedUpdates = { } },
            stoppingToken
        );

        await Task.Delay(Timeout.Infinite, stoppingToken);
    }

    private async Task HandleUpdateAsync(ITelegramBotClient botClient, Update update, CancellationToken cancellationToken)
    {
        if (update.Message is not { Text: { } messageText } message)
            return;

        var chatId = message.Chat.Id;

        if (messageText.StartsWith("/start "))
        {
            var payload = messageText.Split(' ').LastOrDefault();

            if (int.TryParse(payload, out int userId))
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var user = await db.Users.FindAsync(new object[] { userId }, cancellationToken);

                if (user != null)
                {
                    user.TelegramChatId = chatId;
                    await db.SaveChangesAsync(cancellationToken);

                    await botClient.SendMessage(
                        new Telegram.Bot.Types.ChatId(chatId),
                        $"✅ Отлично, {user.Name}! Ваш аккаунт успешно привязан. Сюда будут приходить уведомления о ваших заявках.",
                        cancellationToken: cancellationToken);
                }
                else
                {
                    await botClient.SendMessage(
                        new Telegram.Bot.Types.ChatId(chatId),
                        "❌ Ошибка: Пользователь не найден в системе.",
                        cancellationToken: cancellationToken);
                }
            }
        }
    }

    private Task HandleErrorAsync(ITelegramBotClient botClient, Exception exception, CancellationToken cancellationToken)
    {
        Console.WriteLine($"Ошибка Telegram: {exception.Message}");
        return Task.CompletedTask;
    }
}