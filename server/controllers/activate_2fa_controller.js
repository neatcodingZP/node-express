import { addBiometric2FA } from './biometric_2fa_controller.js'
import { addEmail2FA } from './email_2fa_controller.js'
import { addGoogle2FA } from './google_2fa_controller.js'
import { addPin2FA } from './pin_2fa_controller.js'
import { addSms2FA } from './sms_2fa_controller.js'

export const activate2FA = (req, res) => {
    console.log(`activate2FA, body: ${req.body}, type: ${req.body.type}`)

    if (req.body.type == "pin") {
        console.log(`activate2FA PIN, pin: ${req.body.pin}`)
        addPin2FA(req, res)
    } else if (req.body.type == "google") {
        addGoogle2FA(req, res)
    } else if (req.body.type == "email") {
        addEmail2FA(req, res)
    } else if (req.body.type == "sms") {
        addSms2FA(req, res)
    } else if (req.body.type == "biometric") {
        addBiometric2FA(req, res)
    } else {
        res.status(400).json({
            error: "Type is not implemented"
        })
    }
}