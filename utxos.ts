type Txo = string;
type TokenId = Buffer;

class BigMap {    
    maps: Array<Map<Txo, TokenId>>
    
    constructor(...parameters: any[]) {
        this.maps = []
        this.pushNewMap()
    }
    
    private pushNewMap() {
        this.maps.push(new Map<Txo, TokenId>())
    }

    public set(key: string, value: Buffer): Map<Txo, TokenId> {
       for (let i=0; i < this.maps.length; i++){
            if (this.maps[i].has(key)) {
                return this.maps[i].set(key, value)
            }
        }
        
        let lastMap = this.maps[this.maps.length - 1]
        if (lastMap.size >= Math.pow(2, 20)){
            this.pushNewMap()
        }
        lastMap = this.maps[this.maps.length - 1]
        return lastMap.set(key, value)
    }
    
    public get(key: string) {
        for (let i=0; i < this.maps.length; i++) {
            let value = this.maps[i].get(key)
            if (value !== undefined) {
                return value
            }
        }
    }
    
    public has(key: string) {
        for (let i=0; i < this.maps.length; i++){
            let value = this.maps[i].get(key)
            if (value !== undefined) {
                return true
            }
        }
        return false
    }
    
    public delete(key: string) {
        for (let i=0; i < this.maps.length; i++){
            if (this.maps[i].has(key)) {
                return this.maps[i].delete(key)
            }
        }
        return false
    }
    
    get size() {
        let size = 0
        for (let i=0; i < this.maps.length; i++){
            size += this.maps[i].size
        }
        return size
    }
    public clear() {}
    public entries() {}
    public forEach() {}
    public [Symbol.iterator]() {}
    public keys() {}
    public values() {}
    public [Symbol.toStringTag]() {}
}

class GlobalUtxoSet<T, Y> extends BigMap {
    public static Instance() {
        return this._instance || (this._instance = new GlobalUtxoSet<Txo, TokenId>());
    }
    private static _instance: GlobalUtxoSet<Txo, TokenId>;

    public set(key: string, value: Buffer): any {
        if (this.size % 100000 === 0) {
            console.log(`UTXO size: ${this.size}`);
        }
        return super.set(key, value);
    }
    private constructor() { super(); }
}

// accessor to a singleton utxo set
export const slpUtxos = GlobalUtxoSet.Instance;
