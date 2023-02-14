import React, { useEffect, useState } from 'react'
import Task from './Task'
import TaskForm from "./TaskForm"
import { toast } from "react-toastify"
import axios from "axios"
import { URL } from "../App"
import loadingImg from "../assets/loader.gif"
const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [taskID, setTaskID] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    completed: false
  })
  const { name } = formData
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const getTasks = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(`${URL}/v1/tasks/`)
      setTasks(data)
      setIsLoading(false)
    } catch (error) {
      toast.error(error.message)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getTasks()
  }, [])


  useEffect(() => {
    const cTask = tasks.filter((task) => {
      return task.completed === true
    })
    setCompletedTasks(cTask)
  }, [tasks])

  const createTask = async (e) => {
    e.preventDefault()
    if (name === "") {
      return toast.error("Input field cannot be empty");
    }
    try {
      await axios.post(`${URL}/v1/tasks/`, formData)
      toast.success("Task added successfully")
      setFormData({ ...formData, name: "" })
      getTasks()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/v1/task/${id}`)
      getTasks()
    } catch (error) {
      toast.error(error.message)
    }
  }
  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: false })
    setTaskID(task._id)
    setIsEditing(true)
  }

  const updateTask = async (e) => {
    e.preventDefault()
    if (name === "") {
      return toast.error("Input field cannot be empty")
    }
    try {
      await axios.put(`${URL}/v1/task/${taskID}`, formData)
      setFormData({ ...formData, name: "" })
      getTasks()
      setIsEditing(false)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true
    }
    try {
      await axios.put(`${URL}/v1/task/${task._id}`, newFormData)
      getTasks()
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm name={name} handleInputChange={handleInputChange}
        createTask={createTask} isEditing={isEditing} updateTask={updateTask} />
      {tasks.length > 0 && (
        <div className='--flex-between --pb'>
          <p>
            <b>Total tasks:</b>{tasks.length}
          </p>
          <p>
            <b>Completed tasks:</b> {completedTasks.length}
          </p>
        </div>
      )}

      <hr />
      {
        isLoading && (
          <div className='--flex-center'>
            <img src={loadingImg} alt="loading" />
          </div>
        )
      }
      {
        !isLoading && tasks.length === 0 ? (
          <p className='--py'>No task added</p>
        ) : (<>
          {
            tasks.map((task, index) => {
              return (
                <Task key={task._id} task={task}
                  index={index}
                  deleteTask={deleteTask}
                  getSingleTask={getSingleTask}
                  setToComplete={setToComplete} />
              )
            })
          }
        </>)
      }
    </div>
  )
}

export default TaskList