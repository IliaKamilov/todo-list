
export interface ITask {
    title: string
    completed: boolean
    date: Date
    [key: string]: string | boolean | Date
}

export default class LocalDatabase {
    private tasks: ITask[] = []
    constructor() {
        this.init()
    }

    public getTasks() {
        return this.tasks.sort((a: ITask, b: ITask) => +a.date - +b.date) as ITask[]
    }

    public getTask(key: 'title' | 'date', val: string) {
        return this.tasks.find((task: ITask) => task[key] === val)
    }

    public createTask(task: ITask) {
        this.tasks.push({ ...task, date: new Date() })
        this.save()
    }

    public updateTask(task: ITask, update: any) {
        const whiteList = [ 'title', 'completed' ]
        Object.keys(update).map((key: string) => {
            if (whiteList.includes(key)) {
                this.tasks[this.tasks.indexOf(task)][key] = update[key]
            }
            return ''
        })
        this.save()
    }

    public deleteTask(task: ITask, save: boolean = true) {
        const index: number = this.tasks.indexOf(task)
        
        if (index >= 0) {
            this.tasks.splice(index,1)
        }
        if (save) this.save()
    }

    public deleteAll(tasks: ITask[] = []) {
        tasks.forEach((task: ITask) => {
            this.deleteTask(task, false)
        })
        this.save()
    }

    private reset() {
        this.tasks = []
        this.save()
    }

    private save() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
    }

    private init() {
        const localData = JSON.parse(localStorage.getItem('tasks') || '[]')
        this.tasks = localData
    }
}