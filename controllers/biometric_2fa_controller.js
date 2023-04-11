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


let successChallenge = {
    success: true,
    code: 200,
    data: {
        uuid: "uuid_777",
        challenge: "555"
    }
}

let successAdd = {
    success: true,
    code: 200,
    data: {
        uuid: "biometric_uuid_12"
    }
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



export const getChallenge2FA = (req, res) => {
    console.log(`twoFAState.value: ${twoFAState.value}`)

    twoFAState.value = twoFAState.value + 1

    var response = successChallenge

    twoFAState.biometric.challenge = Number(successChallenge.data.challenge)

    res.status(response.code).json(response)
}

export const addBiometric2FA = (req, res) => {
    console.log(`twoFAState.value: ${twoFAState.value}`)

    // {
    //     "uuid": "{{challenge_uuid}}",
    //     "challenge": "{{encrypted_challenge}}",
    //     "name": "{{biometric_name}}",
    //     "public_key": "{{biometric_public_key}}"
    // }

    let list = twoFAState.list
    let biometricStatus = list.find(element => element.type == TWO_FA_TYPE.BIOMETRIC)

    // check challenge and key

    let challenge = req.body.challenge
    let key = req.body.public_key

    var response = undefined


    if (challenge == (Number(twoFAState.biometric.challenge) + Number(key)) ) {
        biometricStatus.isEnabled = true

        twoFAState.value = twoFAState.value + 1
        
        twoFAState.biometric.key = key

        twoFAState.biometric.biometric_uuid = successAdd.data.uuid

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

    let is2FANeeded = !twoFAParams.withParams && is2FARequired(req, twoFAState.value, isAvailable, biometricStatus.isEnabled == true, twoFAState)
    
    if (!is2FANeeded) {
        twoFAState.value = twoFAState.value + 1
    } else {
        errorDelete2FARequired.errors.details.allowed_types = 
            list
                .filter(element => element.isEnabled == true)
                .map(element => element.type)
    }

    if (isAvailable && !is2FANeeded && !twoFAParams.isError && biometricStatus.isEnabled == true) {
        biometricStatus.isEnabled = false
        twoFAState.biometric = {
            challenge: undefined,
            key: undefined,
            biometric_uuid: undefined
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
        response = successDelete
    }

    res.status(response.code).json(response)
}