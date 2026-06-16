import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { RepairRequest } from '@/types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import { createPortal } from 'react-dom';

interface CalendarProps {
  requests: RepairRequest[];
  onSelectRequest: (request: RepairRequest) => void;
}

type CalendarView = 'month' | 'week';

const MAX_VISIBLE_REQUESTS = 2;
const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const SHORT_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

const formatDateForInput = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] md:hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" />
      <div
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-smartfix-dark rounded-t-2xl shadow-xl max-h-[70vh] flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-smartfix-medium/30 shrink-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-smartfix-lightest">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 dark:text-smartfix-light hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-smartfix-medium/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-2 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

interface DayCellProps {
  day: number;
  date: Date;
  isToday: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isRange: boolean;
  requests: RepairRequest[];
  onDayClick: (date: Date) => void;
  onSelectRequest: (req: RepairRequest) => void;
  onShowMore: (date: Date) => void;
}

const DayCell: React.FC<DayCellProps> = ({
  day, date, isToday, isRangeStart, isRangeEnd, isRange,
  requests, onDayClick, onSelectRequest, onShowMore,
}) => {
  const visible = requests.slice(0, MAX_VISIBLE_REQUESTS);
  const restCount = requests.length - MAX_VISIBLE_REQUESTS;

  return (
    <div
      onClick={() => onDayClick(date)}
      className={`p-0.5 md:p-2 border border-smartfix-dark cursor-pointer select-none
        min-h-[2.25rem] md:h-28 overflow-y-auto calendar-scrollbar
        ${isToday ? 'bg-smartfix-medium/50' : ''}
        ${isRange ? 'bg-blue-500/20' : ''}
        ${isRangeStart ? 'bg-blue-600/40 md:rounded-l-xl shadow-[0_0_20px_rgba(0,150,255,0.5)]' : ''}
        ${isRangeEnd ? 'bg-blue-600/40 md:rounded-r-xl shadow-[0_0_20px_rgba(0,150,255,0.5)]' : ''}
      `}
    >
      <div className={`text-[11px] md:text-sm font-bold leading-tight ${isToday ? 'text-white' : 'text-smartfix-lightest'}`}>
        {day}
      </div>
      {requests.length > 0 && (
        <>
          <div className="hidden md:block mt-0.5 md:mt-1 space-y-0.5 md:space-y-1">
            {visible.map(req => (
              <button
                key={req.id}
                onClick={e => { e.stopPropagation(); onSelectRequest(req); }}
                className="w-full text-left bg-blue-500/30 text-blue-200 text-[10px] md:text-xs p-0.5 md:p-1 rounded truncate hover:bg-blue-500/50 transition-colors"
                title={`#${req.id}: ${req.device}`}
              >
                #{req.id} {req.device}
              </button>
            ))}
            {restCount > 0 && (
              <button
                onClick={e => { e.stopPropagation(); onShowMore(date); }}
                className="w-full text-left text-blue-300 text-[10px] md:text-xs p-0.5 md:p-1 rounded hover:bg-smartfix-medium/30 transition-colors"
              >
                ещё {restCount}
              </button>
            )}
          </div>
          <div className="md:hidden flex flex-wrap gap-[2px] mt-[1px]">
            {requests.slice(0, 4).map(req => (
              <span key={req.id} className="w-[5px] h-[5px] rounded-full bg-blue-400" />
            ))}
            {requests.length > 4 && (
              <span className="text-[9px] text-blue-300 leading-none">+{requests.length - 4}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

interface RequestsSheetModalProps {
  date: Date;
  requests: RepairRequest[];
  onClose: () => void;
  onSelectRequest: (req: RepairRequest) => void;
}

const RequestsSheetModal: React.FC<RequestsSheetModalProps> = ({ date, requests, onClose, onSelectRequest }) => {
  const formattedDate = date.toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-smartfix-dark w-full max-w-md rounded-2xl shadow-xl border border-gray-200 dark:border-smartfix-medium/30 max-h-[70vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-smartfix-medium/30 shrink-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-smartfix-lightest">{formattedDate}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 dark:text-smartfix-light hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-smartfix-medium/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-2 custom-scrollbar">
          {requests.length === 0 ? (
            <p className="text-smartfix-light text-center py-4">Нет заявок на этот день</p>
          ) : (
            requests.map(req => (
              <button
                key={req.id}
                onClick={() => { onSelectRequest(req); onClose(); }}
                className="w-full text-left bg-gray-50 dark:bg-smartfix-darker p-3 rounded-lg border border-gray-200 dark:border-smartfix-medium/30 hover:bg-gray-100 dark:hover:bg-smartfix-medium/50 transition-colors"
              >
                <p className="font-semibold text-sm text-gray-900 dark:text-smartfix-lightest truncate">{req.device}</p>
                <p className="text-xs text-gray-500 dark:text-smartfix-light truncate mt-1">#{req.id}: {req.issueDescription}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Calendar: React.FC<CalendarProps> = ({ requests, onSelectRequest }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateError, setDateError] = useState('');
  const [sheetDate, setSheetDate] = useState<Date | null>(null);

  const today = useMemo(() => new Date(), []);

  const changePeriod = useCallback((offset: number) => {
    if (view === 'month') {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    } else {
      setCurrentDate(prev => {
        const d = new Date(prev);
        d.setDate(prev.getDate() + offset * 7);
        return d;
      });
    }
  }, [view]);

  const handleDayClick = useCallback((date: Date) => {
    if (!rangeStart) {
      setRangeStart(date);
      setRangeEnd(null);
      setSelectedDate(date);
      setCurrentDate(date);
      setDateError('');
    } else if (rangeStart && !rangeEnd) {
      if (date < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(date);
      } else {
        setRangeEnd(date);
      }
      setSelectedDate(date);
      setCurrentDate(date);
      setDateError('');
    } else {
      setRangeStart(date);
      setRangeEnd(null);
      setSelectedDate(date);
      setCurrentDate(date);
      setDateError('');
    }
  }, [rangeStart, rangeEnd]);

  const handleDayCellClick = useCallback((date: Date) => {
    handleDayClick(date);
    if (window.innerWidth < 768) {
      setSheetDate(date);
    }
  }, [handleDayClick]);

  const handleStartDateChange = useCallback((dateStr: string) => {
    if (dateStr) {
      const picked = new Date(dateStr + 'T00:00:00');
      setRangeStart(picked);
      if (rangeEnd && picked > rangeEnd) {
        setDateError('Начальная дата не может быть позже конечной');
      } else {
        setDateError('');
      }
      setSelectedDate(picked);
      setCurrentDate(picked);
    } else {
      setRangeStart(null);
      setSelectedDate(null);
      setDateError('');
    }
  }, [rangeEnd]);

  const handleEndDateChange = useCallback((dateStr: string) => {
    if (dateStr) {
      const picked = new Date(dateStr + 'T23:59:59');
      if (rangeStart && picked < rangeStart) {
        setDateError('Конечная дата не может быть раньше начальной');
      }
      setRangeEnd(picked);
      setCurrentDate(picked);
    } else {
      setRangeEnd(null);
      setDateError('');
    }
  }, [rangeStart]);

  const clearRange = useCallback(() => {
    setRangeStart(null);
    setRangeEnd(null);
    setSelectedDate(null);
    setDateError('');
  }, []);

  const requestsByDate = useMemo(() => {
    return requests.reduce((acc, req) => {
      const key = req.createdAt
        ? new Date(req.createdAt).toDateString()
        : new Date().toDateString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(req);
      return acc;
    }, {} as Record<string, RepairRequest[]>);
  }, [requests]);

  const renderTitle = useCallback(() => {
    if (view === 'month') {
      return currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
    }
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = currentDate.getDay();
    const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const startMonth = startOfWeek.toLocaleString('ru-RU', { month: 'long' });
    const endMonth = endOfWeek.toLocaleString('ru-RU', { month: 'long' });
    if (startMonth === endMonth) {
      return `${startOfWeek.getDate()} — ${endOfWeek.getDate()} ${startMonth} ${endOfWeek.getFullYear()} г.`;
    }
    return `${startOfWeek.getDate()} ${startMonth} — ${endOfWeek.getDate()} ${endMonth} ${endOfWeek.getFullYear()} г.`;
  }, [view, currentDate]);

  useEffect(() => {
    if (view === 'week') {
      setCurrentDate(prev => {
        const startOfWeek = new Date(prev);
        const day = prev.getDay();
        const diff = prev.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        return startOfWeek;
      });
    }
  }, [view]);

  const renderWeekGrid = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = currentDate.getDay();
    const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const weekDates = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });

    return weekDates.map((date, index) => {
      const isTodayDate = isSameDay(date, today);
      const requestsOnThisDay = requestsByDate[date.toDateString()] || [];
      const isRange = !!(rangeStart && rangeEnd && date >= rangeStart && date <= rangeEnd);
      const isRangeStartDate = !!(rangeStart && isSameDay(date, rangeStart));
      const isRangeEndDate = !!(rangeEnd && isSameDay(date, rangeEnd));
      const isSelected = !!(selectedDate && isSameDay(date, selectedDate));

      return (
        <div
          key={index}
          onClick={() => handleDayClick(date)}
          className={`border border-smartfix-dark min-w-[200px] md:min-w-0 flex flex-col cursor-pointer relative
            ${isTodayDate ? 'bg-smartfix-medium/50' : ''}
            ${isRange ? 'bg-blue-500/20' : ''}
            ${isRangeStartDate ? 'bg-blue-600/40 md:rounded-l-xl shadow-[0_0_20px_rgba(0,150,255,0.5)]' : ''}
            ${isRangeEndDate ? 'bg-blue-600/40 md:rounded-r-xl shadow-[0_0_20px_rgba(0,150,255,0.5)]' : ''}
            ${isSelected ? 'bg-blue-700/60 border-blue-400 shadow-[0_0_20px_rgba(0,160,255,0.7)]' : ''}
          `}
        >
          <div className="text-center font-semibold text-smartfix-light p-1.5 md:p-2 border-b border-smartfix-dark text-xs md:text-base">
            <span className="hidden md:inline">{DAYS_OF_WEEK[index]}</span>
            <span className="md:hidden">{SHORT_DAYS[index].slice(0, 1)}</span>
            <span className={`ml-1 md:ml-2 text-sm md:text-lg font-bold ${isTodayDate ? 'text-white' : 'text-smartfix-lightest'}`}>
              {date.getDate()}
            </span>
          </div>
          <div className="p-1 md:p-2 space-y-1 md:space-y-2 overflow-y-auto flex-1 custom-scrollbar max-h-[60vh]">
            {requestsOnThisDay.slice(0, MAX_VISIBLE_REQUESTS).map(req => (
              <button
                key={req.id}
                onClick={e => { e.stopPropagation(); onSelectRequest(req); }}
                className="w-full text-left bg-smartfix-dark p-1.5 md:p-2 rounded hover:bg-smartfix-medium transition-colors"
                title={`${req.device}: ${req.issueDescription}`}
              >
                <p className="font-semibold text-[11px] md:text-sm text-smartfix-lightest truncate">{req.device}</p>
                <p className="text-[10px] md:text-xs text-smartfix-light truncate mt-0.5 md:mt-1">#{req.id}</p>
              </button>
            ))}
            {requestsOnThisDay.length > MAX_VISIBLE_REQUESTS && (
              <button
                onClick={e => { e.stopPropagation(); setSheetDate(date); }}
                className="w-full text-center text-blue-300 text-[10px] md:text-xs py-1 rounded hover:bg-smartfix-medium/30 transition-colors"
              >
                ещё {requestsOnThisDay.length - MAX_VISIBLE_REQUESTS}
              </button>
            )}
          </div>
        </div>
      );
    });
  };

  const renderMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const cells: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <div key={`empty-${i}`} className="border border-smartfix-dark min-h-[2.25rem] md:h-28" />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const requestsOnThisDay = requestsByDate[date.toDateString()] || [];

      cells.push(
        <DayCell
          key={day}
          day={day}
          date={date}
          isToday={isSameDay(date, today)}
          isRangeStart={!!(rangeStart && isSameDay(date, rangeStart))}
          isRangeEnd={!!(rangeEnd && isSameDay(date, rangeEnd))}
          isRange={!!(rangeStart && rangeEnd && date >= rangeStart && date <= rangeEnd)}
          requests={requestsOnThisDay}
          onDayClick={handleDayCellClick}
          onSelectRequest={onSelectRequest}
          onShowMore={setSheetDate}
        />
      );
    }

    const totalCells = firstDay + daysInMonth;
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < remaining; i++) {
      cells.push(
        <div key={`trailing-${i}`} className="border border-smartfix-dark min-h-[2.25rem] md:h-28" />
      );
    }

    return cells;
  };

  const sheetRequests = sheetDate ? (requestsByDate[sheetDate.toDateString()] || []) : [];

  return (
    <div className="bg-smartfix-darker p-2 md:p-6 rounded-xl md:rounded-2xl border border-smartfix-dark">
      {/* ──── Header ──── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 mb-3 md:mb-4">
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <div className="flex items-center gap-1 md:gap-2 p-1 bg-smartfix-dark rounded-lg">
            <input
              type="date"
              value={rangeStart ? formatDateForInput(rangeStart) : ''}
              onChange={e => handleStartDateChange(e.target.value)}
              className="appearance-none bg-smartfix-darker text-smartfix-lightest px-2 md:px-3 py-1 rounded-md border border-smartfix-medium text-[11px] md:text-sm w-[120px] md:w-auto [color-scheme:dark]"
            />
            <span className="text-smartfix-light text-[11px] md:text-xs shrink-0">—</span>
            <input
              type="date"
              value={rangeEnd ? formatDateForInput(rangeEnd) : ''}
              onChange={e => handleEndDateChange(e.target.value)}
              className="appearance-none bg-smartfix-darker text-smartfix-lightest px-2 md:px-3 py-1 rounded-md border border-smartfix-medium text-[11px] md:text-sm w-[120px] md:w-auto [color-scheme:dark]"
            />
            {(rangeStart || rangeEnd) && (
              <button
                onClick={clearRange}
                className="text-[11px] md:text-xs text-red-300 hover:text-red-400 whitespace-nowrap px-1 shrink-0"
              >
                Сбросить
              </button>
            )}
          </div>
          {dateError && <p className="text-red-400 text-[11px] md:text-sm ml-1">{dateError}</p>}
        </div>

        {/* Navigation + title — first on mobile */}
        <div className="flex items-center gap-1 md:gap-4 w-full md:w-auto justify-between md:justify-center order-first md:order-none">
          <button onClick={() => changePeriod(-1)} className="p-1 md:p-2 rounded-full hover:bg-smartfix-dark shrink-0">
            <ChevronLeftIcon className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          <h3 className="text-xs md:text-2xl font-bold text-smartfix-lightest text-center truncate max-w-[140px] md:max-w-none md:w-64 leading-tight">
            {renderTitle()}
          </h3>
          <button onClick={() => changePeriod(1)} className="p-1 md:p-2 rounded-full hover:bg-smartfix-dark shrink-0">
            <ChevronRightIcon className="w-4 h-4 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="flex items-center gap-2 p-0.5 md:p-1 bg-smartfix-dark rounded-lg self-start md:self-auto">
          <button
            onClick={() => setView('month')}
            className={`px-2.5 md:px-4 py-0.5 md:py-1 rounded-md text-[11px] md:text-sm font-semibold transition-colors ${
              view === 'month'
                ? 'bg-smartfix-light text-smartfix-darkest'
                : 'text-smartfix-lightest hover:bg-smartfix-medium/50'
            }`}
          >
            Месяц
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-2.5 md:px-4 py-0.5 md:py-1 rounded-md text-[11px] md:text-sm font-semibold transition-colors ${
              view === 'week'
                ? 'bg-smartfix-light text-smartfix-darkest'
                : 'text-smartfix-lightest hover:bg-smartfix-medium/50'
            }`}
          >
            Неделя
          </button>
        </div>
      </div>

      {/* ──── Month ──── */}
      {view === 'month' && (
        <>
          <div className="grid grid-cols-7 gap-px">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="text-center font-semibold text-smartfix-light p-0.5 md:p-2 text-[10px] md:text-sm">
                <span className="hidden md:inline">{day}</span>
                <span className="md:hidden">{day.charAt(0)}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-smartfix-dark rounded-b-lg overflow-hidden">
            {renderMonthGrid()}
          </div>
        </>
      )}

      {/* ──── Week ──── */}
      {view === 'week' && (
        <div className="overflow-x-auto md:overflow-visible custom-scrollbar -mx-2 md:mx-0">
          <div className="grid grid-cols-7 gap-px bg-smartfix-dark min-w-[1400px] md:min-w-0 rounded-b-lg overflow-hidden">
            {renderWeekGrid()}
          </div>
        </div>
      )}

      {/* ──── Sheet/Modal ──── */}
      {sheetDate && (
        <>
          <BottomSheet
            isOpen
            onClose={() => setSheetDate(null)}
            title={sheetDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          >
            {sheetRequests.length === 0 ? (
              <p className="text-smartfix-light text-center py-4">Нет заявок на этот день</p>
            ) : (
              sheetRequests.map(req => (
                <button
                  key={req.id}
                  onClick={() => { onSelectRequest(req); setSheetDate(null); }}
                  className="w-full text-left bg-gray-50 dark:bg-smartfix-darker p-3 rounded-lg border border-gray-200 dark:border-smartfix-medium/30 hover:bg-gray-100 dark:hover:bg-smartfix-medium/50 transition-colors"
                >
                  <p className="font-semibold text-sm text-gray-900 dark:text-smartfix-lightest truncate">{req.device}</p>
                  <p className="text-xs text-gray-500 dark:text-smartfix-light truncate mt-1">#{req.id}: {req.issueDescription}</p>
                </button>
              ))
            )}
          </BottomSheet>

          {/* Desktop modal for "ещё N" — only shown when there are hidden requests */}
          {sheetRequests.length > MAX_VISIBLE_REQUESTS && (
            <div className="hidden md:block">
              <RequestsSheetModal
                date={sheetDate}
                requests={sheetRequests}
                onClose={() => setSheetDate(null)}
                onSelectRequest={onSelectRequest}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Calendar;
