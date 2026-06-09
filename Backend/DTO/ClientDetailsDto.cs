namespace SmartFix.Features.Clients.GetClientDetails;

public record ClientDetailsDto(
    int Id,
    string Name,
    string Phone,
    string? Email,
    DateTime RegisteredAt,
    ClientLoyaltyDto Loyalty,
    List<ClientHistoryItemDto> History
);

public record ClientLoyaltyDto(string Tier, int DiscountPercent, decimal BonusPoints, decimal TotalSpent);
public record ClientHistoryItemDto(int Id, DateTime Date, string Device, string Problem, string Status, decimal Cost);
