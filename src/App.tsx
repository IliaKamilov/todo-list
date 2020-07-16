import React from 'react';
import { makeStyles, Theme, useMediaQuery } from '@material-ui/core'
import clsx from 'clsx'
import './App.css';
import { ITask } from './db';
import TasksList from './components/TasksList';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down(600)]: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start'
    }
  },
  wrapper: {
    width: '600px',
    boxShadow: '0 3px 5px rgba(0,0,0,.3)',
    borderRadius: '10px',
    overflow: 'hidden',
    [theme.breakpoints.down(600)]: {
      width: '100%',
      height: '100%',
      border: 0,
      boxShadow: 'none',
      borderRadius: 0,
    }
  },
  header: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '45px',
    background: '#4197a8',
    userSelect: 'none',
    '& h1': {
      fontSize: '1.345rem',
      color: '#fff',
      fontWeight: 500,
      lineHeight: '100%',
      padding: '6px 16px',
      boxSizing: 'border-box',
    },
    [theme.breakpoints.down(600)]: {
      height: '65px'
    }
  },
  fixedHeader: {
    position: 'fixed',
    width: '100%',
    zIndex: 1200,
  },
  body: {
    position: 'relative',
    height: 'calc(100% - 45px)',
    [theme.breakpoints.down(600)]: {
      height: 'calc(100% - 65px)',
      marginTop: '65px'
    }
  },
  footer: {}
}))

const App: React.FC<{ data: ITask[] }> = ({ data }) => {
  const classes = useStyles()
  const [ tasks, setTasks ] = React.useState<ITask[]>(data)

  const handleTasksChange = (newState: ITask[]) => {
    setTasks(newState)
  }

  const ResponsiveHeader: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const smallScreen = useMediaQuery('(max-width: 600px)')
    return (
      <div className={clsx(classes.header, smallScreen && classes.fixedHeader)}>
        { children }
      </div>
    )
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <ResponsiveHeader>
          <h1 className="title">משימות</h1>
        </ResponsiveHeader>
        <div className={classes.body}>
          <TasksList tasks={tasks} onChange={handleTasksChange} />
        </div>
      </div>
    </div>
  )
}

export default App;
