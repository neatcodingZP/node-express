import {Router} from 'express'

import { addPin2FA, deletePin2FA } from '../controllers/pin_2fa_controller.js'
import { addBiometric2FA, deleteBiometric2FA } from '../controllers/biometric_2fa_controller.js'
import { requestEmail2FA, addEmail2FA, deleteEmail2FA } from '../controllers/email_2fa_controller.js'
import { requestGoogleKey, addGoogle2FA, deleteGoogle2FA } from '../controllers/google_2fa_controller.js'
import { requestSms2FA, addSms2FA, deleteSms2FA } from '../controllers/sms_2fa_controller.js'

import { dummyWith2FA } from '../controllers/dummy_2fa_controller.js'
import { list2FA } from '../controllers/list_2fa_controller.js'

import twoFAState from '../globals/two_fa_state.js'


const router = Router()

const TWO_FA_ROUTE = "2fa"

// Dummy
router.post(`/${TWO_FA_ROUTE}/dummy`, dummyWith2FA)

// List
router.post(`/${TWO_FA_ROUTE}/list`, list2FA)

// PIN
let pinRoute = 'pin'

router.post(`/${TWO_FA_ROUTE}/${pinRoute}`, addPin2FA)

router.delete(`/${TWO_FA_ROUTE}/${pinRoute}`, deletePin2FA)

// Biometric
let biometricRoute = 'biometric'

router.post(`/${TWO_FA_ROUTE}/${biometricRoute}`, addBiometric2FA)

router.delete(`/${TWO_FA_ROUTE}/${biometricRoute}`, deleteBiometric2FA)

// Email
let emailRoute = 'email'

router.get(`/${TWO_FA_ROUTE}/${emailRoute}`, requestEmail2FA)

router.post(`/${TWO_FA_ROUTE}/${emailRoute}`, addEmail2FA)

router.delete(`/${TWO_FA_ROUTE}/${emailRoute}`, deleteEmail2FA)

// Google
let googleRoute = 'google'

router.get(`/${TWO_FA_ROUTE}/${googleRoute}`, requestGoogleKey)

router.post(`/${TWO_FA_ROUTE}/${googleRoute}`, addGoogle2FA)

router.delete(`/${TWO_FA_ROUTE}/${googleRoute}`, deleteGoogle2FA)

// Sms
let smsRoute = 'sms'

router.get(`/${TWO_FA_ROUTE}/${smsRoute}`, requestSms2FA)

router.post(`/${TWO_FA_ROUTE}/${smsRoute}`, addSms2FA)

router.delete(`/${TWO_FA_ROUTE}/${smsRoute}`, deleteSms2FA)



export default router