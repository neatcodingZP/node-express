import twoFAState from '../globals/two_fa_state.js'
import TWO_FA_TYPE from '../globals/two_fa_type.js'
import {is2FARequired} from './two_fa_required_check.js'

import {check2FAParams} from './two_fa_check.js'

let failureNA = {
    success: false,
    code: 403, // Forbidden
    errors: {
        message: "Email 2FA is not available"
    }
}

let successRequest = {
    success: true,
    code: 200,
    data: {
        uuid: "email_uuid"
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
        message: "Failed to add biometric authentication"
    }
}

let errorDelete = {
    success: false,
    code: 403,
    errors: {
        message: "Failed to delete biometric authentication"
    }
}

let error2FARequired = {
    success: false,
    code: 406,
    errors: {
        message: "Failed to add/delete email authentication - 2FA required",
        details: {}
    }
}

export const requestEmail2FA = (req, res) => {
    console.log(`requestEmail2FA, twoFAState.value: ${twoFAState.value}`)

    twoFAState.emailCode = "otp"

    var response = successRequest

    res.status(response.code).json(response)
}

export const addEmail2FA = (req, res) => {
    console.log(`addEmail2FA, twoFAState.value: ${twoFAState.value}`)

    // {
    //     "uuid": "{{uuid}}",
    //     "one_time_password": "{{email_one_time_password}}"
    // }

    let list = twoFAState.list
    let isAvailable = list.find(element => element.type == TWO_FA_TYPE.EMAIL) != undefined
    let emailStatus = list.find(element => element.type == TWO_FA_TYPE.EMAIL)

    let twoFAParams = check2FAParams(req, twoFAState)

    let is2FANeeded = !twoFAParams.withParams && is2FARequired(req, twoFAState.value, isAvailable, emailStatus.isEnabled == false, twoFAState)
    
    if (!is2FANeeded) {
        twoFAState.value = twoFAState.value + 1
    } else {
        error2FARequired.errors.details.allowed_types = 
            list
                .filter(element => element.isEnabled == true)
                .map(element => element.type)

                if (twoFAState.biometric != undefined) {
                    error2FARequired.errors.details.biometric = {
                        uuid: "challenge_uuid",
                        challenge: (Number(twoFAState.biometric.challenge) + Number(twoFAState.biometric.key)).toString()
                    }
                } else {
                    error2FARequired.errors.details.biometric = undefined
                }         
    }

    var response = undefined

    let otp = req.body.one_time_password

    if (otp == undefined || otp != twoFAState.emailCode) {
        response = errorAdd
    } else if (is2FANeeded) {
        response = error2FARequired
    } else if (emailStatus.isEnabled == false) {
        emailStatus.isEnabled = true

        twoFAState.value = twoFAState.value + 1
        twoFAState.emailCode = undefined
        
        response = success
    } else {
        response = errorAdd
    }

    res.status(response.code).json(response)
}

export const deleteEmail2FA = (req, res) => {
    console.log(`deleteEmail2FA, twoFAState.value: ${twoFAState.value}`)


    let list = twoFAState.list
    let isAvailable = list.find(element => element.type == TWO_FA_TYPE.EMAIL) != undefined
    let emailStatus = list.find(element => element.type == TWO_FA_TYPE.EMAIL)

    let twoFAParams = check2FAParams(req, twoFAState)
    console.log(`deleteEmail2FA, twoFAParams: ${twoFAParams}`)

    let is2FANeeded = !twoFAParams.withParams && is2FARequired(req, twoFAState.value, isAvailable, emailStatus.isEnabled == true, twoFAState)
    
    if (!is2FANeeded) {
        twoFAState.value = twoFAState.value + 1
    } else {
        error2FARequired.errors.details.allowed_types = 
            list
                .filter(element => element.isEnabled == true)
                .map(element => element.type)

                if (twoFAState.biometric != undefined) {
                    error2FARequired.errors.details.biometric = {
                        uuid: "challenge_uuid",
                        challenge: (Number(twoFAState.biometric.challenge) + Number(twoFAState.biometric.key)).toString()
                    }
                } else {
                    error2FARequired.errors.details.biometric = undefined
                }        
    }


    var response = undefined
    if (!isAvailable) {
        response = failureNA
    } else if (is2FANeeded) {
        response = error2FARequired
    } else if (twoFAParams.withParams && twoFAParams.isError) {
        response = errorDelete
    } else {
        emailStatus.isEnabled = false
        twoFAState.emailCode = undefined

        response = success
    }

    res.status(response.code).json(response)
}