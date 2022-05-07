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
        this.parsers[method] = parser;
    }

    addGlobalParser(parser){
        this.globalParsers.push(parser);
    }

    parseInput(type, value){

        if(typeof value == 'string' && type.match(/^u?int/)){
            return parseInt(value);
        }

        if(typeof value == 'string' && type == 'bool'){
            return (value == 'true' || value == '1') ? true : false;
        }
    
        return value;
    
    }

    parse(method, value){

        if(this.globalParsers.length > 0){
            for (let i = 0; i < this.globalParsers.length; i++) {
                value = this.globalParsers[i](value);
            }
        }
        
        if(typeof this.parsers[method] == 'function')
            value = this.parsers[method](value);

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
    
                    if(query[input.name]){
                        params.push(this.parseInput(input.type, query[input.name]));
                    }
                    
                }
    
                break;
    
            }
    
        }
    
        return params;

    }

}


module.exports = ABIAPI;