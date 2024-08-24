<template>
    <div class="header">
      <div class="headup">

      </div>
      <div class="headown">
        <div style="width: 30%;">
          <h4>购物车管理</h4>
        </div>
        <div style="width: 30%;">

        </div>
        <div style="width: 40%;display: flex;flex-direction: row;">
          <ElInput v-model="searchItem" placeholder="请输入商品名称" clearable />
          <ElInput v-model="searchUser" placeholder="请输入用户名" clearable />
          <ElButton type="primary" @click="preSearch()">搜索</ElButton>
        </div>
      </div>
    </div>
    <div>
        <ElTable :data="carts" stripe="true" style="width: 100%;">
            <ElTableColumn prop="cartId" label="购物车ID" width="100" />
            <ElTableColumn prop="itemId" label="商品ID" width="80" />
            <ElTableColumn prop="userId" label="用户ID" width="80" />
            <ElTableColumn prop="itemName" label="商品名称" width="180" />
            <ElTableColumn prop="userName" label="用户名" width="180" />
            <ElTableColumn prop="quantity" label="数量" width="60" />
            <ElTableColumn prop="price" label="价格" width="120" />
        </ElTable>
    </div>
</template>
<script lang="ts">
import { onMounted, ref } from 'vue';
import { ShoppingCart } from '../models/ShoppingCart';
import axios from 'axios';
import { ElTableColumn } from 'element-plus';
export default {
    name: 'Cart',
    setup() {
        const carts = ref<ShoppingCart[]>([]);
        const searchItem = ref('');
        const searchUser = ref('');
        const fetchCarts = async () => {
            try{
                // 从本地存储中获取 token
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('Token not found');
                }
                const response = await axios.get('http://localhost:4001/diary-server/shoppingCart/0/10', {
                    headers: {
                        'token': token,
                    }
                });
                console.log('response:', response.data.data.records);
                carts.value = response.data.data.records.map((cartData: any) => new ShoppingCart(
                    cartData.cartId,
                    cartData.itemId,
                    cartData.userId,
                    cartData.itemName,
                    cartData.userName,
                    cartData.quantity,
                    cartData.price,
                ));
                console.log('购物车信息获取成功:', carts);
            } catch (error) {
                console.error('获取购物车信息失败:', error);
            }
        };
        const searchCartsByItem = async () => {
            try {
                const response = await axios.get(`http://localhost:4001/diary-server/shoppingCart/searchByItem/0/10`,{
                    headers: {
                        'token': localStorage.getItem('token'),
                    },
                    params: {
                        itemName: searchItem.value,
                    },
                },);
                console.log('response:', response.data.data.records);
                carts.value = response.data.data.records.map((cartData: any) => new ShoppingCart(
                    cartData.cartId,
                    cartData.itemId,
                    cartData.userId,
                    cartData.itemName,
                    cartData.userName,
                    cartData.quantity,
                    cartData.price,
                ));
                console.log('搜索购物车信息成功:', carts);
            }  catch (error) {
                console.error('搜索购物车信息失败:', error);
            }
        };
        const searchCartsByUser = async () => {
            try {
                const response = await axios.get(`http://localhost:4001/diary-server/shoppingCart/searchByUser/0/10`,{
                    headers: {
                        'token': localStorage.getItem('token'),
                    },
                    params: {
                        userName: searchUser.value,
                    },
                },);
                console.log('response:', response.data.data.records);
                carts.value = response.data.data.records.map((cartData: any) => new ShoppingCart(
                    cartData.cartId,
                    cartData.itemId,
                    cartData.userId,
                    cartData.itemName,
                    cartData.userName,
                    cartData.quantity,
                    cartData.price,
                ));
                console.log('搜索购物车信息成功:', carts);
            }  catch (error) {
                console.error('搜索购物车信息失败:', error);
            }
        };
        const preSearch = async () => {
            if(searchItem.value=='' && searchUser.value==''){
                fetchCarts();
            }else if(searchItem.value!=''){
                searchCartsByItem();
            }else {
                searchCartsByUser();
            }
        }
        onMounted(() => {
        fetchCarts();
    });
        return {
            carts,
            searchItem,
            searchUser,
            preSearch,
        };
    },
    
}
</script>