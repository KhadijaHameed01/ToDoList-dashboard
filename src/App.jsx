import  { useState, useRef, useEffect } from 'react';
import { AiFillDelete } from "react-icons/ai";
import { IoIosThumbsUp } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import './App.css'
export default function AList() {
    const [initial, getInitial] = useState("");
    const [iniDescription, setIniDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [category, setCategory] = useState("");
    const [data, setData] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const inputInitRef = useRef(null);

    // Sync with local storage
    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const storedCompleted = JSON.parse(localStorage.getItem("completedTasks")) || [];
        setData(storedTasks);
        setCompletedTasks(storedCompleted);
    }, []);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(data));
        localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    }, [data, completedTasks]);

    const getInput = (event) => {
        getInitial(event.target.value);
    };

    const getDescription = (event) => {
        setIniDescription(event.target.value);
    };

    const getData = () => {
        if (initial || iniDescription) {
            const taskWithDetails = {
                task: initial,
                description: iniDescription,
                priority,
                category,
            };

            if (editIndex !== null) {
                let updatedTasks = [...data];
                updatedTasks[editIndex] = taskWithDetails;
                setData(updatedTasks);
                setEditIndex(null);
            } else {
                setData([...data, taskWithDetails]);
            }

            getInitial("");
            setIniDescription("");
            setPriority("Medium");
            setCategory("");
        }
    };

    const editValue = (index) => {
        const taskToEdit = data[index];
        getInitial(taskToEdit.task);
        setIniDescription(taskToEdit.description);
        setPriority(taskToEdit.priority);
        setCategory(taskToEdit.category);
        setEditIndex(index);
        inputInitRef.current.focus();
    };

    const deleteTask = (index) => {
        let filterData = data.filter((_, i) => i !== index);
        setData(filterData);
    };

    const markAsCompleted = (index) => {
        let completedTask = data[index];
        setCompletedTasks([...completedTasks, completedTask]);
        deleteTask(index);
    };

    return (
        <div className='container'>
            <div className='inputTask'>
                <h1>Task Manager</h1>
                <input 
                    type="text" 
                    className='inputBox' 
                    placeholder='Enter your task' 
                    value={initial} 
                    onChange={getInput} 
                    ref={inputInitRef}
                />
                <textarea 
                    className='inputBox' 
                    placeholder='Enter description' 
                    value={iniDescription} 
                    onChange={getDescription}
                ></textarea>
                <select className='dropdown' value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <input 
                    type="text" 
                    className='inputBox' 
                    placeholder='Enter category (e.g., Work, Personal)' 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                />
                <button className='addTask' onClick={getData}>
                    {editIndex !== null ? "Update Task" : "Add Task"}
                </button>
            </div>

            <div className='taskSections'>
                <h2>To Do List</h2>
                {data.length > 0 ? (
                    data.map((curValue, index) => (
                        <div className='taskData' key={index}>
                            <p><strong>Task:</strong> {curValue.task}</p>
                            <p><strong>Description:</strong> {curValue.description}</p>
                            <p><strong>Priority:</strong> {curValue.priority}</p>
                            <p><strong>Category:</strong> {curValue.category}</p>
                            <div className='flex space-x-4 mt-2'>
                                <AiFillDelete className='icon glow-effect' onClick={() => deleteTask(index)} />
                                <IoIosThumbsUp className='icon glow-effect' onClick={() => markAsCompleted(index)} />
                                <FaRegEdit className='icon glow-effect' onClick={() => editValue(index)} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p><strong>No tasks available</strong></p>
                )}
            </div>

            <div className='completedTaskList'>
                <h2>Completed Tasks</h2>
                {completedTasks.length > 0 ? (
                    completedTasks.map((curValue, index) => (
                        <div className='taskData' key={index}>
                            <p><strong>Task:</strong> {curValue.task}</p>
                            <p><strong>Description:</strong> {curValue.description}</p>
                            <p><strong>Priority:</strong> {curValue.priority}</p>
                            <p><strong>Category:</strong> {curValue.category}</p>
                        </div>
                    ))
                ) : (
                    <p><strong>No completed tasks</strong></p>
                )}
            </div>
        </div>
    );
}

