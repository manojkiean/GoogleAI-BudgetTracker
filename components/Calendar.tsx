
import React, { useState, useRef } from 'react';
import { Transaction, Todo } from '../types';
import { formatDate } from '../utils/date';
import { TodoIcon, SubscriptionsIcon } from './icons/IconComponents';

interface CalendarProps {
  subscriptions: Transaction[];
  todos: Todo[];
}

const EventPopup: React.FC<{ event: Todo | Transaction | null, onClose: () => void, show: boolean }> = ({ event, onClose, show }) => {
  if (!show || !event) return null;

  const isTodo = 'task' in event;
  const title = isTodo ? event.task : event.source;
  const amount = 'amount' in event ? event.amount : null;
  const borderColor = isTodo ? 'border-blue-400' : 'border-red-400';

  return (
    <>
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black rounded-lg z-10 transition-opacity duration-300 bg-opacity-50"
        onClick={onClose}
      ></div>
      {/* Content */}
      <div
        className={`absolute z-20 w-64 p-4 bg-gray-900 rounded-lg shadow-xl transition-all duration-300 ease-in-out top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-100 opacity-100 border-4 ${borderColor}`}>
        <div className="font-bold text-white mb-2">{title}</div>
        {amount && <p className="text-gray-300">Amount: ${amount.toFixed(2)}</p>}
        {'priority' in event && <p className="text-gray-300">Priority: {event.priority}</p>}
        {'dueDate' in event && <p className="text-gray-300">Due: {formatDate(event.dueDate, 'DD-MM-YYYY')}</p>}
      </div>
    </>
  );
};

const CalendarLegends: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-6 mt-4">
      <div className="flex items-center">
        <div className="w-4 h-4 text-blue-400"><TodoIcon /></div>
        <span className="ml-2 text-gray-400 text-sm">To-do</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 text-red-400"><SubscriptionsIcon /></div>
        <span className="ml-2 text-gray-400 text-sm">Subscription</span>
      </div>
    </div>
  );
};

const Calendar: React.FC<CalendarProps> = ({ subscriptions, todos }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Todo | Transaction | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderHeader = () => {
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    return (
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="text-gray-400 hover:text-white">&lt;</button>
        <h2 className="text-xl font-bold text-white">{month} {year}</h2>
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="text-gray-400 hover:text-white">&gt;</button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-semibold text-gray-400">{daysOfWeek[i]}</div>
      );
    }
    return <div className="grid grid-cols-7 gap-2">{days}</div>;
  };

  const handleEventClick = (event: Todo | Transaction) => {
    setSelectedEvent(event);
  };

  const handleClosePopup = () => {
    setSelectedEvent(null);
  };

  const renderCells = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const cells = [];
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    oneWeekAgo.setHours(0, 0, 0, 0);
    oneMonthAgo.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = formatDate(date, 'YYYY-MM-DD');

      const dailySubscriptions = subscriptions.filter(s => {
        if (!s.nextPayment) return false;
        const subDate = new Date(s.nextPayment);
        subDate.setHours(0, 0, 0, 0);
        return formatDate(subDate, 'YYYY-MM-DD') === dateString && subDate >= oneMonthAgo;
      });

      const dailyTodos = todos.filter(t => {
        if (!t.dueDate) return false;
        const todoDate = new Date(t.dueDate);
        todoDate.setHours(0, 0, 0, 0);
        return formatDate(todoDate, 'YYYY-MM-DD') === dateString && todoDate >= oneWeekAgo;
      });

      const events = [...dailySubscriptions, ...dailyTodos];

      cells.push(
        <div
          key={day}
          className={`p-2 h-16 flex flex-col items-center justify-start rounded-lg transition-colors duration-200 cursor-default relative ${events.length > 0 ? 'bg-cyan-600' : 'bg-gray-700'} ${date.toDateString() === new Date().toDateString() ? 'border-2 border-blue-500' : ''}`}>
          <span className={`font-bold ${events.length > 0 ? 'text-white' : 'text-gray-300'} ${date.toDateString() === new Date().toDateString() ? 'text-blue-200' : ''}`}>
            {day}
          </span>
          <div className="flex mt-1">
            {dailyTodos.map(todo => (
              <div key={`todo-${todo.id}`} onClick={() => handleEventClick(todo)} className="w-4 h-4 text-blue-400 mx-0.5 cursor-pointer"><TodoIcon /></div>
            ))}
            {dailySubscriptions.map(sub => (
              <div key={`sub-${sub.id}`} onClick={() => handleEventClick(sub)} className="w-4 h-4 text-red-400 mx-0.5 cursor-pointer"><SubscriptionsIcon /></div>
            ))}
          </div>
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-2">{cells}</div>;
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg relative" ref={calendarRef}>
      <div className={`transition-opacity duration-300 ${selectedEvent ? 'opacity-25 pointer-events-none' : 'opacity-100'}`}>
        {renderHeader()}
        {renderDays()}
        {renderCells()}
        <CalendarLegends />
      </div>

      <EventPopup
        event={selectedEvent}
        onClose={handleClosePopup}
        show={!!selectedEvent}
      />
    </div>
  );
};

export default Calendar;
