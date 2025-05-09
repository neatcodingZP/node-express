import twoFAState from '../../globals/two_fa_state.js'
import {is2FARequired} from './two_fa_required_check.js'

import {check2FAParams} from './two_fa_check.js'

let successNo2FA = {
    success: true,
    code: 200,
    data: "Запрос отработал, 2фа не настроено"
}

let success2FA = {
    success: true,
    code: 200,
    data: "Запрос отработал, 2фа пройдено"
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
            // ,

            // biometric: { // Необязательный, присутствует если в allowed_types содержится "biometric"
            //     uuid: "{{challenge_uuid}}",
            //     challenge: "{{encrypted_challenge}}"
            // }
        }
    }
}

// let failure2FAError = {
//     success: false,
//     code: 422, // validation
//     errors: {
//         message: "2FA erors",
//         details: {
//             is_two_factor_auth: true
//         }
//     }
// }


let failure2FAError = {
    success: false,
    code: 422, // validation error 
    errors: {
        message: "Wrong PIN code",
        details: {
            is_two_factor_auth: true,
            pin: [
                {
                    translation_key: "pin.errors.validation",
                    replacements: { // Необязательный
                        "amount": { 
                            type: "scalar",
                            value: "some replacement"
                        }
                    }, 
                    fallback_translation_key: "Pin code error fallback", // Необязательный
                    fallback_replacements: { // Необязательный, если отсутствует, то необходимо использовать "replacements" при переводе "fallback_translation_key"
                        "amount": { 
                           type: "translation",
                            value: "pin.replacement.key"
                        }
                    } 
                }
            ],
            one_time_password: [
                {
                    translation_key: "otp.errors.validation",
                    replacements: { // Необязательный
                        "amount": { 
                            type: "scalar",
                            value: "some replacement"
                        }
                    }, 
                    fallback_translation_key: "Pin code error fallback", // Необязательный
                    fallback_replacements: { // Необязательный, если отсутствует, то необходимо использовать "replacements" при переводе "fallback_translation_key"
                        "amount": { 
                           type: "translation",
                            value: "pin.replacement.key"
                        }
                    } 
                }
            ],
        }
    }
}


export const dummyWith2FA = (req, res) => {
    console.log(`twoFAState.value: ${twoFAState.value}`)

    let list = twoFAState.list

    let twoFAParams = check2FAParams(req, twoFAState)


    let is2FANeeded = 
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
                    failure2FARequired.errors.details.passing_data = {
                        biometric_challenge_uuid: "biometric_challenge_uuid",
                        biometric_encrypted_challenge: (Number(twoFAState.biometric.challenge) + Number(twoFAState.biometric.key)).toString()
                        // uuid: "challenge_uuid",
                        // challenge: (Number(twoFAState.biometric.challenge) + Number(twoFAState.biometric.key)).toString()
                    }
                } else {
                    failure2FARequired.errors.details.passing_data = undefined
                }
                failure2FARequired.errors.details.pin_code = twoFAState.pinCode == undefined ? null : twoFAState.pinCode
                failure2FARequired.errors.details.email_code = twoFAState.emailCode == undefined ? null : twoFAState.emailCode
                failure2FARequired.errors.details.google_otp = twoFAState.googleOTP == undefined ? null : twoFAState.googleOTP
                failure2FARequired.errors.details.sms_code = twoFAState.smsCode == undefined ? null : twoFAState.smsCode                           
    }


    var response = undefined
    if (is2FANeeded) {
        response = failure2FARequired
        
    } else if (twoFAParams.withParams && twoFAParams.isError) {
        response = failure2FAError
    } else if (twoFAParams.withParams) {
        response = success2FA
    } else {
        response = successNo2FA
    }

    res.status(response.code).json(response)
}