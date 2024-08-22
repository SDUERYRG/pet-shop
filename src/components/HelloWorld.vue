<template>

  <div class="loginCard">
    <ElInput class=loginInput v-model="account" placeholder="请输入账号" />
    <ElInput class=loginInput type=password v-model="password" placeholder="请输入密码" />
    <ElButton class=loginButton type="primary" @click="login()">登录</ElButton>
  </div>
</template>


<script lang="ts">
import { ref } from 'vue';
import { ElInput,ElButton } from 'element-plus';
const account = ref('');
const password = ref('');

export default {
  data(){
    return {
      account,
      password
    }
  },
  methods:{
    login(){
      console.log(this.account,this.password)
    }
  }
}
</script>

<style scoped>
.loginButton{
  width: 100%;
}
.loginInput{
  height: 50px;
  padding-bottom: 10px;
}
</style>