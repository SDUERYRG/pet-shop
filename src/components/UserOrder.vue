<template>
  <router-view></router-view>
  <div class="header">
      <ElButton type="text" @click="goToHome">商城首页</ElButton>
      <ElButton type="text" @click="goToCart">购物车</ElButton>
      <ElButton type="text" @click="goToOrder">我的订单</ElButton>
      <div style="width: 90%;height: 30px;display: flex;flex-direction: row;justify-content: right;">
            <ElButton type="text" @click="logout">退出登录</ElButton>
      </div>
  </div>
  <div class="rootdiv">
      <div class="usermain">
          <div class="headdiv">
              <h1>历史订单</h1>
          </div>
          <div class="maindown">
              <h2>Cart</h2>
          </div>
      </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import {useRouter} from 'vue-router';

export default {
name: 'UserOrder',
setup() {
  const router = useRouter();
  const goToCart = () => {
      router.push('/UserCart');
  }
  const goToOrder = () => {
      router.push('/UserOrder');
  }
  const goToHome = () => {
      router.push('/UserHome');
  }
  const logout = async () => {
            const response = await axios.get('http://localhost:4001/diary-server/logout', {
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('token'),
                },
            });
            console.log('response:', response.status);
            if (response.status === 200) {
                localStorage.removeItem('token');
                router.push('/UserLogin');
            }
        }
  return {
      goToCart,
      goToOrder,
      goToHome,
      logout
  };
}
}
</script>

<style scoped>
.rootdiv {
  width: 100%;
  height: fit-content;
  /* background-color: antiquewhite; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.header {
  background-color: darkslategrey;
  width: 100%;
  height: min-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left; /* 水平方向靠左 */
}
.usermain {
display: flex;
flex-direction: column;
align-items: center;
width: 60%;
height: fit-content;
padding: 20px;
/* background-color: #1a1a1a; */
/* border: #535bf2 1px solid; */
}
.headdiv {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: left;
}
.maindown {
display: flex;
flex-direction: column;
align-items: center;
width: 100%;
height: fit-content;
padding: 20px;
/* background-color: #1a1a1a; */
border: #f2ad53 1px solid;
}
</style>