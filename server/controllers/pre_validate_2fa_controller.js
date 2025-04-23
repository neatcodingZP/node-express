import { requestEmail2FA } from "./email_2fa_controller.js"
import { requestSms2FA } from "./sms_2fa_controller.js"

let success = {
    success: true,
    code: 200,
    data: {
        one_time_uuid: "one_time_uuid"
    }
} 

let successBiometric = {
    success: true,
    code: 200,
    data: {
        one_time_uuid: "one_time_uuid",
        biometric_challenge: "encrypted_challenge" // Необязательный, присутствует с type=biometric
    }
} 

let error = {
    success: false,
    code: 400,
    error: "Type is not allowed"
} 

export const preValidate2FA = (req, res) => {
    console.log(`Pre-Validate 2FA, body: ${req.body}`)

    var response = undefined
    if (req.body.type == "email") {
        requestEmail2FA(req, res)
        return
    }  else if (req.body.type == "sms") {
        requestSms2FA(req, res)
        return
    } else if (req.body.type == "biometric") {
        // TODO: not implemented
        response = successBiometric
    } else {
        response = error
    }
    
    res.status(response.code).json(response)
}