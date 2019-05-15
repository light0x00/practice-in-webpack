export default {
    render() {
        const scopedSlots = {
            default: () => <header>header</header>,
            footer: () => <footer>footer</footer>
        }
        return <div >Hello,{this.$slots.default }</div>
    }

    // render(h) {
    //     // const scopedSlots = {
    //     // default: () => <header>header</header>,
    //     // footer: () => <footer>footer</footer>
    //     // }
    //     return h(
    //         'h1',
    //         this.$slots.default 
    //     )
    // }

}
