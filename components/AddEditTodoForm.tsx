
import React, { useState, useEffect } from 'react';
import { Todo, Priority } from '../types';

interface AddEditTodoFormProps {
  todo?: Todo | null;
  onSave: (todo: Omit<Todo, 'id' | 'completed'> & { id?: number }) => void;
  onCancel: () => void;
}

const AddEditTodoForm: React.FC<AddEditTodoFormProps> = ({ todo, onSave, onCancel }) => {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.Medium);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (todo) {
      setTask(todo.task);
      setPriority(todo.priority);
      setDueDate(new Date(todo.dueDate).toISOString().split('T')[0]);
    } else {
        setTask('');
        setPriority(Priority.Medium);
        setDueDate(new Date().toISOString().split('T')[0]);
    }
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    onSave({
      id: todo?.id,
      task,
      priority,
      dueDate,
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg animate-fade-in mt-6">
      <h3 className="text-xl font-semibold text-white mb-4">{todo ? 'Edit To-Do' : 'Add To-Do'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task" className="block text-sm font-medium text-gray-300 mb-2">Task</label>
          <input
            type="text"
            id="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
            placeholder="e.g. Pay the electricity bill"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                >
                    {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    required
                />
            </div>
        </div>
        <div className="flex justify-end space-x-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
          >
            {todo ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditTodoForm;
