
import React, { useState, useEffect } from 'react';
import { Todo, Priority } from '../types';
import { updateTodo, deleteTodo, addTodo } from '../utils/api';
import { FaTrash, FaPencilAlt, FaPlus, FaTimes } from 'react-icons/fa';
import AddEditTodoForm from './AddEditTodoForm';
import { formatDate } from '../utils/date'; // Adjust the path if necessary

const TodoItem: React.FC<{
    todo: Todo;
    onToggle: (id: number, completed: boolean) => void;
    onEdit: (todo: Todo) => void;
    onDelete: (id: number) => void;
    isDashboard?: boolean;
}> = ({ todo, onToggle, onEdit, onDelete, isDashboard }) => (
    <div className="flex items-center justify-between w-full bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors duration-200">
        <div className="flex items-center flex-1">
            <input
                type="checkbox"
                id={`todo-${todo.id}`}
                checked={!!todo.completed}
                onChange={() => onToggle(todo.id, !todo.completed)}
                className="w-5 h-5 rounded text-cyan-500 bg-gray-800 border-gray-600 focus:ring-cyan-600 cursor-pointer"
            />
            <label htmlFor={`todo-${todo.id}`} className="ml-4 cursor-pointer flex-1 min-w-0">
                <p className={`font-medium truncate ${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                    {todo.task}
                </p>
            </label>
        </div>
        {isDashboard ? (
            <div className="flex items-center">
                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityClass(todo.priority)}`}>
                    {todo.priority}
                </span>
                <span className="text-sm text-gray-400 ml-4">
                    { formatDate(todo.dueDate,'DD-MM-YYYY')}
                </span>
            </div>
        ) : (
            <>
                <div className="flex items-center flex-1">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityClass(todo.priority)}`}>
                        {todo.priority}
                    </span>
                </div>
                <div className="flex items-center flex-1">
                    
                    <span className="text-sm text-gray-400">
                        { formatDate(todo.dueDate,'DD-MM-YYYY')}
                    </span>
                    <button onClick={() => onEdit(todo)} className="text-gray-400 hover:text-cyan-400 ml-2">
                        <FaPencilAlt />
                    </button>
                    <button onClick={() => onDelete(todo.id)} className="text-gray-400 hover:text-red-500 ml-2">
                        <FaTrash />
                    </button>
                </div>
            </>
        )}
    </div>
);

const getPriorityClass = (priority: Priority) => {
    switch (priority) {
        case Priority.High: return 'bg-red-500 text-white';
        case Priority.Medium: return 'bg-yellow-500 text-black';
        case Priority.Low: return 'bg-green-500 text-white';
        default: return 'bg-gray-500 text-white';
    }
};

interface TodoListProps {
    initialTodos?: Todo[];
    isDashboard?: boolean;
    onUpdateTodos?: () => void;
}

const TodoList: React.FC<TodoListProps> = ({ initialTodos, isDashboard = false, onUpdateTodos }) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

    const sanitizeTodos = (todos: Todo[]): Todo[] => todos.map(todo => ({ ...todo, completed: !!todo.completed }));

    useEffect(() => {
        if (initialTodos) {
            setTodos(sanitizeTodos(initialTodos));
        }
    }, [initialTodos]);

    const handleUpdate = () => {
        if (onUpdateTodos) {
            onUpdateTodos();
        }
    };

    const handleToggleTodo = async (id: number, completed: boolean) => {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            try {
                await updateTodo({ ...todo, completed });
                handleUpdate();
            } catch (error) {
                console.error("Failed to toggle todo:", error);
            }
        }
    };

    const handleDeleteTodo = async (id: number) => {
        try {
            await deleteTodo(id);
            handleUpdate();
        } catch (error) {
            console.error("Failed to delete todo:", error);
        }
    };

    const handleSaveTodo = async (todoData: Omit<Todo, 'id'> & { id?: number }): Promise<boolean> => {
        try {
            if (todoData.id) {
                const existingTodo = todos.find(t => t.id === todoData.id);
                if (existingTodo) {
                    await updateTodo({ ...existingTodo, ...todoData });
                }
            } else {
                await addTodo(todoData as Omit<Todo, 'id'>);
            }
            handleUpdate();
            if(isFormVisible){
                setIsFormVisible(false);
                setEditingTodo(null);
            }
            return true;
        } catch (error) {
            console.error("Failed to save todo:", error);
            return false;
        }
    };

    const handleEdit = (todo: Todo) => {
        setEditingTodo(todo);
        setIsFormVisible(true);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingTodo(null);
    }

    const visibleTodos = isDashboard ? todos.slice(0, 5) : todos;

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
               { !isDashboard ? <h2 className="text-2xl font-bold text-white">To-Do List</h2> : '' }
                {!isDashboard && (
                    <button onClick={() => { setEditingTodo(null); setIsFormVisible(!isFormVisible); }} className="p-2 rounded-full bg-gray-700 hover:bg-cyan-500 text-white transition-colors">
                        {isFormVisible ? <FaTimes /> : <FaPlus />}
                    </button>
                )}
            </div>
            {isFormVisible && !isDashboard && (
                <AddEditTodoForm 
                    onSave={handleSaveTodo}
                    onCancel={handleCancel}
                    todo={editingTodo}
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

export default TodoList;
