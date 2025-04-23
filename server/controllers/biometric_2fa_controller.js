import twoFAState from '../../globals/two_fa_state.js'
import TWO_FA_TYPE from '../../globals/two_fa_type.js'
import {is2FARequired} from './two_fa_required_check.js'

import {check2FAParams} from './two_fa_check.js'

let failureNA = {
    success: false,
    code: 403, // Forbidden
    errors: {
        message: "Biometric 2FA is not available"
    }
}

let successAdd = {
    success: true,
    code: 200,
    data: null
}

let errorAdd = {
    success: false,
    code: 403,
    errors: {
        message: "Failed to add biometric authentication"
    }
}

let successDelete = {
    success: true,
    code: 200,
    data: null
}

let errorDelete = {
    success: false,
    code: 403,
    errors: {
        message: "Failed to delete biometric authentication"
    }
}

let errorDelete2FARequired = {
    success: false,
    code: 406,
    errors: {
        message: "Failed to delete biometric authentication - 2FA required",
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

export const addBiometric2FA = (req, res) => {
    console.log(`twoFAState.value: ${twoFAState.value}`)
    // {
    //     "biometric_name": "{{biometric_name}}",
    //     "biometric_public_key": "{{biometric_public_key}}"
    // }

    let list = twoFAState.list
    let isAvailable = list.find(element => element.type == TWO_FA_TYPE.BIOMETRIC) != undefined
    let biometricStatus = list.find(element => element.type == TWO_FA_TYPE.BIOMETRIC)

    let twoFAParams = check2FAParams(req, twoFAState)

    let is2FANeeded = !twoFAParams.withParams && is2FARequired(req, twoFAState.value, isAvailable, biometricStatus.is_enabled == false, twoFAState)
    
    if (!is2FANeeded) {
        twoFAState.value = twoFAState.value + 1
    } else {
        errorDelete2FARequired.errors.details.allowed_types = 
            list
                .filter(element => element.is_enabled == true)
                .map(element => element.type) 

                if (twoFAState.biometric != undefined) {
                    errorDelete2FARequired.errors.details.passing_data = {
                        biometric_challenge_uuid: "biometric_challenge_uuid",
                        biometric_encrypted_challenge: (Number(twoFAState.biometric.challenge) + Number(twoFAState.biometric.key)).toString()
                        // uuid: "challenge_uuid",
                        // challenge: (Number(twoFAState.biometric.challenge) + Number(twoFAState.biometric.key)).toString()
                    }
                } else {
                    errorDelete2FARequired.errors.details.passing_data = undefined
                }
                errorDelete2FARequired.errors.details.pin_code = twoFAState.pinCode == undefined ? null : twoFAState.pinCode
                errorDelete2FARequired.errors.details.email_code = twoFAState.emailCode == undefined ? null : twoFAState.emailCode
                errorDelete2FARequired.errors.details.google_otp = twoFAState.googleOTP == undefined ? null : twoFAState.googleOTP
                errorDelete2FARequired.errors.details.sms_code = twoFAState.smsCode == undefined ? null : twoFAState.smsCode                 
    }

    // check challenge and key

    var response = undefined

    if (is2FANeeded) {
        response = errorDelete2FARequired
    } else if (true) {
        biometricStatus.is_enabled = true

        twoFAState.value = twoFAState.value + 1
        
        twoFAState.biometric = {
            key: req.body.biometric_public_key,
            challenge: "555"
        }

        let name = req.body.biometric_name ?? "unknown";

        console.log(`add biometric, name: ${name}, public_key: ${req.body.biometric_public_key}`);

        twoFAState.list[0].list = [
            {
                uuid: "biometric_uuid_1",
                name: name,
                is_current_device: true,
                created_at: "2023-12-31 23:59:59",
                used_at: "2023-12-31 23:59:59"
            },
        ]

        response = successAdd
    } else {
        response = errorAdd
    }

    res.status(response.code).json(response)
}

export const deleteBiometric2FA = (req, res) => {
    let biometric_uuid = req.query.biometric_uuid
    console.log(`deleteBiometric2FA, biometric_uuid: ${biometric_uuid}, twoFAState.value: ${twoFAState.value}`)

    // {
    //     "uuid": "{{biometric_uuid}}"
    // }

    let list = twoFAState.list
    let isAvailable = list.find(element => element.type == TWO_FA_TYPE.BIOMETRIC) != undefined
    let biometricStatus = list.find(element => element.type == TWO_FA_TYPE.BIOMETRIC)

    let twoFAParams = check2FAParams(req, twoFAState)

    let is2FANeeded = !twoFAParams.withParams && is2FARequired(req, twoFAState.value, isAvailable, biometricStatus.is_enabled == true, twoFAState)
    
    if (!is2FANeeded) {
        twoFAState.value = twoFAState.value + 1
    } else {
        errorDelete2FARequired.errors.details.allowed_types = 
            list
                .filter(element => element.is_enabled == true)
                .map(element => element.type)

                if (twoFAState.biometric != undefined) {
                    errorDelete2FARequired.errors.details.passing_data = {
                        biometric_challenge_uuid: "biometric_challenge_uuid",
                        biometric_encrypted_challenge: (Number(twoFAState.biometric.challenge) + Number(twoFAState.biometric.key)).toString()
                        // uuid: "challenge_uuid",
                        // challenge: (Number(twoFAState.biometric.challenge) + Number(twoFAState.biometric.key)).toString()
                    }
                } else {
                    errorDelete2FARequired.errors.details.passing_data = undefined
                } 

                errorDelete2FARequired.errors.details.pin_code = twoFAState.pinCode == undefined ? null : twoFAState.pinCode
                errorDelete2FARequired.errors.details.email_code = twoFAState.emailCode == undefined ? null : twoFAState.emailCode
                errorDelete2FARequired.errors.details.google_otp = twoFAState.googleOTP == undefined ? null : twoFAState.googleOTP
                errorDelete2FARequired.errors.details.sms_code = twoFAState.smsCode == undefined ? null : twoFAState.smsCode                                  
    }

    var response = undefined
    if (!isAvailable) {
        response = failureNA
    } else if (is2FANeeded) {
        response = errorDelete2FARequired
    } else if (twoFAParams.withParams && twoFAParams.isError) {
        response = errorDelete
    } else {
        biometricStatus.is_enabled = false
        twoFAState.biometric = undefined

        twoFAState.list[0].list = []

        response = successDelete
    }

    res.status(response.code).json(response)
}