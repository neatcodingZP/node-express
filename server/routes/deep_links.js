import {Router} from 'express'

const router = Router()

const s1 = (req, res) => {
    res.status(200).json({
        deeplink: "Deep link page s1" 
    })
}

const s2 = (req, res) => {
    res.status(200).json({
        deeplink: "Deep link page s2"
    })
}

// Dummy
router.get(`/s1`, s1)

// List
router.get(`/s1/s2`, s2)




export default router