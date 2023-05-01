import twoFAState from '../globals/two_fa_state.js'
import TWO_FA_TYPE from '../globals/two_fa_type.js'
import {is2FARequired} from './two_fa_required_check.js'

import {check2FAParams} from './two_fa_check.js'

let success = {
    success: true,
    code: 200,
    data: {}
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

let failureWrongPin = {
    success: false,
    code: 403, // Forbidden
    errors: {
        message: "Wrong PIN code"
    }
}

let failureWrongPinValidation = {
    success: false,
    code: 422, // Forbidden
    errors: {
        message: "Wrong PIN code 422",
        details: {
            is_two_factor_auth: true,
            pin: [
                {
                    translation_key: "pin.wrong_code",
                    replacements: {}
                }
            ]
        }
    }
}


export const list2FA = (req, res) => {
    console.log(`twoFAState.value: ${twoFAState.value}`)

    let list = twoFAState.list

    let twoFAParams = check2FAParams(req, twoFAState)


    let is2FANeeded = 
    false &&
    !twoFAParams.withParams && 
    is2FARequired(req, twoFAState.value, true, true, twoFAState)
    

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
    }


    var response = undefined
    if (is2FANeeded) {
        response = failure2FARequired
    } else if (twoFAParams.withParams && twoFAParams.isError) {
        response = failureWrongPinValidation
    } else {
        response = success
        response.data = twoFAState.list
    }

    res.status(response.code).json(response)
}