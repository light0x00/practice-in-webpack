<template>
  <div>
    <JsxComp1>Light</JsxComp1>
    <hr>
    <JsxComp2>Light
      <p slot="header">我是标题</p>
      <p slot="content">我是正文</p>
    </JsxComp2>
    <hr>
  </div>
</template>
<script>
import JsxComp1 from "@/comps/JsxComp1";
import JsxComp2 from "@/comps/JsxComp2";
    export default {
      components:{JsxComp1,JsxComp2}
    }
</script>