class ABIAPI {


    constructor(abi){
        this.abi = abi;
        this.supportedMethods = [];
        this.methodCacheTTL = {};
        this.cacheTTL = 60;
    }


    parseInput(type, value){

        if(typeof value == 'string' && type.match(/^u?int/)){
            return parseInt(value);
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