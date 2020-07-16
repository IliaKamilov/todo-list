import React from 'react'
import { ITask } from '../db'
import { makeStyles, Theme } from '@material-ui/core'
import { 
    CheckBoxOutlineBlankOutlined as UncheckedIcon, 
    CheckBox as CheckedIcon,
    Edit as EditIcon
} from '@material-ui/icons'
import clsx from 'clsx'
import { db } from '..'
import CreateTask from './CreateTask'

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        flexDirection: 'row',
        height: '45px',
        [theme.breakpoints.down(600)]: {
            height: '65px',
        }
    },
    completeIcon: {
        background: 0,
        width: '45px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        flex: 1,
        justifyContent: 'center',
        padding: '6px 16px',
        boxSizing: 'border-box'
    },
    actions: {
        flexDirection: 'row',
        height: '100%',
        position: 'relative',
        '& button': {
            background: 0,
            width: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#333'
        }
    }
}))

const TaskItem: React.FC<{ data: ITask, onChange: () => void }> = ({ data, onChange }) => {
    const classes = useStyles()
    const [ edit, setEdit ] = React.useState<boolean>(false)

    const handleCompleteTask = (e: React.MouseEvent<HTMLButtonElement>) => {
        db.updateTask(data, { completed: !data.completed })
        return onChange()
    }

    const handleTaskDeleted = () => {
        setEdit(false)
        return onChange()
    }

    if (edit) {
        return <CreateTask onSubmit={handleTaskDeleted} onCancel={() => setEdit(false)} data={data} />
    }

    return (
        <div className={clsx(classes.container, 'taskItem')}>
            <button className={classes.completeIcon} onClick={handleCompleteTask}>
                {
                    data.completed 
                    ? <CheckedIcon />
                    : <UncheckedIcon />
                }
            </button>
            <div className={classes.title}>{ data.title }</div>
            <div className={classes.actions}>
                {
                    !data.completed && 
                    <button onClick={e => setEdit(true)}>
                        <EditIcon />
                    </button>
                }
            </div>
        </div>
    )
}

export default TaskItem