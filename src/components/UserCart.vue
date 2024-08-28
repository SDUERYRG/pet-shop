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
                <h1>购物车</h1>
            </div>
            <div class="maindown">
                <div class="index">
                    <div style="width: 20px;"></div>
                    <div style="display: flex;flex-direction: column;">
                        <ElCheckbox @change="selectAll(all)" v-model="all"></ElCheckbox>
                    </div>
                    <h4 style="margin-top: 3px;margin-bottom: 0px;">全选</h4>
                    <div style="width: 20px;"></div>
                    <h4 style="margin-top: 3px;margin-bottom: 0px;">图片</h4>
                    <div style="width: 120px;"></div>
                    <h4 style="margin-top: 3px;margin-bottom: 0px;">商品名</h4>
                    <div style="width: 120px;"></div>
                    <h4 style="margin-top: 3px;margin-bottom: 0px;">详细信息</h4>
                    <div style="width: 180px;"></div>
                    <h4 style="margin-top: 3px;margin-bottom: 0px;">单价</h4>
                    <div style="width: 80px;"></div>
                    <h4 style="margin-top: 3px;margin-bottom: 0px;">操作</h4>
                </div>
                <div v-for="(item,index) in cartItems" :key="item.itemId" class="cartItem">
                    <div style="width: 20px;"></div>
                    <div style="display: flex;flex-direction: column;margin-top: 60px;">
                        <ElCheckbox @change="checkAllSelected;console.log(selectedItems)" v-model="selectedItems[index]"></ElCheckbox>
                    </div>
                    <div style="width: 50px;background-color: aqua;">
                        {{ index+1 }}
                    </div>
                    <img src="" alt="商品图片" style="width: 150px;height: 150px;"/>
                    <div style="width: 170px;height: 150px;display: flex;justify-content: center;flex-direction: column;">
                        {{ item.itemName }}
                    </div>
                    <div style="width: 230px;height: 150px;background-color: aquamarine;display: flex;justify-content: center;flex-direction: column;">
                        <!-- {{ item.description }} -->
                          我是描述
                    </div>
                    <div style="width: 120px;height: 150px;display: flex;justify-content: center;flex-direction: column;">
                        ￥{{ item.price }}
                    </div>
                    <div style="width: 80px;height: 150px;display: flex;justify-content: center;flex-direction: column;">
                        <ElButton type="text">删除</ElButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElCheckbox } from 'element-plus';
import { ShoppingCart } from '../models/ShoppingCart';

export default {
  name: 'UserCart',
  setup() {
    const router = useRouter();
    const userId = localStorage.getItem('userId');
    const cartItems = ref<ShoppingCart[]>([]);
    const selectedItems = ref<boolean[]>([]);
    const all = ref<boolean>(false); // 全选状态

    const goToCart = () => {
      router.push('/UserCart');
    };
    const goToOrder = () => {
      router.push('/UserOrder');
    };
    const goToHome = () => {
      router.push('/UserHome');
    };
    const logout = async () => {
      const response = await axios.get('http://localhost:4001/diary-server/logout', {
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token'),
        },
      });
      if (response.status === 200) {
        localStorage.removeItem('token');
        router.push('/UserLogin');
      }
    };

    const getCart = async () => {
      const response = await axios.get(`http://localhost:4001/diary-server/shoppingCart/0/10/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token'),
        },
      });
      if (response.status === 200) {
        cartItems.value = response.data.data.records;
        initSelected();
      }
    };

    const initSelected = () => {
      selectedItems.value = Array(cartItems.value.length).fill(false);
    };

    const selectAll = (isAllSelected: boolean) => {
      selectedItems.value = Array(cartItems.value.length).fill(isAllSelected);
      all.value = isAllSelected; // 更新全选状态
      console.log(selectedItems.value);
      
    };

    const checkAllSelected = computed(() => {
      all.value=selectedItems.value.every((item) => item === true);
    });

    onMounted(async () => {
      await getCart();
    });

    return {
      goToCart,
      goToOrder,
      goToHome,
      logout,
      cartItems,
      selectAll,
      selectedItems,
      checkAllSelected,
      all,
    };
  },
};
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
  width: 100%;
  height: fit-content;
  padding: 20px;
  background-color: #F5F5F5;
  /* border: #f2ad53 1px solid; */
}
.index {
    display: flex;
    flex-direction: row;
}
.cartItem {
    display: flex;
    flex-direction: row;
    border: #b4b4b4 2px solid;
    width: 100%;
    height: 150px;
    margin-top: 20px;
    background-color: white;
}
</style>