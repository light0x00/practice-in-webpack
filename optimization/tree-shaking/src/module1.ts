
import 'element-ui/lib/theme-chalk/index.css';
import './style.css'
console.log("i have side-effect!")

export function square(x) {
    return x * x;
}

export function cube(x) {
    return x * x * x;
}

import { join } from "lodash-es";
export function aa(){
    return join(["a","b"],",")
}

