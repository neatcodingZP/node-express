import express from 'express'
import twoFARoutes from './routes/two_fa.js'

const PORT = process.env.PORT ?? 3000

const app = express()

app.use((req, res, next) => {
    //console.log(req);
    next();
  });

app.use(express.json())

app.use((req, res, next) => setTimeout(next, 50))

app.get('/', (req, res) => {
    res.send('<h1>Hello Express!</h1>')
})

app.use(twoFARoutes)

app.use(express.static('./public', { maxAge: 1000 }))

// app.use(function (req, res, next) {
//     res.set('Cache-control', 'public, max-age=300')
//     //res.set('Cache-control', `no-store`)
//   })


app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
})