<template>
  <div>
      <router-link to="/button">加载el-button</router-link>
      <router-link to="/radio">加载el-radio</router-link>
      <router-view></router-view>
      
  </div>
</template>
<script lang="ts">
    import Vue from "vue";
    export default Vue.extend({
      created(){
      }
    });
</script>

