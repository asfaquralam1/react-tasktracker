import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import About from "./component/About";
import AddTask from "./component/AddTask";
import Footer from "./component/Footer";
import Header from './component/Header'
import Tasks from './component/Tasks';

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () =>{
      const tasksFromServer = await fatchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  },[])

  //fetch tasks
  const fatchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
   return data
  }

  //fetch task
  const fatchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
   return data
  }

  //Add Task
  const addTask = async(task) => {
    // eslint-disable-next-line 
    const res = await fetch(`http://localhost:5000/tasks/`,{
      method: 'POST',
      headers: {
        'Content-type' : 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()
    setTasks([...tasks, data])
    // const id = Math.floor(Math.random() * 1000) + 1
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])
  }
  //Delete Task
  const deleteTask = async(id) => {

    await fetch(`http://localhost:5000/tasks/${id}`,{
      method: 'DELETE',
    })

    setTasks(tasks.filter((task) => task.id !==
      id))
  }

  //Toogle Reminder
  const toggleReminder = async(id) => {

    const taskToTOggle = await fatchTask(id)
    const updatetask = {...taskToTOggle, reminder: !taskToTOggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`,{
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updatetask)
    })

    const data = await res.json()
    setTasks(tasks.map((task) =>
      task.id === id ? {
        ...task, reminder:
          data.reminder
      } : task
    )
    )
  }

  return (
    <Router>
      <div className='container'>
        <Header
          onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask}
        />
        <Routes>
          <Route
            path='/'
            element={
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                {tasks.length > 0 ? (
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    onToggle={toggleReminder}
                  />
                ) : (
                  'No Tasks To Show'
                )}
              </>
            }
          />
          <Route path='/about' element={<About/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App;
