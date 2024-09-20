import { Status } from './statusTypes'

export interface Task {
    id: string
    title: string
    description: string
    status: Status
    columnOrder: number
}
