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
    <div class="search">
        <ElInput class="custom-input" placeholder="请输入宠物名称" style="width: 20%;height: 50px;border-radius: 0;"></ElInput>
        <ElButton style="height: 50px;width: 70px;border: 2px solid #409EFF;">搜索</ElButton>
    </div>
    <div class="imagediv">
        <ElCarousel trigger="click" class="image">
            <ElCarouselItem>
                <img height="300px" src="https://ice.frostsky.com/2024/08/19/f82bff9bcb5e1f74294f29bf5aa7ef7d.jpeg"
                    alt="f82bff9bcb5e1f74294f29bf5aa7ef7d.jpeg" />
                <img height="300px" src="https://ice.frostsky.com/2024/08/31/b79ac4b45d4f4593e54494afa5c100ca.jpeg"
                    alt="774f2732d91e25ac4bea6f9f35a9df4d.jpeg">
            </ElCarouselItem>
            <ElCarouselItem>
                <img height="300px" src="https://ice.frostsky.com/2024/08/31/ca878e09ccdb9a367e3588bf17c443ac.jpeg"
                    alt="5f8c6690eb68210184411ea17cd27788.jpeg">
                <img height="300px" src="https://ice.frostsky.com/2024/08/31/89760d4213644de3ea50874f217fa54b.jpeg"
                    alt="6e03c4b59842db9bf240cc6b2953f764.jpeg">
            </ElCarouselItem>
            <ElCarouselItem>
                <img height="300px" src="https://ice.frostsky.com/2024/08/27/af5e5f472c2f4e3e8bb65af3516457aa.jpeg"
                    alt="5b3ce19253eb5664725ed8f469bd22a2.jpeg">
                <img height="300px" src="https://ice.frostsky.com/2024/08/27/cc59785158784697b4c3043d3bec10a8.jpeg"
                    alt="3518b3660556b2116e8a30498cd2e6b5.jpeg">
            </ElCarouselItem>
            <ElCarouselItem>
                <img height="300px" src="https://ice.frostsky.com/2024/08/27/5f8c6690eb68210184411ea17cd27788.jpeg"
                    alt="cc59785158784697b4c3043d3bec10a8.jpeg">
                <img height="300px" src="https://ice.frostsky.com/2024/08/27/6e03c4b59842db9bf240cc6b2953f764.jpeg"
                    alt="af5e5f472c2f4e3e8bb65af3516457aa.jpeg">
            </ElCarouselItem>
        </ElCarousel>
    </div>
    <center>
        <h1>全部宠物</h1>
    </center>
    <div class="all">
        <div class="all-wrap">
            <div v-for="(row, rowIndex) in groupedItems" :key="rowIndex" class="allrow">
                <div v-for="item in row" :key="item.itemId" class="allitem">
                    <img :src="item.picture" :alt="item.itemName" width="100" height="100">

                    <div style="width: 150px;margin-left: 20px;">
                        {{ item.itemName }}
                        <p>{{ item.description }}</p>
                        <p>价格: {{ item.price }}</p>
                    </div>
                    <div style="width: 120px;height: 100%;">
                    </div>
                    <div style="display: flex;flex-direction: column;justify-content: center;">
                        <ElButton type="text" @click="addToShoppingCart(item)">添加至购物车</ElButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="foot">

    </div>
</template>

<script lang="ts">
import { Item } from '../models/Item';
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    name: 'UserHome',
    setup() {
        const items = ref<Item[]>([]);
        const router = useRouter();
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:4001/diary-server/item/1/100');
                console.log('response:', response.data.data.records);
                items.value = response.data.data.records.map((itemData: any) => new Item(
                    itemData.itemId,
                    itemData.itemName,
                    itemData.picture,
                    itemData.stock,
                    itemData.description,
                    itemData.sell,
                    itemData.price,
                    itemData.discount,
                    itemData.score,
                ));
                console.log('商品信息获取成功:', items);
                console.log('商品信息获取成功:', items.value.length);
            } catch (error) {
                console.error('获取商品信息失败:', error);
            }
        };
        const groupedItems = computed(() => {
            const rows = [];
            for (let i = 0; i < items.value.length; i += 2) {
                rows.push(items.value.slice(i, i + 2));
            }
            return rows;
        });

        const goToCart = () => {
            router.push('/UserCart');
        }
        const goToOrder = () => {
            router.push('/UserOrder');
        }
        const goToHome = () => {
            router.push('/UserHome');
        }
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
            console.log('response:', response.status);
            if (response.status === 200) {
                localStorage.removeItem('token');
                router.push('/UserLogin');
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
        onMounted(() => {
            fetchItems();
        });
        return {
            items,
            fetchItems,
            groupedItems,
            goToCart,
            goToOrder,
            goToHome,
            logout,
            goToSort,
            addToShoppingCart
        };
    },
}
</script>

<style scoped>
/* Add your component styles here */
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

.search {
    /* background-color: darkviolet; */
    width: 100%;
    height: 170px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    /* 水平方向居中 */
}

.custom-input {
    border: 2px solid #409EFF;
}

.imagediv {
    width: 100%;
    height: 300px;
    /* background-color: darkorange; */
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    /* 水平方向居中 */
}

.image {
    /* background-color: darkorchid; */
    width: 600px;
    height: 300px;
}

.all {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* 水平方向居中 */
}

.all-wrap {
    background-color: #F5F5F5;
    width: 1000px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* 水平方向居中 */
}

.allrow {
    width: 1000px;
    height: 100px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 20px;
}

.allitem {
    width: 500px;
    height: 100px;
    display: flex;
    flex-direction: row;
    justify-content: left;
}

.foot {
    margin-top: 40px;
    background-color: darkslategrey;
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    /* 水平方向居中 */
}
</style>