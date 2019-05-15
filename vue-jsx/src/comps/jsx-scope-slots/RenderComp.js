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