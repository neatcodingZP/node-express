import dotenv from 'dotenv';
import express from 'express'
import expressEjsLayouts from 'express-ejs-layouts';

import twoFARoutes from './server/routes/two_fa.js'
import mainRoutes from './server/routes/main.js'

dotenv.config()

const PORT = process.env.PORT ?? 3000

const app = express()

// Static
app.use(express.static('./public', { maxAge: 1000 }))

// Templating engine
app.use(expressEjsLayouts)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

app.use((req, res, next) => {
    //console.log(req);
    next();
  });

app.use(express.json())

app.use((req, res, next) => setTimeout(next, 50))

app.use('/', mainRoutes)

app.use(twoFARoutes)

// app.use(function (req, res, next) {
//     res.set('Cache-control', 'public, max-age=300')
//     //res.set('Cache-control', `no-store`)
//   })


app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
})