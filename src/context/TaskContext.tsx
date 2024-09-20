import { createContext, useContext, useState, ReactNode } from 'react'
import { Task } from '../types/taskTypes'
import { Status } from '../types/statusTypes'

export type updatableTaskProperties = Pick<Task, 'status' | 'columnOrder'>

interface TaskContextType {
    tasks: Task[]
    addTask: (task: Task) => void
    removeTask: (id: string) => void
    updateTaskStatus: (id: string, args: updatableTaskProperties) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

interface TaskProviderType {
    children: ReactNode
}

const defaultTasks: Task[] = []
const countByStatus = {
    [Status.BACKLOG]: 0,
    [Status.TODO]: 0,
    [Status.IN_PROGRESS]: 0,
    [Status.DONE]: 0,
}

for (let i = 0; i < 400; i++) {
    const randomStatusIndex = Math.floor(Math.random() * 4)
    let status = Status.BACKLOG
    if (randomStatusIndex === 1) {
        status = Status.TODO
    } else if (randomStatusIndex === 2) {
        status = Status.IN_PROGRESS
    } else if (randomStatusIndex === 3) {
        status = Status.DONE
    }
    countByStatus[status]++
    defaultTasks.push({
        id: `ABC-${i}`,
        title: `Task ${i}`,
        description: `Description ${i}`,
        status,
        columnOrder: countByStatus[status],
    })
}

export const TaskProvider = ({ children }: TaskProviderType) => {
    const [tasks, setTasks] = useState<Task[]>(defaultTasks)

    const addTask = (task: Task) => {
        setTasks([...tasks, task])
    }

    const removeTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id))
    }

    const updateTaskStatus = (
        taskId: string,
        data: updatableTaskProperties
    ) => {
        setTasks((prevTasks) => {
            const updatedTasks = [...prevTasks]

            const taskIndex = updatedTasks.findIndex(
                (task) => task.id === taskId
            )

            if (taskIndex === -1) return prevTasks

            const oldStatus = updatedTasks[taskIndex].status

            updatedTasks[taskIndex] = {
                ...updatedTasks[taskIndex],
                status: data.status,
                columnOrder: data.columnOrder,
            }

            const a = updatedTasks.map((task) => {
                if (task.status === oldStatus && task.id !== taskId) {
                    return {
                        ...task,
                        columnOrder:
                            task.columnOrder > data.columnOrder
                                ? task.columnOrder - 1
                                : task.columnOrder,
                    }
                } else if (task.status === status && task.id !== taskId) {
                    return {
                        ...task,
                        columnOrder:
                            task.columnOrder >= data.columnOrder
                                ? task.columnOrder + 1
                                : task.columnOrder,
                    }
                }
                return task
            })

            console.log(JSON.stringify(a, null, 2))

            return a
        })
    }

    return (
        <TaskContext.Provider
            value={{ tasks, addTask, removeTask, updateTaskStatus }}
        >
            {children}
        </TaskContext.Provider>
    )
}

export const useTaskContext = () => {
    const context = useContext(TaskContext)
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider')
    }
    return context
}
