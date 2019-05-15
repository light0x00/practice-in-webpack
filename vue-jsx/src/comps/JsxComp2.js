export default {
    render() {
        return <div>
            <h1>{this.$slots.header}</h1>
            <p>{this.$slots.content}</p>
        </div>

        /* <slot name="default"></slot> don't work in jsx, should replace with $slots.default*/
    }


}
