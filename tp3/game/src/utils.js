export function toLower(letter){
    return letter.toLowerCase();
} 

export function toUpper(letter){
    return letter.toUpperCase();
} 

export function nextPlayer(turn){
    if(toLower(turn) == 'b') return 'w'
    else if (toLower(turn) == 'w') return 'b'
}

export function isLowerCase(letter){
    return letter == toLower(letter)
}

export function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}