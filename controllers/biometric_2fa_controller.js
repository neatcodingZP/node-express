import twoFAState from '../globals/two_fa_state.js'
import TWO_FA_TYPE from '../globals/two_fa_type.js'
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
    //     "name": "{{biometric_name}}",
    //     "public_key": "{{biometric_public_key}}"
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
                    errorDelete2FARequired.errors.details.biometric = {
                        uuid: "challenge_uuid",
                        challenge: (Number(twoFAState.biometric.challenge) + Number(twoFAState.biometric.key)).toString()
                    }
                } else {
                    errorDelete2FARequired.errors.details.biometric = undefined
                }         
    }

    // check challenge and key

    var response = undefined

    if (is2FANeeded) {
        response = errorDelete2FARequired
    } else if (true) {
        biometricStatus.is_enabled = true

        twoFAState.value = twoFAState.value + 1
        
        twoFAState.biometric = {
            key: req.body.public_key,
            challenge: "555"
        }

        response = successAdd
    } else {
        response = errorAdd
    }

    res.status(response.code).json(response)
}

export const deleteBiometric2FA = (req, res) => {
    console.log(`twoFAState.value: ${twoFAState.value}`)

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
                    errorDelete2FARequired.errors.details.biometric = {
                        uuid: "challenge_uuid",
                        challenge: (Number(twoFAState.biometric.challenge) + Number(twoFAState.biometric.key)).toString()
                    }
                } else {
                    errorDelete2FARequired.errors.details.biometric = undefined
                }        
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

        response = successDelete
    }

    res.status(response.code).json(response)
}