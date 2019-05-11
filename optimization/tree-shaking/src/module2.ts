

let get_count=0;

let data = new Map()
data.set("foo","foo's value")

export default {
    /*@__PURE__*/
    get(key){
        get_count ++;
        data.get(key)
    }
}