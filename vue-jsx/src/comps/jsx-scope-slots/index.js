/* jsx中使用插槽域 实现在子组件的插槽内 接收子组件传的值 */
import TemplateComp from "./TemplateComp.vue";
import RenderComp from './RenderComp.js'
import RenderJsxComp from './RenderJsxComp.js'

export default {
    components: { RenderComp, TemplateComp, RenderJsxComp },

    /* 以下两种方式是等价的 */

    /* 1. 使用原生render */
    // render(h) {
    //     return h(
    //         'div',
    //         [
    //             h('TemplateComp', {
    //                 scopedSlots: {
    //                     header: scopeProps => h('div', scopeProps.msg),
    //                     content: scopeProps => h('span', scopeProps.msg)
    //                 },
    //             }),
    //             h('RenderComp', {
    //                 scopedSlots: {
    //                     header: scopeProps => h('div', scopeProps.msg),
    //                     content: scopeProps => h('span', scopeProps.msg)
    //                 },
    //             }),
    //             h('RenderJsxComp', {
    //                 scopedSlots: {
    //                     header: scopeProps => h('div', scopeProps.msg),
    //                     content: scopeProps => h('span', scopeProps.msg)
    //                 },
    //             })
    //         ]
    //     )
    // },

    /* 2. 使用jsx */
    render() {
        /* 定义一个插槽域对象 (👉 https://cn.vuejs.org/v2/guide/render-function.html) */
        const scopedSlots = {
            header: (scopeProps) => <div>{scopeProps.msg}</div>,/* 接受子组件传给插槽域的值 */
            content: (scopeProps) => <div>{scopeProps.msg}</div>
        }
        return <div>
            <TemplateComp scopedSlots={scopedSlots}></TemplateComp>
            <RenderComp scopedSlots={scopedSlots}></RenderComp>
            <RenderJsxComp scopedSlots={scopedSlots}></RenderJsxComp>
        </div>
    }

}
