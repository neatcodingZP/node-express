import TWO_FA_TYPE from './two_fa_type.js'



var twoFAState = {
    value: 1,
    pinCode: undefined,
    emailCode: undefined,

    biometric: {
        challenge: undefined,
        key: undefined,
        biometric_uuid: undefined
    },

    list: [
        {
            type: TWO_FA_TYPE.PIN,
            isEnabled: false,
        },
        {
            type: TWO_FA_TYPE.EMAIL,
            isEnabled: false
        },
        {
            type: TWO_FA_TYPE.GOOGLE,
            isEnabled: false
        },
        {
            type: TWO_FA_TYPE.BIOMETRIC,
            isEnabled: false
        }

    ],
}

export default twoFAState

