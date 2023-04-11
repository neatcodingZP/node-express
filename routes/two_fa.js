import {Router} from 'express'

import { addPin2FA, deletePin2FA } from '../controllers/pin_2fa_controller.js'
import { list2FA } from '../controllers/list_2fa_controller.js'

import twoFAState from '../globals/two_fa_state.js'


const router = Router()

const TWO_FA_ROUTE = "2fa"

router.post(`/${TWO_FA_ROUTE}/list`, list2FA)

let pinRoute = 'pin'

router.post(`/${TWO_FA_ROUTE}/${pinRoute}`, addPin2FA)

router.delete(`/${TWO_FA_ROUTE}/${pinRoute}`, deletePin2FA)


export default router