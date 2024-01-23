import dotenv from 'dotenv'
import express from 'express'
import expressEjsLayouts from 'express-ejs-layouts'

import twoFARoutes from './server/routes/two_fa.js'
import mainRoutes from './server/routes/main.js'
import appVersionsRoutes from './server/routes/app_versions.js'

import connectDB from './server/config/db.js'

dotenv.config()

const PORT = process.env.PORT ?? 3000

const app = express()

// Connect DB
connectDB();

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

app.use('/versions/', appVersionsRoutes)

// app.use(function (req, res, next) {
//     res.set('Cache-control', 'public, max-age=300')
//     //res.set('Cache-control', `no-store`)
//   })


app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
})