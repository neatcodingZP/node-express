import TWO_FA_TYPE from '../globals/two_fa_type.js'

export const check2FAParams = (req, twoFaState) => {

    let twoFAParams = get2FAParamsFrom(req)

    if (twoFAParams == undefined) return {
        withParams: false,
        isError: false
    }

    return check2FAAuth(twoFAParams, twoFaState)
}


function get2FAParamsFrom(req){
    // process only post requests parameters
    return req.body.two_factor_auth
}

function check2FAAuth(twoFAParams, twoFaState) {
    if (twoFAParams.type == TWO_FA_TYPE.PIN) {
        return {
            withParams: true,
            isError: twoFAParams.pin.code != twoFaState.pinCode
        }
    } else if (twoFAParams.type == TWO_FA_TYPE.EMAIL) {
        console.log(`check Email, one_time_password: ${twoFAParams.email.one_time_password}, twoFaState.emailCode: ${twoFaState.emailCode}`)

        return {
            withParams: true,
            isError: twoFAParams.email.one_time_password != twoFaState.emailCode
        }
    } else if (twoFAParams.type == TWO_FA_TYPE.GOOGLE) {
        return {
            withParams: true,
            isError: twoFAParams.google.one_time_password != twoFaState.googleOTP
        }
    } else if (twoFAParams.type == TWO_FA_TYPE.BIOMETRIC) {
        // "biometric": { // Необязательный, необходим с type=biometric
        //     "challenge_uuid": "{{challenge_uuid}}",
        //     "challenge": "{{encrypted_challenge}}",
        //     "biometric_uuid": "{{biometric_uuid}}"
        // }

        if (twoFaState.biometric == undefined) {
            return {
                withParams: true,
                isError: true
            }
        }

        return {
            withParams: true,
            isError: twoFAParams.biometric.challenge != Number(twoFaState.biometric.challenge) // + Number(twoFaState.biometric.key)
        }
    } else if (twoFAParams.type == TWO_FA_TYPE.SMS) {
        console.log(`check Sms, one_time_password: ${twoFAParams.sms.one_time_password}, twoFaState.smsCode: ${twoFaState.smsCode}`)

        return {
            withParams: true,
            isError: twoFAParams.sms.one_time_password != twoFaState.smsCode
        }
    } else {
        return {
            withParams: true,
            isError: false
        }
    }
}
