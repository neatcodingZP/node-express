import twoFAState from '../../globals/two_fa_state.js'
import TWO_FA_TYPE from '../../globals/two_fa_type.js'
import {is2FARequired} from './two_fa_required_check.js'

import {check2FAParams} from './two_fa_check.js'

let success = {
    success: true,
    code: 200,
    data: null
} 

let failureNA = {
    success: false,
    code: 403, // Forbidden
    errors: {
        message: "PIN 2FA is not available"
    }
}

let failurePinIsRequired = {
    success: false,
    code: 400, // Forbidden
    errors: {
        message: "PIN is required"
    }
}

let failure2FARequired = {
    success: false,
    code: 406,
    errors: {
        message: "Two-factor authentication required",
        details: {
            allowed_types: [
                "pin", // Необязательный, присутствует если активировано
                "biometric", // Необязательный, присутствует если активировано
                "google", // Необязательный, присутствует если активировано
                "email" // Необязательный, присутствует если активировано
            ]
        }
    }
}


export const addPin2FA = (req, res) => {
    console.log(`twoFAState.value: ${twoFAState.value}`)

    let list = twoFAState.list
    let isAvailable = list.find(element => element.type == TWO_FA_TYPE.PIN) != undefined
    let pinStatus = list.find(element => element.type == TWO_FA_TYPE.PIN)

    let twoFAParams = check2FAParams(req, twoFAState)

    let pin = req.body.pin

    let is2FANeeded = 
    pin != undefined &&
    !twoFAParams.withParams && 
    is2FARequired(req, twoFAState.value, isAvailable, pinStatus.is_enabled == false, twoFAState)
    

    if (!is2FANeeded) {
        twoFAState.value = twoFAState.value + 1
    } else {
        failure2FARequired.errors.details.allowed_types = 
            list
                .filter(element => element.is_enabled == true)
                .map(element => element.type)

                if (twoFAState.biometric != undefined) {
                    failure2FARequired.errors.details.biometric = {
                        uuid: "challenge_uuid",
                        challenge: (Number(twoFAState.biometric.challenge) + Number(twoFAState.biometric.key)).toString()
                    }
                } else {
                    failure2FARequired.errors.details.biometric = undefined
                } 
                
                failure2FARequired.errors.details.pin_code = twoFAState.pinCode == undefined ? null : twoFAState.pinCode
                failure2FARequired.errors.details.email_code = twoFAState.emailCode == undefined ? null : twoFAState.emailCode
                failure2FARequired.errors.details.google_otp = twoFAState.googleOTP == undefined ? null : twoFAState.googleOTP
                failure2FARequired.errors.details.sms_code = twoFAState.smsCode == undefined ? null : twoFAState.smsCode                          
    }

    if (isAvailable && pin != undefined && !is2FANeeded && !twoFAParams.isError && pinStatus.is_enabled == false) {
        pinStatus.is_enabled = true
        twoFAState.pinCode = pin
    }

    var response = undefined
    if (!isAvailable) {
        response = failureNA
    } else if (pin == undefined) {
        response = failurePinIsRequired
    } else if (is2FANeeded) {
        response = failure2FARequired
    } else if (twoFAParams.withParams && twoFAParams.isError) {
        response = failureWrongPin
    } else {
        response = success
    }

    res.status(response.code).json(response)
}

let failureWrongPin = {
    success: false,
    code: 403, // Forbidden
    errors: {
        message: "Wrong PIN code",
        details: {
            is_two_factor_auth: true
        }
    }
}

export const deletePin2FA = (req, res) => {
    console.log(`twoFAState.value: ${twoFAState.value}`)
    
    let list = twoFAState.list
    let isAvailable = list.find(element => element.type == TWO_FA_TYPE.PIN) != undefined
    let pinStatus = list.find(element => element.type == TWO_FA_TYPE.PIN)

    let twoFAParams = check2FAParams(req, twoFAState)

    let is2FANeeded = !twoFAParams.withParams && is2FARequired(req, twoFAState.value, isAvailable, pinStatus.is_enabled == true, twoFAState)
    
    if (!is2FANeeded) {
        twoFAState.value = twoFAState.value + 1
    } else {
        failure2FARequired.errors.details.allowed_types = 
            list
                .filter(element => element.is_enabled == true)
                .map(element => element.type)

                if (twoFAState.biometric != undefined) {
                    failure2FARequired.errors.details.biometric = {
                        uuid: "challenge_uuid",
                        challenge: (Number(twoFAState.biometric.challenge) + Number(twoFAState.biometric.key)).toString()
                    }
                } else {
                    failure2FARequired.errors.details.biometric = undefined
                }  
                
                failure2FARequired.errors.details.pin_code = twoFAState.pinCode == undefined ? null : twoFAState.pinCode
                failure2FARequired.errors.details.email_code = twoFAState.emailCode == undefined ? null : twoFAState.emailCode
                failure2FARequired.errors.details.google_otp = twoFAState.googleOTP == undefined ? null : twoFAState.googleOTP
                failure2FARequired.errors.details.sms_code = twoFAState.smsCode == undefined ? null : twoFAState.smsCode                           
    }

    if (isAvailable && !is2FANeeded && !twoFAParams.isError && pinStatus.is_enabled == true) {
        pinStatus.is_enabled = false
        twoFAState.pinCode = undefined
    }

    var response = undefined
    if (!isAvailable) {
        response = failureNA
    } else if (is2FANeeded) {
        response = failure2FARequired
    } else if (twoFAParams.withParams && twoFAParams.isError) {
        response = failureWrongPin
    } else {
        response = success
    }

    res.status(response.code).json(response)
}