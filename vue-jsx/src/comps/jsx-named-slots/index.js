/* 获得父组件在插槽内定义的内容 */
export default {
    render() {
        return <div>
            <h1>{this.$slots.header}</h1>
            <p>{this.$slots.content}</p>
            <p>{this.$slots.default}</p>
        </div>

        /* <slot name="default"></slot> don't work in jsx, should replace with $slots.default*/
    }


}
