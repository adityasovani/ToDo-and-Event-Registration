import { Task } from './Task'

export class User {
    _id: any
    name: string
    userId: string
    password: string
    tasks: Array<Task>
    archieved: Array<Task>
    message: string
}