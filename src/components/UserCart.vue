<template>
  <router-view></router-view>
  <div class="header">
    <ElButton type="text" @click="goToHome">商城首页</ElButton>
    <ElButton type="text" @click="goToSort">分类</ElButton>
    <ElButton type="text" @click="goToCart">购物车</ElButton>
    <ElButton type="text" @click="goToOrder">我的订单</ElButton>
    <div style="width: 90%;height: 30px;display: flex;flex-direction: row;justify-content: right;">
      <ElButton type="text" @click="logout">退出登录</ElButton>
    </div>
  </div>
  <div class="rootdiv">
    <div class="fixed-div">
      <div style="width: 20px;"></div>
      <div style="display: flex;flex-direction: column;">
        <ElCheckbox @change="selectAll(all)" v-model="all" style="margin-top: 9px;" />
      </div>
      <h4 style="margin-top: 13px;margin-bottom: 0px;">全选</h4>
      <div style="width: 400px;"></div>
      <h4 style="margin-top: 13px;margin-bottom: 0px;">已选择{{ selectNum }}件商品</h4>
      <div style="width: 20px;"></div>
      <h4 style="margin-top: 13px;margin-bottom: 0px;">合计：￥{{ total }}</h4>
      <div style="width: 200px;"></div>
      <ElButton type="primary" @click="pay">结算</ElButton>
    </div>
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
        <div v-for="(item, index) in cartItems" :key="item.itemId" class="cartItem">
          <div style="width: 20px;"></div>
          <div style="display: flex;flex-direction: column;margin-top: 60px;">
            <ElCheckbox @change="checkAllSelected; console.log(selectedItems)" v-model="selectedItems[index]">
            </ElCheckbox>
          </div>
          <div style="width: 50px;">
            {{ index + 1 }}
          </div>
          <img :src="showImg(item.itemId) ?? 'default-image-url.jpg'" alt="商品图片" style="width: 150px;height: 150px;" />
          <div style="width: 170px;height: 150px;display: flex;justify-content: center;flex-direction: column;">
            {{ item.itemName }}
          </div>
          <div style="width: 230px;height: 150px;display: flex;justify-content: center;flex-direction: column;">
            <!-- {{ item.description }} -->
            我是描述
          </div>
          <div style="width: 120px;height: 150px;display: flex;justify-content: center;flex-direction: column;">
            ￥{{ item.price }}
          </div>
          <div style="width: 80px;height: 150px;display: flex;justify-content: center;flex-direction: column;">
            <ElButton type="text" @click="deleteItem(item.itemId, item.userId)">删除</ElButton>
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
import { Address } from '../models/Address';

export default {
  name: 'UserCart',
  setup() {
    const router = useRouter();
    const userId = localStorage.getItem('userId');
    const cartItems = ref<ShoppingCart[]>([]);
    const selectedItems = ref<boolean[]>([]);
    const all = ref<boolean>(false); // 全选状态
    const prices = ref<number[]>([]);
    const address = ref<Address[]>([]);
    const itemIdList = ref<String[]>([]);
    const goToCart = () => {
      router.push('/UserCart');
    };
    const goToOrder = () => {
      router.push('/UserOrder');
    };
    const goToHome = () => {
      router.push('/UserHome');
    };
    const goToSort = () => {
      router.push('/UserSort')
    }
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
      const response = await axios.get(`http://localhost:4001/diary-server/shoppingCart/0/100/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token'),
        },
      });
      if (response.status === 200) {
        cartItems.value = response.data.data.records;
        initSelected();
        prices.value = cartItems.value.map((item) => item.price);
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
      all.value = selectedItems.value.every((item) => item === true);
    });

    const total = computed(() => {
      return selectedItems.value.reduce((sum, isSelected, index) => {
        return isSelected ? sum + prices.value[index] : sum;
      }, 0);
    });

    const selectNum = computed(() => {
      return selectedItems.value.reduce((sum, isSelected) => {
        return isSelected ? sum + 1 : sum;
      }, 0);
    });

    const deleteItem = async (itemId: String, userId: String) => {
      const response = await axios.delete(`http://localhost:4001/diary-server/shoppingCart/deleteItem/${itemId}/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token'),
        },
      });
      if (response.status === 200) {
        alert('删除成功');
        await getCart();
      }
    };

    const getAddress = async () => {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:4001/diary-server/address/getUserAddress/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token'),
        }
      });
      if (response.status === 200) {
        address.value = response.data.data;
        console.log('address:', address.value);

      }
    }

    const pay = async () => {
      updateItemIdList();
      const response = await axios.post(`http://localhost:4001/diary-server/shoppingCart/pay`, {
        'address': address.value[0],
        'itemIdList': itemIdList.value,
        'price': total.value,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token'),
        },
      });

      if (response.status === 200) {
        alert('下单成功');

        for (let i = 0; i < selectedItems.value.length; i++) {
          if (selectedItems.value[i]) {
            await deleteItem(cartItems.value[i].itemId, cartItems.value[i].userId);
          }
        }

        await getCart();
      }

    }
    const updateItemIdList = () => {
      itemIdList.value = cartItems.value
        .filter((_item, index) => selectedItems.value[index])
        .map(item => item.itemId);
    };

    const getImg = async (itemId: string): Promise<string> => {
      const response = await axios.get(`http://localhost:4001/diary-server/item/getImg/${itemId}`, {
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token'),
        },
      });
      console.log('photores', response)
      if (response.status === 200) {
        localStorage.setItem(itemId, response.data.message);
        const photo = response.data.message;
        console.log('photo:', photo);
        return photo;
      }
      return '';
    };

    const showImg = (itemId: string) => {
      getImg(itemId);
      if (localStorage.getItem(itemId) != null) {
        return localStorage.getItem(itemId);
      } else {
        return undefined;
      }

    }


    onMounted(async () => {
      await getCart();
      await getAddress();
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
      total,
      selectNum,
      deleteItem,
      pay,
      showImg,
      goToSort
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
  justify-content: left;
  /* 水平方向靠左 */
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

.fixed-div {
  position: fixed;
  bottom: 0px;
  /* 距离顶部10px */
  width: 60%;
  height: 50px;
  background-color: rgb(231, 231, 231);
  z-index: 1000;
  /* 设置较大的 z-index 值 */
  display: flex;
  flex-direction: row;
}
</style>