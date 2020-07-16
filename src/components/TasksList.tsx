import React from 'react'
import { ITask } from '../db'
import { makeStyles, Theme } from '@material-ui/core'
import clsx from 'clsx'
import CreateTask from './CreateTask'
import { Add as AddIcon } from '@material-ui/icons'
import { db } from '..'
import TaskItem from './TaskItem'

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        width: '100%',
        height: '100%',
        position: 'relative',
        overflowY: 'auto',
        minHeight: '445px',
        maxHeight: 'calc(100% -45px)',
    },
    header: {
        zIndex: 1100,
        position: 'relative',
        flexDirection: 'row',
        height: '45px',
        width: '100%',
        borderBottom: '.5px solid #b3d5dc',
        fontSize: '0.875rem',
        background: '#fff',
        '& button': {
            width: '100%',
            padding: '10px 16px',
            boxSizing: 'border-box',
            background: 0,
            color: '#4197a8',
            fontWeight: 400
        },
        '& button.selected': {
            background: '#b3d5dc',
            color: '#3b8897',
            fontWeight: 500
        },
        [theme.breakpoints.down(600)]: {
            height: '65px'
        }
    },
    list: {
        position: 'relative',
        flexDirection: 'column',
        minHeight: '400px',
        maxHeight: 'calc(400px)',
        [theme.breakpoints.down(600)]: {
            height: '100%',
            maxHeight: '100%'
        },
        '& .taskItem:not(:last-child)': {
            borderBottom: '.5px solid #eee'
        }
    },
    titleItem: {
        padding: '6px 16px',
        margin: '20px auto',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#888'
    },
    createButton: {
        zIndex: 1200,
        background: '#4caf50',
        margin: '6px auto',
        color: '#fff',
        fontSize: '0.875rem',
        padding: '6px 16px',
        borderRadius: '8px',
        fontWeight: 500,
        lineHeight: 2.25,
        [theme.breakpoints.down(600)]: {
            marginTop: '16px'
        }
    },
    headerCreateButton: {
        zIndex: 1200,
        position: 'absolute',
        top: '-45px',
        left: 0,
        height: '45px',
        fontSize: '1rem',
        fontWeight: 500,
        padding: '6px 16px',
        boxSizing: 'border-box',
        background: 0,
        color: '#fff',
        cursor: 'pointer',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        [theme.breakpoints.down(600)]: {
            height: '65px',
            position: 'fixed',
            top: 0
        }
    },
    deleteAllButton: {
        color: 'red',
        background: 0,
        margin: '16px auto',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
}))

const TasksList: React.FC<{ tasks: ITask[], onChange: (newState: ITask[]) => void }> = ({ tasks = [], onChange }) => {
    const classes = useStyles()
    const [ filtered, setFiltered ] = React.useState<{ filter: string, tasks: ITask[] }>({ filter: 'כל המשימות', tasks })
    const [ newTask, setNewTask ] = React.useState<boolean>(false)

    const filters = [ 'כל המשימות', 'משימות פתוחות', 'משימות שהושלמו' ]
    const handleItemsFilter = (filter: string) => {
        let items: ITask[] = []
        const index = filters.indexOf(filter)
        
        if (index < 0) return

        switch (index) {
            case 0: items = tasks; break;
            case 1: items = tasks.filter((task: ITask) => !task.completed); break;
            case 2: items = tasks.filter((task: ITask) => task.completed); break;
        }
        
        setFiltered({ ...filtered, filter, tasks: items })
    }

    const ItemsFilter = () => {

        return (
            <>
                {
                    filters.map((filter: string, i: number) => (
                        <button className={clsx('', filtered.filter === filter && 'selected')} onClick={e => handleItemsFilter(filter)} key={i}>{filter}</button>
                    ))
                }
            </>
        )
    }

    const handleTasksChange = () => {
        setNewTask(false)
        onChange(db.getTasks())
        handleItemsFilter(filtered.filter)
    }

    const handleDeleteAll = (e: React.MouseEvent<HTMLButtonElement>) => {
        db.deleteAll(filtered.tasks)
        handleTasksChange()
    }

    return (
        <>
            <div className={classes.container}>
                {
                    !newTask &&
                    <>
                        <div className={classes.header}>
                            <ItemsFilter />
                        </div>
                        {
                            filtered.tasks.length > 0 && <button className={classes.deleteAllButton} onClick={handleDeleteAll}>מחק הכל</button>
                        }
                    </>
                }
                <div className={classes.list}>
                    {
                        !newTask && filtered.tasks.length === 0
                        ? <div className={classes.titleItem}>
                            אין משימות
                        </div> 
                        : filtered.tasks.map((task: ITask, i: number) => <TaskItem key={i} data={task} onChange={handleTasksChange} />)
                    }
                    {
                        newTask && <CreateTask onSubmit={handleTasksChange} onCancel={() => setNewTask(false)} />
                    }
                    {
                        !newTask && filtered.filter !== 'משימות שהושלמו' && <button onClick={e => setNewTask(true)} className={classes.createButton}>משימה חדשה</button>
                    }
                </div>
            </div>
            {
                !newTask && filtered.filter !== 'משימות שהושלמו' &&
                <button className={classes.headerCreateButton} onClick={e => setNewTask(true)}>
                    <AddIcon />
                </button>
            }
        </>
    )
}

export default TasksList