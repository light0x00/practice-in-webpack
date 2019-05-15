# 插槽的1024种玩法

## 传递数据到插槽域

使用template

```html
<template>
    <div>
        <slot name="header" msg="header slot传给插槽域的值"></slot>
        <slot name="content" msg="content slot传给插槽域的值"></slot>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({

})
</script>


```

使用render

```js
export default {

    render(h) {
        return h(
            'div', 
            [
                this.$scopedSlots.header({
                    msg: "header slot传给插槽域的值"
                }),
                this.$scopedSlots.content({
                    msg: "content slot传给插槽域的值"
                }),
            ]
        )
    }
}
```

使用jsx,本质上等同于使用render, 由`transform-vue-jsx`负责转换「标签」为「VNode的数据结构对象」.

```js
export default {

    render(h) {
        return <div>
            {
                this.$scopedSlots.header({
                    msg: "header slot传给插槽域的值"
                })
            }
            {
                this.$scopedSlots.content({
                    msg: "content slot传给插槽域的值"
                })
            }
        </div>
    }
}
```

## 使用插槽域的数据

```html
<div>
    <MyComp >
        <p slot="header" slot-scope="scope">获得的数据:{scopeProps.msg}</p>
        <p slot="content" slot-scope="scope">获得的数据:{scopeProps.msg}</p>
    </MyComp>
</div>

```

```jsx
export default{
    render() {
        /* 定义一个插槽域对象 (👉 https://cn.vuejs.org/v2/guide/render-function.html) */
        const scopedSlots = {
            header: (scopeProps) => <p>获得的数据:{scopeProps.msg}</p>,/* 接受子组件传给插槽域的值 */
            content: (scopeProps) => <p>获得的数据:{scopeProps.msg}</p>
        }
        return <div>
            <MyComp scopedSlots={scopedSlots}></MyComp>
        </div>
    }
}
```

```jsx
export default{
    render(h) {
        return h(
            'div',
            [
                h('MyComp', {
                    scopedSlots: {
                        header: scopeProps => h('div', scopeProps.msg),
                        content: scopeProps => h('span', scopeProps.msg)
                    },
                })
            ]
        )
    },
}
```