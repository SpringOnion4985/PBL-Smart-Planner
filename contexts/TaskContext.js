import React, { createContext, useState, useContext } from 'react';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]); // { title, deadline, duration, completed }

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
