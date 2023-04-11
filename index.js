import express from 'express'
import twoFARoutes from './routes/two_fa.js'

const PORT = process.env.PORT ?? 3000

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Hello Express!</h1>')
})

app.use(twoFARoutes)


app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
})