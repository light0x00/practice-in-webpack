// import {cube,square} from './module1'

// // let r = cube(2)
// // // let r2 = cube(2)
// // // let r3 = square(2)
// // console.log(r)


// import {join,isArray,concat,reduce} from 'lodash-es'


// let greet = reduce(["Hello","lodash"],(a,b)=>a+" "+b)
// // console.log(greet)



// import {ohayo} from 'jp' 
// import {hello} from 'uk' 


import "./module1"

showText("Hello")
// showText(hello)

// /* i'm comment */
// console.log(ohayo)
// console.warn(ohayo)
// console.error(ohayo)


function showText(text,styleName?){
    let ele = document.createElement("p")
    ele.classList.add(styleName||"style1")
    ele.innerHTML=text
    document.body.appendChild(ele)
}
