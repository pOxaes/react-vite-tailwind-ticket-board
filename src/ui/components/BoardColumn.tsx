import { Fragment, useMemo, useRef, useState } from 'react'
import { Status } from '../../types/statusTypes'
import { useTaskContext } from '../../context/TaskContext'
import TaskCard from './TaskCard'

interface BoardColumnProps {
    status: Status
}

export const BoardColumn = ({ status }: BoardColumnProps) => {
    const { tasks, updateTaskStatus } = useTaskContext()
    const [isDraggedOver, setIsDraggedOver] = useState(false)

    const filteredTasks = useMemo(() => {
        return tasks
            .filter((task) => task.status === status)
            .sort((a, b) => a.columnOrder - b.columnOrder)
    }, [tasks, status])

    const overClassname = isDraggedOver ? 'bg-black' : ''

    function onDragOver(ev: React.DragEvent<HTMLDivElement>) {
        ev.preventDefault()
    }

    const cardsRef = useRef<{ [key: string]: HTMLDivElement }>({})

    const onDrop = (
        columnOrder: number,
        targetId: string | null,
        event: React.DragEvent<HTMLDivElement>
    ) => {
        setIsDraggedOver(false)
        const taskId = event.dataTransfer.getData('text/plain')
        if (targetId) {
            const ref = cardsRef.current[targetId]
            if (ref) {
                const boundingClientRect = ref.getBoundingClientRect()
                const midY =
                    boundingClientRect.top + boundingClientRect.height / 2
                if (event.clientY > midY) {
                    columnOrder++
                }
            }
        }

        if (!taskId || taskId === '') return
        updateTaskStatus(taskId, { status: status, columnOrder })
    }

    return (
        <div className="flex flex-col">
            <p>{status}</p>
            <div
                className={`flex-1 ${overClassname} flex flex-col border border-red-500`}
                onDragEnter={() => setIsDraggedOver(true)}
                onDragLeave={() => setIsDraggedOver(false)}
            >
                {filteredTasks.map((task) => (
                    <Fragment key={task.id}>
                        <div
                            ref={(element) => {
                                if (element && !cardsRef.current[task.id]) {
                                    cardsRef.current[task.id] = element
                                }
                            }}
                            className="padding-10 border border-green-500"
                            onDragOver={onDragOver}
                            onDrop={onDrop.bind(
                                null,
                                task.columnOrder,
                                task.id
                            )}
                        >
                            <TaskCard key={task.id} task={task} />
                        </div>
                        <div
                            className="border border-blue-500 background-blue-200 h-3"
                            onDragOver={onDragOver}
                            onDrop={onDrop.bind(
                                null,
                                task.columnOrder + 1,
                                null
                            )}
                        />
                    </Fragment>
                ))}
                <div
                    className="flex-1 border border-yellow-500 background-blue-200 h-3"
                    onDragOver={onDragOver}
                    onDrop={onDrop.bind(null, filteredTasks.length + 1, null)}
                />
            </div>
        </div>
    )
}
