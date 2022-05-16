const {isArray, isObject} = require('lodash');

function bigNumbersToNumber(value){

    if(value._isBigNumber){
        return value.toNumber();
    }
    else if(isArray(value)){
        return value.map(bigNumbersToNumber);
    }
    else if(isObject(value)){

        for(const key in value) {
            if (Object.hasOwnProperty.call(value, key)) {
                value[key] = bigNumbersToNumber(value[key])
            }
        }    
        return value;
    }

    return value;

}


module.exports = {
    bigNumbersToNumber
}