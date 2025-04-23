import { requestEmail2FA } from "./email_2fa_controller.js"
import { requestGoogleKey } from "./google_2fa_controller.js"
import { requestSms2FA } from "./sms_2fa_controller.js"

let error = {
    success: false,
    code: 400,
    error: "Type is not allowed"
} 

export const preActivate2FA = (req, res) => {
    console.log(`Pre-Activate 2FA, body: ${req.body}`)

    var response = undefined
    if (req.body.type == "google") {
        requestGoogleKey(req, res)
        return
    } else if (req.body.type == "email") {
        requestEmail2FA(req, res)
        return
    } else if (req.body.type == "sms")  {
        requestSms2FA(req, res)
        return
    } else {
        response = error
    }

    res.status(response.code).json(response)
}