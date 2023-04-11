export const is2FARequired = (req, value, isAvailable, isProperState, twoFaState) => {


    let isAnyAvailable = twoFaState.list.find(element => element.isEnabled == true) != undefined

    if (!isAnyAvailable) return false

    return isAvailable && isProperState && value%1 == 0
}

