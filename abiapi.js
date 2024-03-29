class ABIAPI {

    constructor(abi){
        this.abi = abi;
        this.supportedMethods = [];
        this.methodCacheTTL = {};
        this.cacheTTL = 60;
        this.parsers = {};
        this.globalParsers = [];
    }


    addParser(method, parser){
        if(!this.parsers[method])
            this.parsers[method] = [];
        this.parsers[method].push(parser);
    }

    addGlobalParser(parser){
        this.globalParsers.push(parser);
    }

    _isArrayType(type){
        const is = type.match(/\[\]$/);
        return is;
    }

    parseInput(input, value){

        const type = input.type;

        if(typeof value == 'string' && type.match(/^u?int/)){
            if(this._isArrayType(type))
                return value.replace('[', '').replace(']', '').split(',').map(val => parseInt(val.trim()));
            return parseInt(value);
        }
        else if(typeof value == 'string' && type == 'bool'){
            return (value == 'true' || value == '1') ? true : false;
        }
        else if(typeof value == 'string' && type.match(/^tuple/)){
            return JSON.parse(value).map((val, index) => {
                return this.parseInput({type: input.components[index].type}, val);
            });
        }

        return value;
    
    }

    parse(method, value){

        if(this.globalParsers.length > 0){
            for (let i = 0; i < this.globalParsers.length; i++) {
                value = this.globalParsers[i](value);
            }
        }
        
        if(this.parsers[method]){
            for (let i = 0; i < this.parsers[method].length; i++) {
                value = this.parsers[method][i](value);
            }
        }

        return value;

    }

    supportsMethod(method){
        return (this.supportedMethods.indexOf(method) > -1);
    }


    getReadMethods(){

        const methods = [];
        
        for (let i = 0; i < this.abi.length; i++) {
            const entry = this.abi[i];
            if(entry.stateMutability == 'pure' || entry.stateMutability == 'view'){
                methods.push(entry.name);
            }
        }
    
        return methods;
    
    }


    setMethodCacheTTL(method, ttl){
        this.methodCacheTTL[method] = ttl;
    }
    
    getMethodCacheTTL(method){
        return this.methodCacheTTL[method] ? this.methodCacheTTL[method] : this.cacheTTL;
    }

    methodParamsFromQuery(method, query){

        const params = [];
    
        for (let i = 0; i < this.abi.length; i++) {
    
            const entry = this.abi[i];
            if(entry.type == 'function' && entry.name == method){
                
                for (let ii = 0; ii < entry.inputs.length; ii++) {
                    const input = entry.inputs[ii];
    
                    if(typeof query[input.name] !== 'undefined'){
                        params.push(this.parseInput(input, query[input.name]));
                    }
                    
                }
    
                break;
    
            }
    
        }

        return params;

    }

}


module.exports = ABIAPI;