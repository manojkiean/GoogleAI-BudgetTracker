
import React, { useState, useEffect } from 'react';
import { Priority, Todo } from '../types';
import AddEditTodoForm from './AddEditTodoForm';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../utils/api';
import { formatDate } from '../utils/date';

const priorityColors: Record<Priority, string> = {
    [Priority.High]: 'bg-red-500',
    [Priority.Medium]: 'bg-yellow-500',
    [Priority.Low]: 'bg-blue-500',
};

const TodoItem: React.FC<{
    todo: Todo;
    onToggle: (id: number, completed: boolean) => void;
    onEdit: (todo: Todo) => void;
    onDelete: (id: number) => void;
    isDashboard?: boolean;
}> = ({ todo, onToggle, onEdit, onDelete, isDashboard }) => (
    <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors duration-200">
        <div className="flex items-center">
            <input
                type="checkbox"
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onChange={() => onToggle(todo.id, !todo.completed)}
                className="w-5 h-5 rounded text-cyan-500 bg-gray-800 border-gray-600 focus:ring-cyan-600 cursor-pointer"
            />
            <label htmlFor={`todo-${todo.id}`} className="ml-4 cursor-pointer">
                <p className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>{todo.task}</p>
                <p className="text-xs text-gray-400">Due: {formatDate(todo.dueDate)}</p>
            </label>
        </div>
        <div className="flex items-center space-x-4">
            <div className="flex items-center" aria-label={`Priority: ${todo.priority}`}>
                <span className="text-xs mr-3 hidden sm:inline">{todo.priority}</span>
                <div className={`w-3 h-3 rounded-full ${priorityColors[todo.priority]}`}></div>
            </div>
            {!isDashboard && (
                <div className="flex space-x-2">
                    <button onClick={() => onEdit(todo)} className="text-sm font-medium text-cyan-400 hover:text-cyan-300">Edit</button>
                    <button onClick={() => onDelete(todo.id)} className="text-sm font-medium text-red-500 hover:text-red-400">Delete</button>
                </div>
            )}
        </div>
    </div>
);

interface TodoListProps {
    initialTodos?: Todo[];
    isDashboard?: boolean;
}

const TodoList: React.FC<TodoListProps> = ({ initialTodos, isDashboard = false }) => {
    const [todos, setTodos] = useState<Todo[]>(initialTodos || []);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

    useEffect(() => {
        if (!initialTodos) {
            getTodos().then(setTodos);
        }
    }, [initialTodos]);

    const handleToggleTodo = (id: number, completed: boolean) => {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            updateTodo({ ...todo, completed }).then(() => {
                 if (initialTodos) {
                    const updatedTodos = todos.map(t => t.id === id ? {...t, completed} : t);
                    setTodos(updatedTodos);
                } else {
                    getTodos().then(setTodos);
                }
            });
        }
    };

    const handleSaveTodo = (todoData: Omit<Todo, 'id' | 'completed'> & { id?: number }) => {
        const promise = todoData.id
            ? updateTodo({ ...todos.find(t => t.id === todoData.id)!, ...todoData } as Todo)
            : addTodo(todoData as Omit<Todo, 'id'>);

        promise.then(() => {
            getTodos().then(setTodos);
            setIsFormVisible(false);
            setEditingTodo(null);
        });
    };

    const handleDeleteTodo = (id: number) => {
        deleteTodo(id).then(() => {
            setTodos(todos.filter(todo => todo.id !== id));
        });
    };

    const handleEditClick = (todo: Todo) => {
        setEditingTodo(todo);
        setIsFormVisible(true);
    };

    const handleAddClick = () => {
        setEditingTodo(null);
        setIsFormVisible(true);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingTodo(null);
    };

    const sortedTodos = [...todos].sort((a, b) => Number(a.completed) - Number(b.completed));

    return (
        <section aria-labelledby="todo-heading">
             {!isDashboard && (
                <div className="flex justify-between items-center mb-6">
                    <h2 id="todo-heading" className="text-2xl font-bold">To-Do List</h2>
                    {!isFormVisible && (
                         <button
                            onClick={handleAddClick}
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
                        >
                            Add Task
                        </button>
                    )}
                </div>
            )}

            {isFormVisible && (
                <AddEditTodoForm
                    todo={editingTodo}
                    onSave={handleSaveTodo}
                    onCancel={handleCancel}
                />
            )}

            <div className={`space-y-4 mt-6 mb-24 lg:mb-0 ${isDashboard ? 'max-h-96 overflow-y-auto' : ''}`}>
                {sortedTodos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggleTodo}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteTodo}
                        isDashboard={isDashboard}
                    />
                ))}
            </div>
        </section>
    );
};

export default TodoList;
