export const numberToNumberCode = (number) => { 
    var numbers = number.split('.');
    while (numbers.length < 3) {
        numbers.push('000');
    }

    var i = 0;
    while (i < 3) {
        while (numbers[i].length < 3) {
            numbers[i] = '0' + numbers[i]
        }
        i++;
    }
    return Number(numbers.join(''))
}