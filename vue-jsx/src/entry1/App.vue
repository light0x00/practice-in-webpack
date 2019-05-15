<template>
  <div>
  
    <JsxNamedSlots>Light
      <p slot="header">我是标题</p>
      <p slot="content">我是正文</p>
    </JsxNamedSlots>
    <hr>
    <JsxScopeSlots></JsxScopeSlots>
  </div>
</template>
<script>
import JsxNamedSlots from "@/comps/jsx-named-slots/index.js";
import JsxScopeSlots from "@/comps/jsx-scope-slots/index.js";
    export default {
      components:{JsxNamedSlots,JsxScopeSlots}
    }
</script>