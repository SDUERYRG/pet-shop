<template>
    <RouterView></RouterView>
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
        <div class="usermain">
            <div class="headdiv">
                <h1>分类</h1>
            </div>
            <div class="maindown">
                <div class="index">
                    <ElButton type="text" @click="selectItemsBySort(1)">狗</ElButton>
                    <ElButton type="text" @click="selectItemsBySort(2)">猫</ElButton>
                    <ElButton type="text" @click="selectItemsBySort(3)">猪</ElButton>
                    <ElButton type="text" @click="selectItemsBySort(4)">鸡</ElButton>
                    <ElButton type="text" @click="selectItemsBySort(5)">鸟</ElButton>
                </div>
                <div class="index">
                    <div style="width: 70px;"></div>
                    <h4 style="margin-top: 3px;margin-bottom: 0px;">图片</h4>
                    <div style="width: 120px;"></div>
                    <h4 style="margin-top: 3px;margin-bottom: 0px;">商品名</h4>
                    <div style="width: 120px;"></div>
                    <h4 style="margin-top: 3px;margin-bottom: 0px;">详细信息</h4>
                    <div style="width: 170px;"></div>
                    <h4 style="margin-top: 3px;margin-bottom: 0px;">单价</h4>
                    <div style="width: 110px;"></div>
                    <h4 style="margin-top: 3px;margin-bottom: 0px;">操作</h4>
                </div>
                <div v-for="(item, index) in futureItems" :key="item.itemId" class="cartItem">
                    <div style="width: 20px;"></div>
                    <div style="width: 50px;">
                        {{ index + 1 }}
                    </div>
                    <img :src="item.picture" alt="商品图片" style="width: 150px;height: 150px;" />
                    <div
                        style="width: 170px;height: 150px;display: flex;justify-content: center;flex-direction: column;">
                        {{ item.itemName }}
                    </div>
                    <div
                        style="width: 230px;height: 150px;display: flex;justify-content: center;flex-direction: column;">
                        {{ item.description }}
                    </div>
                    <div
                        style="width: 120px;height: 150px;display: flex;justify-content: center;flex-direction: column;">
                        ￥{{ item.price }}
                    </div>
                    <div
                        style="width: 80px;height: 150px;display: flex;justify-content: center;flex-direction: column;">
                        <ElButton type="text" @click="addToShoppingCart(item)">添加至购物车</ElButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { useRouter } from 'vue-router';
import { Item } from '../models/Item';
import { onMounted, ref } from 'vue';
export default {
    name: 'Sort',
    setup() {
        const futureItems = ref<Item[]>([]);
        const router = useRouter();
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
        const selectItemsBySort = async (sortId: number) => {
            const response = await axios.get(`http://localhost:4001/diary-server/sort/selectItemBySortId/${sortId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('token'),
                }
            })
            console.log(response);
            if (response.status == 200) {
                futureItems.value = response.data.data;
                console.log(futureItems.value);

            }
        }

        const addToShoppingCart = async (item: Item) => {
            const url = 'http://localhost:4001/diary-server/shoppingCart/addToShoppingCart';
            const headers = {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token') // 假设 token 存储在 localStorage 中
            };
            const body = {
                itemId: item.itemId,
                userId: localStorage.getItem('userId'),
                price: item.price
            };
            try {
                const response = await axios.post(url, body, { headers });
                const responseBody = response.data;
                console.log(responseBody);
                // const text = responseBody.message;
                if (responseBody.status === true) {
                    alert(responseBody.message);
                } else {
                    alert(responseBody.message);
                }
            } catch (error) {
                console.error('请求失败', error);

            }
        }
        onMounted(async () => {
            await selectItemsBySort(1);
        });
        return {
            goToCart,
            goToOrder,
            goToHome,
            logout,
            goToSort,
            selectItemsBySort,
            futureItems,
            addToShoppingCart
        }
    }
}
</script>

<style scoped>
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

.rootdiv {
    width: 100%;
    height: fit-content;
    /* background-color: antiquewhite; */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.usermain {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
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