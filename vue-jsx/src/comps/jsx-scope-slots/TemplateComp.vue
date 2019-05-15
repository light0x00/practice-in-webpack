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

