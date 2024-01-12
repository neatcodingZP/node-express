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

router.get('', main)

router.get('/about', about)



export default router