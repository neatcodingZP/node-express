import TWO_FA_TYPE from './two_fa_type.js'



var twoFAState = {
    value: 1,
    pinCode: undefined, //'1234',
    emailCode: undefined,

    biometric: undefined,
    googleOTP: undefined,
    smsCode: undefined,
    // {
    //     challenge: undefined,
    //     key: undefined
    // },

    list: [
        {
            type: TWO_FA_TYPE.BIOMETRIC,
            is_enabled: false,
            list: [ 
                // {
                //     uuid: "biometric_uuid_1",
                //     name: "device name 1",
                //     is_current_device: true,
                //     created_at: "2023-12-31 23:59:59",
                //     used_at: "2023-12-31 23:59:59"
                // },
                // {
                //     uuid: "biometric_uuid_2",
                //     name: "device name 2",
                //     is_current_device: false,
                //     created_at: "2023-12-31 23:59:59",
                //     used_at: "2023-12-31 23:59:59"
                // }
            ]
        },
        {
            type: TWO_FA_TYPE.GOOGLE,
            is_enabled: false
        },
        {
            type: TWO_FA_TYPE.EMAIL,
            is_enabled: false
        },
        {
            type: TWO_FA_TYPE.PIN,
            is_enabled: false,
        },
        {
            type: TWO_FA_TYPE.SMS,
            is_enabled: false,
        }
    ]
}

export default twoFAState

