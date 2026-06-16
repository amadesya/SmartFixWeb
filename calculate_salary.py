# Расчет заработной платы на основе KPI
import locale
locale.setlocale(locale.LC_ALL, 'ru_RU.UTF-8')
try:
    locale.setlocale(locale.LC_ALL, 'ru_RU')
except:
    pass

revenue = 63232
orders = 17
cost_per_order = revenue / orders  # Базовая стоимость одной заявки

employees = [
    {"name": "Иван Петров",   "salary": 70000, "bonus_pct": 2,  "basis": "revenue"},
    {"name": "Виталий Каспер","salary": 50000, "bonus_pct": 2,  "basis": "revenue"},
    {"name": "Сергей Сидоров","salary": 50000, "bonus_pct": 10, "basis": "revenue"},
    {"name": "Админ",         "salary": 20000, "bonus_pct": 10, "basis": "revenue"},
]

print(f"{'ФИО':<20} {'Оклад':>10} {'Бонус (%)':>10} {'Сумма бонуса':>14} {'Итого к выплате':>18}")
print("=" * 72)

total_bonus = 0

for e in employees:
    # Если премия от выручки
    bonus = revenue * e["bonus_pct"] / 100
    total = e["salary"] + bonus
    total_bonus += bonus
    print(f"{e['name']:<20} {e['salary']:>10,.0f} {e['bonus_pct']:>8}% {bonus:>12,.0f} руб {total:>14,.0f} руб")

print("=" * 72)
print(f"{'ИТОГО бонусов':<40} {total_bonus:>12,.0f} руб")
print(f"{'Стоимость 1 заявки (выручка/17)':<40} {cost_per_order:>12,.2f} руб")
print(f"{'Стоимость бонуса на 1 заявку':<40} {total_bonus/orders:>12,.2f} руб")
print()

# Альтернативный расчет: если % применять к стоимости заявки, а не к выручке
print("--- Альтернатива: бонус от стоимости заявки ---")
print(f"Стоимость одной заявки: {revenue} / {orders} = {cost_per_order:.2f} руб")
print("=" * 72)
print(f"{'ФИО':<20} {'Оклад':>10} {'Бонус (%)':>10} {'Сумма бонуса':>14} {'Итого к выплате':>18}")
print("=" * 72)

for e in employees:
    bonus_from_order = (cost_per_order * e["bonus_pct"] / 100) * orders
    total = e["salary"] + bonus_from_order
    print(f"{e['name']:<20} {e['salary']:>10,.0f} {e['bonus_pct']:>8}% {bonus_from_order:>12,.0f} руб {total:>14,.0f} руб")

print()
print(f"Результат совпадает с основным, т.к.:")
print(f"  выручка × % = (выручка / заявки × %) × заявки")
print(f"  {revenue} × % = ({cost_per_order:.2f} × %) × {orders}")
