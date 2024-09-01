<template>
    <!-- <router-view></router-view> -->
    <div class="header">
        <div class="headup">

        </div>
        <div class="headown">
            <div style="width: 30%;">
                <h4>分类</h4>
            </div>
            <div style="width: 60%;">

            </div>
            <div style="width: 10%;display: flex;flex-direction: row;">
                <ElButton type="success" @click="showAddDialog(); dialogVisible = true">添加</ElButton>
            </div>
        </div>
    </div>
    <div>
        <ElTable :data="sorts" stripe="true" style="width: 100%">
            <ElTableColumn prop="sortId" label="分类Id" style="width: 20%;" />
            <ElTableColumn prop="sortName" label="分类名" style="width: 20%;" />
            <ElTableColumn prop="itemId" label="商品Id" style="width: 20%;" />
            <ElTableColumn prop="itemName" label="商品名" style="width: 20%;" />
            <ElTableColumn label="操作" width="180">
                <template #default="scope">
                    <ElButton type="danger" @click="deleteSort(scope.row.sortId)">删除</ElButton>
                </template>
            </ElTableColumn>
        </ElTable>
    </div>
    <ElDialog @close="dialogVisible = false" v-model="dialogVisible" :title="dialogTitle" width="500">
        <ElForm label-width="80px">
            <ElFormItem label="分类Id">
                <ElInput v-model="sortId" />
            </ElFormItem>
            <ElFormItem label="分类名">
                <ElInput v-model="sortName" />
            </ElFormItem>
            <ElFormItem label="商品名">
                <ElInput v-model="itemName" />
            </ElFormItem>
        </ElForm>
        <div style="display: flex; justify-content: center; padding: 10px;">
            <ElButton @click="dialogVisible = false">取消</ElButton>
            <ElButton type="primary" @click="dialogVisible = false; handleConfirm()">确认</ElButton>
        </div>
    </ElDialog>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { Sort } from '../models/Sort.ts'
import axios from 'axios';
export default {
    name: 'Sort',
    setup() {
        const sorts = ref<Sort[]>([])
        const dialogVisible = ref(false);
        const dialogTitle = ref('');
        const sortId = ref('');
        const sortName = ref('');
        const itemName = ref('');
        const fetchSorts = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Token not found');
            }
            const response = await axios.get('http://localhost:4001/diary-server/sort/1/100', {
                headers: {
                    'token': token,
                }
            });
            console.log(response);
            if (response.status == 200) {
                sorts.value = response.data.data.records.map((sortData: any) => new Sort(
                    sortData.sortId,
                    sortData.sortName,
                    sortData.itemName,
                    sortData.itemId,


                    sortData.purposeArray
                ));
                console.log('rec:', sorts.value)
            }
        }

        const showAddDialog = () => {
            clear();
            dialogTitle.value = '添加用户';
            dialogVisible.value = true;
        };
        const clear = () => {
            sortId.value = '';
            sortName.value = '';
            itemName.value = '';
        };

        const deleteSort = async (sortId: String) => {
            const response = await axios.delete(`http://localhost:4001/diary-server/sort/${sortId}`, {
                headers: {
                    'token': localStorage.getItem('token'),
                }
            });
            console.log(response);
            if (response.status == 200) {
                alert("删除成功");
                await fetchSorts();
            }
        }

        const handleConfirm = async () => {
            const url = 'http://localhost:4001/diary-server/sort';
            const headers = {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token') // 假设 token 存储在 localStorage 中
            };
            const body = {
                sortId: sortId.value,
                sortName: sortName.value,
                itemName: itemName.value
            };
            const response = await axios.post(url, body, { headers });
            console.log(response);
            if (response.status == 200) {
                alert("添加成功");
                await fetchSorts();
            }
        }
        onMounted(() => {
            fetchSorts();
        });

        return {
            sorts,
            fetchSorts,
            dialogVisible,
            dialogTitle,
            sortId,
            showAddDialog,
            sortName,
            itemName,
            deleteSort,
            handleConfirm

        }
    }
}
</script>