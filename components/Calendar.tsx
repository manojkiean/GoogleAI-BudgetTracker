
import React, { useState } from 'react';
import { Transaction, Todo } from '../types';

interface CalendarProps {
  subscriptions: Transaction[];
  todos: Todo[];
}

const Calendar: React.FC<CalendarProps> = ({ subscriptions, todos }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const renderCells = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      const subscriptionEvents = subscriptions.filter(s => new Date(s.renewalDate).toDateString() === date.toDateString());
      const todoEvents = todos.filter(t => new Date(t.dueDate).toDateString() === date.toDateString());

      cells.push(
        <div key={day} className={`p-2 border border-gray-700 rounded-lg h-24 flex flex-col ${isToday ? 'bg-blue-500' : ''}`}>
          <span className={`font-bold ${isToday ? 'text-white' : 'text-gray-200'}`}>{day}</span>
          <div className="flex-grow overflow-y-auto">
            {subscriptionEvents.map(s => (
              <div key={`sub-${s.id}`} className="text-xs bg-red-500 text-white p-1 rounded-md mb-1">{s.source}</div>
            ))}
            {todoEvents.map(t => (
              <div key={`todo-${t.id}`} className="text-xs bg-green-500 text-white p-1 rounded-md mb-1">{t.task}</div>
            ))}
          </div>
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-2">{cells}</div>;
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
