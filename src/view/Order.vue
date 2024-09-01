<template>
    <div class="header">
        <div class="headup">

        </div>
        <div class="headown">
            <div style="width: 30%;">
                <h4>订单管理</h4>
            </div>
            <div style="width: 40%;">
            </div>
            <div style="width: 30%;display: flex;flex-direction: row;">
            </div>
        </div>
        <div>
            <ElTable :data="orders" stripe="true" style="width: 100%;">
                <ElTableColumn prop="orderNum" label="订单号" width="150" />
                <ElTableColumn prop="state" label="状态" width="80" />
                <ElTableColumn prop="orderTime" label="下单时间" width="180" />
                <ElTableColumn prop="deliverTime" label="发货时间" width="180" />
                <ElTableColumn prop="receiptTime" label="签收时间" width="180" />
                <ElTableColumn prop="userId" label="用户id" width="120" />
                <ElTableColumn prop="price" label="价格" width="100" />
                <ElTableColumn label="操作" width="180">
                    <template #default="scope">
                        <ElButton type="primary"
                            @click="fetchOrderItems(scope.row.orderId, scope.row.orderNum); dialogVisible = true;">查看
                        </ElButton>
                        <ElButton type="danger" @click="deliver(scope.row)">发货</ElButton>
                    </template>
                </ElTableColumn>
            </ElTable>
        </div>
        <ElDialog title="订单详情" v-model="dialogVisible" :width="350">
            <div class="dialogrow">
                <div>订单号</div>
                <div>{{ orderItems?.orderNum }}</div>
            </div>
            <div class="dialogrow">
                <div>下单时间</div>
                <div>{{ orderItems?.orderTime }}</div>
            </div>
            <div class="dialogrow">
                <div>用户名</div>
                <div>{{ orderItems?.userName }}</div>
            </div>
            <div class="dialogrow">
                <div>地址</div>
                <div>{{ orderItems?.address }}</div>
            </div>
            <div v-for="(itemId, index) in orderItems?.itemId || []" :key="index">
                <div class="dialogrow">
                    <div>物品ID: </div>
                    <div>{{ itemId }}</div>
                </div>
                <div class="dialogrow">
                    <div>物品名称: </div>
                    <div>{{ orderItems?.itemName[index] }}</div>
                </div>
            </div>
            <div class="dialogrow">
                <div>总价</div>
                <div>{{ orderItems?.price }}</div>
            </div>


        </ElDialog>
    </div>
</template>
<script lang="ts">
import { ref } from 'vue';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import axios from 'axios';
import { onMounted } from 'vue';
export default {
    name: 'Order',
    setup() {
        const orders = ref<Order[]>([]);
        let orderItems = ref<OrderItem | null>(null);
        const fetchOrderItems = async (orderId: string, orderNum: string) => {
            const url = `http://192.168.1.5:4001/diary-server/order/show/${orderId}/${orderNum}`;
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found');
                }
                const response = await axios.get(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token,
                    },
                });
                const responseBody = response.data;
                console.log(responseBody);
                if (responseBody.status === true) {
                    // 处理数据
                    const record = response.data.data;
                    orderItems.value = record;
                    console.log('orderItems:', orderItems.value);

                } else {
                    // 处理错误
                    console.error(`请求失败，状态码：${response.status}`);
                    throw new Error(`请求失败，状态码：${response.status}`);
                }
            } catch (error) {
                console.error('fetchOrderItems error:', error);
                throw error;
            }
        };
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found');
                }
                const response = await axios.get(`http://localhost:4001/diary-server/order/0/100`, {
                    headers: {
                        'token': token,
                    }
                });
                const records = response.data.data.records;
                orders.value = records.map((record: any) => Order.fromJson(record));
                console.log('orders:', orders.value);
            } catch (error) {
                console.error('fetchOrders error:', error);
            }
        }

        const deliver = async (order: Order) => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found');
                }
                const response = await axios.get(`http://localhost:4001/diary-server/order/deliverGoods/${order.orderId}`, {
                    headers: {
                        'token': token,
                    }
                });
                console.log('deliver response:', response.data);
                fetchOrders();
            } catch (error) {
                console.error('deliver error:', error);
            }
        }
        onMounted(() => {
            fetchOrders();

        });
        return {
            orders,
            fetchOrders,
            deliver,
            fetchOrderItems,
            orderItems
        };
    },
    data() {
        return {
            dialogVisible: false,
        };
    },
}
</script>

<style scoped>
.dialogrow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
}
</style>