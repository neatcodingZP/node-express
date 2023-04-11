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
        return {
            withParams: true,
            isError: twoFAParams.email.one_time_password != twoFaState.pinCode
        }
    } else if (twoFAParams.type == TWO_FA_TYPE.GOOGLE) {
        return {
            withParams: true,
            isError: false
        }
    } else {
        return {
            withParams: true,
            isError: false
        }
    }
}
