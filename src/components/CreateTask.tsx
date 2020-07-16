import React from 'react'
import { 
    Cancel as CancelIcon, 
    Check as ConfirmIcon,
    Delete as DeleteIcon
} from '@material-ui/icons'
import { ITask } from '../db'
import { makeStyles, Theme } from '@material-ui/core'
import { db } from '..'

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        zIndex: 1300,
        flexDirection: 'row',
        borderBottom: '.5px solid #eee',
        height: '45px',
        '& input': {
            width: '100%',
            height: '100%',
            padding: '6px 16px',
            boxSizing: 'border-box'
        },
        '& button': {
            background: '#fff',
            color: '#333',
            minWidth: '45px',
            height: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        '& button:disabled': {
            color: '#bbb'
        },
        [theme.breakpoints.down(600)]: {
            height: '65px'
        }
    },
    errorBubble: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        paddingRight: '16px',
        color: 'red',
        fontSize: '0.875rem'
    },
    wrapper: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,.1)',
        zIndex: 1200,
    }
}))

const CreateTask: React.FC<{ onSubmit: () => void, onCancel: () => void, data?: ITask }> = ({ onSubmit, onCancel, data }) => {
    const classes = useStyles()
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const [ state, setState ] = React.useState<ITask>(data || {
        title: '',
        completed: false,
        date: new Date()
    })
    const [ error, setError ] = React.useState<null | string>(null)

    React.useEffect(() => {
        inputRef.current?.focus()
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isExsist = db.getTask('title', e.currentTarget.value)
        if (isExsist && isExsist.date !== data?.date) {
            setError('קיימת משימה עם כותרת זהה')
        } else {
            setError(null)
        }
        setState({ ...state, title: e.currentTarget.value })
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        db.deleteTask(state)
        return onSubmit()
    }

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.which === 13) return handleSubmit()
    }

    const handleSubmit = () => {
        if (error) return
        if (data) db.updateTask(data, state)
        else db.createTask({ ...state, date: new Date() })

        return onSubmit()
    }

    return (
        <>
            <div className={classes.container}>
                <input ref={inputRef} type="text" value={state.title} onKeyUp={handleKeyUp} onChange={handleChange} placeholder="כותרת" />
                {
                    error && <div className={classes.errorBubble}>{error}</div>
                }
                {
                    state.title &&
                    <button disabled={!Boolean(state.title) || Boolean(error)} onClick={e => handleSubmit()}>
                        <ConfirmIcon />
                    </button>
                }
                {
                    data 
                    ? <button onClick={handleDelete}>
                        <DeleteIcon />
                    </button>
                    : <button onClick={e => onCancel()}>
                        <CancelIcon />
                    </button>
                }
            </div>
            <div className={classes.wrapper} onClick={e => onCancel()}></div>
        </>
    )
}

export default CreateTask