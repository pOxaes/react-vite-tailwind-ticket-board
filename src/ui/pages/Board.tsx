import { Status } from '../../types/statusTypes'
import { BoardColumn } from '../components/BoardColumn'

export const Board = () => {
    const columns = [
        Status.BACKLOG,
        Status.TODO,
        Status.IN_PROGRESS,
        Status.DONE,
    ]

    const columnClass = `grid-cols-${columns.length}`

    return (
        <div className={`grid ${columnClass} gap-4 border border-red-500`}>
            {columns.map((status) => (
                <BoardColumn key={status} status={status} />
            ))}
        </div>
    )
}
