import { deleteBiometric2FA } from './biometric_2fa_controller.js'
import { deleteEmail2FA } from './email_2fa_controller.js'
import { deleteGoogle2FA } from './google_2fa_controller.js'
import { addPin2FA, deletePin2FA } from './pin_2fa_controller.js'
import { deleteSms2FA } from './sms_2fa_controller.js'

export const deactivate2FA = (req, res) => {
    console.log(`deactivate 2FA, body: ${req.query}`)

    if (req.query.type == "pin") {
        deletePin2FA(req, res)
    } else if (req.query.type == "google") {
        deleteGoogle2FA(req, res)
    } else if (req.query.type == "email") {
        deleteEmail2FA(req, res)
    } else if (req.query.type == "sms") {
        deleteSms2FA(req, res)
    } else if (req.query.type == "biometric") {
       deleteBiometric2FA(req, res)
    } else {
        res.status(400).json({
            error: "Type is not implemented"
        })
    }
}