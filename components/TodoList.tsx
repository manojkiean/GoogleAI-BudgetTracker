import React, { useState, useEffect } from 'react';
import { Todo } from '../types';
import { getTodos, updateTodo, deleteTodo, addTodo } from '../utils/api';
import { FaTrash, FaPencilAlt, FaPlus, FaTimes } from 'react-icons/fa';

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
                checked={!!todo.completed}
                onChange={() => onToggle(todo.id, !todo.completed)}
                className="w-5 h-5 rounded text-cyan-500 bg-gray-800 border-gray-600 focus:ring-cyan-600 cursor-pointer"
            />
            <label htmlFor={`todo-${todo.id}`} className="ml-4 cursor-pointer">
                <p className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>{todo.task}</p>
            </label>
        </div>
        {!isDashboard && (
            <div className="flex items-center space-x-3">
                <button onClick={() => onEdit(todo)} className="text-gray-400 hover:text-cyan-400"><FaPencilAlt /></button>
                <button onClick={() => onDelete(todo.id)} className="text-gray-400 hover:text-red-500"><FaTrash /></button>
            </div>
        )}
    </div>
);

interface TodoListProps {
    initialTodos?: Todo[];
    isDashboard?: boolean;
}

const TodoList: React.FC<TodoListProps> = ({ initialTodos, isDashboard = false }) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

    const sanitizeTodos = (todos: Todo[]): Todo[] => todos.map(todo => ({ ...todo, completed: !!todo.completed }));

    useEffect(() => {
        if (initialTodos) {
            setTodos(sanitizeTodos(initialTodos));
        } else {
            getTodos().then(fetchedTodos => setTodos(sanitizeTodos(fetchedTodos)));
        }
    }, [initialTodos]);

    const handleToggleTodo = (id: number, completed: boolean) => {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            updateTodo({ ...todo, completed }).then(updatedTodo => {
                setTodos(todos.map(t => t.id === id ? { ...t, ...updatedTodo } : t));
            });
        }
    };

    const handleDeleteTodo = (id: number) => {
        deleteTodo(id).then(() => {
            setTodos(todos.filter(t => t.id !== id));
        });
    };

    const handleSaveTodo = (todoData: Omit<Todo, 'id'> | Todo) => {
        if ('id' in todoData) {
            updateTodo(todoData).then(updatedTodo => {
                setTodos(todos.map(t => t.id === todoData.id ? { ...t, ...updatedTodo } : t));
            });
        } else {
            addTodo(todoData).then(newTodo => {
                setTodos([...todos, sanitizeTodos([newTodo])[0]]);
            });
        }
        setIsFormVisible(false);
        setEditingTodo(null);
    };

    const handleEdit = (todo: Todo) => {
        setEditingTodo(todo);
        setIsFormVisible(true);
    };

    const visibleTodos = isDashboard ? todos.slice(0, 5) : todos;

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">To-Do List</h2>
                {!isDashboard && (
                    <button onClick={() => { setEditingTodo(null); setIsFormVisible(!isFormVisible); }} className="p-2 rounded-full bg-gray-700 hover:bg-cyan-500 text-white transition-colors">
                        {isFormVisible ? <FaTimes /> : <FaPlus />}
                    </button>
                )}
            </div>
            {isFormVisible && !isDashboard && (
                <TodoForm 
                    onSave={handleSaveTodo}
                    onCancel={() => { setIsFormVisible(false); setEditingTodo(null); }}
                    initialData={editingTodo}
                />
            )}
            <div className="space-y-4">
                {visibleTodos.length > 0 ? (
                    visibleTodos.map(todo => (
                        <TodoItem key={todo.id} todo={todo} onToggle={handleToggleTodo} onEdit={handleEdit} onDelete={handleDeleteTodo} isDashboard={isDashboard} />
                    ))
                ) : (
                    <p className="text-gray-400">{isDashboard ? "You're all caught up!" : "No tasks yet. Add one to get started!"}</p>
                )}
            </div>
        </div>
    );
};

const TodoForm: React.FC<{
    onSave: (todoData: Omit<Todo, 'id'> | Todo) => void;
    onCancel: () => void;
    initialData?: Todo | null;
}> = ({ onSave, onCancel, initialData }) => {
    const [task, setTask] = useState(initialData?.task || '');
    const [priority, setPriority] = useState(initialData?.priority || 'medium');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const todoPayload = {
            ...(initialData || {}),
            task,
            priority,
            completed: initialData?.completed || false,
        };
        onSave(todoPayload as Omit<Todo, 'id'> | Todo);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
                type="text" 
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="New task..."
                className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
            />
            </div>
            <div className="flex items-center justify-between mt-4">
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="bg-gray-800 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <div className="space-x-2">
                    <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-semibold">{initialData ? 'Update' : 'Add'}</button>
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 font-semibold">Cancel</button>
                </div>
            </div>
        </form>
    );
}

export default TodoList;
