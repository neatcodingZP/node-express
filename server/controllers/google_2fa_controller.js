import twoFAState from '../../globals/two_fa_state.js'
import TWO_FA_TYPE from '../../globals/two_fa_type.js'
import {is2FARequired} from './two_fa_required_check.js'

import {check2FAParams} from './two_fa_check.js'

let failureNA = {
    success: false,
    code: 403, // Forbidden
    errors: {
        message: "Google 2FA is not available"
    }
}

let successRequestKey = {
    success: true,
    code: 200,
    data: {
        secret_key: "XYZ123XYZ123", //"{{google_2fa_secret_key}}",
        qr_code: "Secret QR code text" //"{{base64_qr_code}}"
    }
}

let success = {
    success: true,
    code: 200,
    data: null
}

let errorAdd = {
    success: false,
    code: 403,
    errors: {
        message: "Failed to add google authentication"
    }
}

let errorDelete = {
    success: false,
    code: 403,
    errors: {
        message: "Failed to delete google authentication",
        details: {
            is_two_factor_auth: true
        }
    }
}

let error2FARequired = {
    success: false,
    code: 406,
    errors: {
        message: "Failed to add/delete google authentication - 2FA required",
        details: {}
    }
}

export const requestGoogleKey = (req, res) => {
    console.log(`requestGoogleKey...`)

    twoFAState.googleOTP = "123456"

    var response = successRequestKey
    successRequestKey.data.google_otp = twoFAState.googleOTP

    res.status(response.code).json(response)
}

export const addGoogle2FA = (req, res) => {
    console.log(`addGoogle2FA...`)

    // {
    //     "one_time_password": "{{google_one_time_password}}"
    // }

    let list = twoFAState.list
    let isAvailable = list.find(element => element.type == TWO_FA_TYPE.GOOGLE) != undefined
    let googleStatus = list.find(element => element.type == TWO_FA_TYPE.GOOGLE)

    let twoFAParams = check2FAParams(req, twoFAState)

    let is2FANeeded = !twoFAParams.withParams && is2FARequired(req, twoFAState.value, isAvailable, googleStatus.is_enabled == false, twoFAState)
    
    if (!is2FANeeded) {
        twoFAState.value = twoFAState.value + 1
    } else {
        error2FARequired.errors.details.allowed_types = 
            list
                .filter(element => element.is_enabled == true)
                .map(element => element.type)

                if (twoFAState.biometric != undefined) {
                    error2FARequired.errors.details.biometric = {
                        uuid: "challenge_uuid",
                        challenge: (Number(twoFAState.biometric.challenge) + Number(twoFAState.biometric.key)).toString()
                    }
                } else {
                    error2FARequired.errors.details.biometric = undefined
                } 
                
                error2FARequired.errors.details.pin_code = twoFAState.pinCode == undefined ? null : twoFAState.pinCode
                error2FARequired.errors.details.email_code = twoFAState.emailCode == undefined ? null : twoFAState.emailCode
                error2FARequired.errors.details.google_otp = twoFAState.googleOTP == undefined ? null : twoFAState.googleOTP                         
    }

    var response = undefined

    let otp = req.body.one_time_password

    if (otp == undefined || otp != twoFAState.googleOTP) {
        response = errorAdd
    } else if (is2FANeeded) {
        response = error2FARequired
    } else if (googleStatus.is_enabled == false) {
        googleStatus.is_enabled = true

        twoFAState.value = twoFAState.value + 1
        //twoFAState.googleOTP = undefined
        
        response = success
    } else {
        response = errorAdd
    }

    res.status(response.code).json(response)
}

export const deleteGoogle2FA = (req, res) => {
    console.log(`deleteGoogle2FA...`)


    let list = twoFAState.list
    let isAvailable = list.find(element => element.type == TWO_FA_TYPE.GOOGLE) != undefined
    let googleStatus = list.find(element => element.type == TWO_FA_TYPE.GOOGLE)

    let twoFAParams = check2FAParams(req, twoFAState)
    console.log(`deleteGoogle2FA, twoFAParams: ${twoFAParams}`)

    let is2FANeeded = !twoFAParams.withParams && is2FARequired(req, twoFAState.value, isAvailable, googleStatus.is_enabled == true, twoFAState)
    
    if (!is2FANeeded) {
        twoFAState.value = twoFAState.value + 1
    } else {
        error2FARequired.errors.details.allowed_types = 
            list
                .filter(element => element.is_enabled == true)
                .map(element => element.type)

                if (twoFAState.biometric != undefined) {
                    error2FARequired.errors.details.biometric = {
                        uuid: "challenge_uuid",
                        challenge: (Number(twoFAState.biometric.challenge) + Number(twoFAState.biometric.key)).toString()
                    }
                } else {
                    error2FARequired.errors.details.biometric = undefined
                }
                
                error2FARequired.errors.details.pin_code = twoFAState.pinCode == undefined ? null : twoFAState.pinCode
                error2FARequired.errors.details.email_code = twoFAState.emailCode == undefined ? null : twoFAState.emailCode
                error2FARequired.errors.details.google_otp = twoFAState.googleOTP == undefined ? null : twoFAState.googleOTP                         
    }


    var response = undefined
    if (!isAvailable) {
        response = failureNA
    } else if (is2FANeeded) {
        response = error2FARequired
    } else if (twoFAParams.withParams && twoFAParams.isError) {
        response = errorDelete
    } else {
        googleStatus.is_enabled = false
        twoFAState.googleOTP = undefined

        response = success
    }

    res.status(response.code).json(response)
}