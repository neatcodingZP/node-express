import {Router} from 'express'

const router = Router()

// Main page
const main = (req, res) => {
    console.log(`main page`)

    const locals = {
        title: 'Neatcoding',
        description: 'Mobile app development and support'
    }

    //res.send('<h1>Hello Express!</h1>')
    res.render('index', { locals } )
}

// About page
const about = (req, res) => {
    console.log(`about page`)

    const locals = {
        title: 'Neatcoding',
        description: 'About mobile app development and support'
    }
    res.render('about', { locals } )
}

// Login page
const login = (req, res) => {
    console.log(`login page`)

    const locals = {
        title: 'Neatcoding',
        description: 'Dummy login page'
    }
    res.render('login', { locals } )
}

router.get('', main)

router.get('/about', about)

router.get('/login', login)


export default router