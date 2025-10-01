import React, { useState } from 'react';
import { todoData } from '../constants';
import { Priority, Todo } from '../types';

const priorityColors: Record<Priority, string> = {
    [Priority.High]: 'bg-red-500',
    [Priority.Medium]: 'bg-yellow-500',
    [Priority.Low]: 'bg-blue-500',
};

const TodoItem: React.FC<{ todo: Todo; onToggle: (id: number) => void }> = ({ todo, onToggle }) => (
    <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center">
            <input 
                type="checkbox"
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                className="w-5 h-5 rounded text-cyan-500 bg-gray-800 border-gray-600 focus:ring-cyan-600"
            />
            <label htmlFor={`todo-${todo.id}`} className="ml-4">
                <p className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>{todo.task}</p>
                <p className="text-xs text-gray-400">Due: {todo.dueDate}</p>
            </label>
        </div>
        <div className="flex items-center" aria-label={`Priority: ${todo.priority}`}>
            <span className="text-xs mr-3 hidden sm:inline">{todo.priority}</span>
            <div className={`w-3 h-3 rounded-full ${priorityColors[todo.priority]}`}></div>
        </div>
    </div>
);

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>(todoData);

    const handleToggleTodo = (id: number) => {
        setTodos(
            todos.map(todo => 
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const sortedTodos = [...todos].sort((a, b) => Number(a.completed) - Number(b.completed));

    return (
        <section aria-labelledby="todo-heading">
            <h2 id="todo-heading" className="text-2xl font-bold mb-6">Financial To-Do List</h2>
            <div className="space-y-4 mb-24 lg:mb-0">
                {sortedTodos.map(todo => (
                    <TodoItem key={todo.id} todo={todo} onToggle={handleToggleTodo} />
                ))}
            </div>
        </section>
    );
};

export default TodoList;
