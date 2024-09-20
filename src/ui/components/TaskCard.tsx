import { useState } from 'react'
import { Task } from '../../types/taskTypes'

interface TaskCardProps {
    task: Task
    draggable?: boolean
}

export const TaskCard = ({ task, draggable = true }: TaskCardProps) => {
    const [isDragging, setIsDragging] = useState(false)

    const opacityClass = isDragging ? 'opacity-20' : ''

    return (
        <div
            draggable={draggable ? true : false}
            onDragStart={(event) => {
                event.dataTransfer.setData('text/plain', task.id)
                setIsDragging(true)
            }}
            onDragEnd={() => setIsDragging(false)}
            className={`border ${opacityClass} rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300`}
        >
            <h2 className="text-xl font-bold">{task.title}</h2>
            <p className="text-gray-600">{task.description}</p>
        </div>
    )
}

export default TaskCard
