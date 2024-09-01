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
        <div class="usermain">
            <div class="headdiv">
                <h1>我的订单</h1>
            </div>
            <div class="maindown">
                <div class="index">
                    <h4 style="margin-top: 0px;margin-bottom: 0px;">订单详情</h4>
                    <div style="width: 40%;"></div>
                    <h4 style="margin-top: 0px;margin-bottom: 0px;">收货人</h4>
                    <div style="width: 9%;"></div>
                    <h4 style="margin-top: 0px;margin-bottom: 0px;">金额</h4>
                    <div style="width: 10%;"></div>
                    <h4 style="margin-top: 0px;margin-bottom: 0px;">当前状态</h4>
                    <div style="width: 8%;"></div>
                    <h4 style="margin-top: 0px;margin-bottom: 0px;">操作</h4>
                </div>
                <div class="orderItem" v-for="order in orderItems" :key="order.orderId">
                    <div class="orderheader">
                        下单日期：{{ order.orderTime }}
                        <div style="width: 40px;"></div>
                        订单号：{{ order.orderNum }}
                    </div>
                    <div style="display: flex;flex-direction: row;width: 100%;">
                        <div style="width: 47%;">
                            <div class="imgname" v-for="(itemName, index) in order.orderDetail?.itemName"
                                :key="order.orderDetail?.itemId[index]">
                                <div class="img">
                                    <img :src="showImg(order.orderDetail!.itemId[index]) ?? 'default-image-url.jpg'"
                                        :alt="showImg(order.orderDetail!.itemId[index]) ?? ''"
                                        style="width: 100px;height: 100px;">
                                </div>
                                <div style="width: 60%;display: flex;flex-direction: column;justify-content: center;">
                                    商品名称：{{ itemName }}
                                </div>
                            </div>
                        </div>
                        <div style="width: 15%;display: flex;flex-direction: column;justify-content: center;">
                            {{ order.orderDetail?.userName }}
                        </div>
                        <div style="width: 15%;display: flex;flex-direction: column;justify-content: center;">
                            ￥{{ order.price }}
                        </div>
                        <div style="width: 12%;display: flex;flex-direction: column;justify-content: center;">
                            {{ order.state }}
                        </div>
                        <div style="width: 10%;display: flex;flex-direction: column;justify-content: center;">
                            <ElButton type="text" @click="receive(order)">确认收货</ElButton>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Order } from '../models/Order';
import { onMounted } from 'vue';
import { OrderItem } from '../models/OrderItem';

export default {
    name: 'UserOrder',
    setup() {
        const router = useRouter();
        const orderItems = ref<Order[]>([]);
        const orderDetails = ref<OrderItem[]>([]);
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
        const getOrder = async () => {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`http://localhost:4001/diary-server/order/userOrder/${userId}/0/100`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('token'),
                },
            });
            if (response.status === 200) {
                orderItems.value = response.data.data.records;
                console.log('orderItems:', orderItems.value);

            }
        }

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

        const getOrderDetail = async (orderId: String, orderNum: String) => {
            const response = await axios.get(`http://localhost:4001/diary-server/order/show/${orderId}/${orderNum}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('token'),
                },
            });
            if (response.status === 200) {
                console.log(response);

                return response.data.data;
            }
        }

        const setOrderDeatil = async () => {
            for (let i = 0; i < orderItems.value.length; i++) {
                orderItems.value[i].orderDetail = await getOrderDetail(orderItems.value[i].orderId, orderItems.value[i].orderNum);
            }
            console.log('orderItems:', orderItems.value);

        }

        const showImg = (itemId: string) => {
            getImg(itemId);
            if (localStorage.getItem(itemId) != null) {
                return localStorage.getItem(itemId);
            } else {
                return undefined;
            }

        }

        const receive = async (order: Order) => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found');
                }
                const response = await axios.get(`http://localhost:4001/diary-server/order/receive/${order.orderId}`, {
                    headers: {
                        'token': token,
                    }
                });

                console.log('deliver response:', response.data);
                if (response.data.status == true) {
                    alert("签收成功");
                    await getOrder();
                    await setOrderDeatil();
                } else {
                    alert("签收失败");
                }
            } catch (error) {
                console.error('deliver error:', error);
            }
        }



        onMounted(async () => {
            await getOrder();
            await setOrderDeatil();
        });
        return {
            goToCart,
            goToOrder,
            goToHome,
            logout,
            orderItems,
            getOrderDetail,
            orderDetails,
            getImg,
            showImg,
            goToSort,
            receive
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

.orderItem {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: fit-content;
    border: #808080 1px solid;
}

.orderheader {
    display: flex;
    flex-direction: row;
    background-color: #acacac;
    width: 100%;
    height: 25px;
    font-size: small;
}

.orderbody {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100px;
    background-color: aqua;
    margin-top: 10px;
    margin-bottom: 10px;
}

.img {
    /* background-color: antiquewhite; */
    width: 100px;
    height: 100px;
}

.imgname {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100px;
    /* background-color: antiquewhite; */
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>