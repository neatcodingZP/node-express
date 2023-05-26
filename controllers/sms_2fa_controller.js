import twoFAState from '../globals/two_fa_state.js'
import TWO_FA_TYPE from '../globals/two_fa_type.js'
import {is2FARequired} from './two_fa_required_check.js'

import {check2FAParams} from './two_fa_check.js'

let failureNA = {
    success: false,
    code: 403, // Forbidden
    errors: {
        message: "SMS 2FA is not available"
    }
}

let successRequest = {
    success: true,
    code: 200,
    data: {
        uuid: "sms_uuid",
        symbols_count: 4,
        expire_in: 30,
        repeat_in: 40
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
        message: "Failed to add SMS authentication"
    }
}

let errorDelete = {
    success: false,
    code: 403,
    errors: {
        message: "Failed to delete SMS authentication",
        details: {
            is_two_factor_auth: true
        }
    }
}

let error2FARequired = {
    success: false,
    code: 406,
    errors: {
        message: "Failed to add/delete SMS authentication - 2FA required",
        details: {}
    }
}

export const requestSms2FA = (req, res) => {
    console.log(`requestSms2FA, twoFAState.value: ${twoFAState.value}`)

    twoFAState.smsCode = "1234"

    var response = successRequest
    successRequest.data.sms_code = twoFAState.smsCode

    res.status(response.code).json(response)
}

export const addSms2FA = (req, res) => {
    console.log(`addSms2FA, twoFAState.value: ${twoFAState.value}`)

    // {
    //     "uuid": "{{uuid}}",
    //     "one_time_password": "{{email_one_time_password}}"
    // }

    let list = twoFAState.list
    let isAvailable = list.find(element => element.type == TWO_FA_TYPE.SMS) != undefined
    let smsStatus = list.find(element => element.type == TWO_FA_TYPE.SMS)

    let twoFAParams = check2FAParams(req, twoFAState)

    let is2FANeeded = !twoFAParams.withParams && is2FARequired(req, twoFAState.value, isAvailable, smsStatus.is_enabled == false, twoFAState)
    
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
        error2FARequired.errors.details.sms_code = twoFAState.smsCode == undefined ? null : twoFAState.smsCode              
    }

    var response = undefined

    let otp = req.body.one_time_password

    if (otp == undefined || otp != twoFAState.smsCode) {
        response = errorAdd
    } else if (is2FANeeded) {
        response = error2FARequired
    } else if (smsStatus.is_enabled == false) {
        smsStatus.is_enabled = true

        twoFAState.value = twoFAState.value + 1
        twoFAState.smsCode = undefined
        
        response = success
    } else {
        response = errorAdd
    }

    res.status(response.code).json(response)
}

export const deleteSms2FA = (req, res) => {
    console.log(`deleteSms2FA, twoFAState.value: ${twoFAState.value}`)


    let list = twoFAState.list
    let isAvailable = list.find(element => element.type == TWO_FA_TYPE.SMS) != undefined
    let smsStatus = list.find(element => element.type == TWO_FA_TYPE.SMS)

    let twoFAParams = check2FAParams(req, twoFAState)
    console.log(`deleteSms2FA, twoFAParams: ${twoFAParams}`)

    let is2FANeeded = !twoFAParams.withParams && is2FARequired(req, twoFAState.value, isAvailable, smsStatus.is_enabled == true, twoFAState)
    
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
                error2FARequired.errors.details.sms_code = twoFAState.smsCode == undefined ? null : twoFAState.smsCode               
    }


    var response = undefined
    if (!isAvailable) {
        response = failureNA
    } else if (is2FANeeded) {
        response = error2FARequired
    } else if (twoFAParams.withParams && twoFAParams.isError) {
        response = errorDelete
    } else {
        smsStatus.is_enabled = false
        twoFAState.smsCode = undefined

        response = success
    }

    res.status(response.code).json(response)
}