<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu>
          <el-menu-item index="1" @click="goToUser">
            <el-icon>
              <User />
            </el-icon>人员管理</el-menu-item>
          <el-menu-item index="2" @click="goToItem"><el-icon>
              <Box />
            </el-icon>宠物管理</el-menu-item>
          <el-menu-item index="3" @click="goToCart"><el-icon>
              <ShoppingCartFull />
            </el-icon>购物车管理</el-menu-item>
          <el-menu-item index="4" @click="goToOrder"><el-icon>
              <Document />
            </el-icon>订单管理</el-menu-item>
          <el-menu-item index="5" @click="goToSort"><el-icon>
              <Document />
            </el-icon>分类管理</el-menu-item>
        </el-menu>
        <div style="height: 400px;width: 200px">

        </div>
        <div style="justify-content: center;width: 200px;height: 100px;display: flex;">
          <ElButton type="primary" @click="goToUserHome">跳转到用户端</ElButton>
        </div>

      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { ElAside, ElMain, ElContainer } from 'element-plus';
import router from '../router';
export default {
  name: 'Home',
  components: {
    ElAside,
    ElMain,
    ElContainer
  },
  setup() {
    const test = () => {
      console.log('test');
    };
    const goToUser = () => {

      router.push('/Home/User');
      console.log('goToUser');
    };
    const goToItem = () => {
      router.push('/Home/Item');
      console.log('goToItem');
    };
    const goToCart = () => {
      router.push('/Home/Cart');
      console.log('goToCart');
    };
    const goToOrder = () => {
      router.push('/Home/Order');
      console.log('goToOrder');
    };
    const goToUserHome = () => {
      router.push('/UserLogin');
      console.log('goToUserHome');
    };
    const goToSort = () => {
      router.push('/Home/Sort');
      console.log('goToSort');
    };
    return {
      test,
      goToUser,
      goToItem,
      goToCart,
      goToOrder,
      goToUserHome,
      goToSort
    };
  }
}
</script>