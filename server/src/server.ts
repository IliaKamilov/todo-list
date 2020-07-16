import Express from 'express'
import path from 'path'

const app = Express()

const port: string | number = process.env.PORT || 5000

app.use(Express.static(path.join(__dirname, '../../build')))

app.get('*', (req: Express.Request, res: Express.Response) => {
    res.sendFile('index.html')
})

app.listen(port, (): void => {
    console.log(`server listening *:${port}`)
})