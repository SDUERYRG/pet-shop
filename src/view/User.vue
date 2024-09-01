<template>
  <div class="header">
    <div class="headup">

    </div>
    <div class="headown">
      <div style="width: 30%;">
        <h4>用户管理</h4>
      </div>
      <div style="width: 40%;">
      </div>
      <div style="width: 30%;display: flex;flex-direction: row;">
        <ElInput v-model="searchKey" placeholder="请输入搜索关键字" clearable />
        <ElButton type="primary" @click="searchUsers()">搜索</ElButton>
        <ElButton type="success" @click="dialogVisible = true; showAddDialog()">添加</ElButton>
      </div>
    </div>
  </div>
  <div class="table-container">
    <ElTable :data="users" stripe="true" style="width: 100%">
      <ElTableColumn prop="userId" label="用户ID" width="80" />
      <ElTableColumn prop="userName" label="名称" width="200" />
      <ElTableColumn prop="account" label="账号" width="180" />
      <ElTableColumn prop="power" label="权限" width="80" />
      <ElTableColumn prop="regTime" label="注册时间" width="180" />
      <ElTableColumn prop="email" label="邮箱" width="280" />
      <ElTableColumn prop="sex" label="性别" width="70" />
      <ElTableColumn prop="txPicture" label="头像图片名" width="200" />
      <ElTableColumn label="操作" width="180">
        <template #default="scope">
          <ElButton type="primary" @click="dialogVisible = true; showEditDialog(scope.row)">修改</ElButton>
          <ElButton type="danger" @click="deleteUser(scope.row.userId)">删除</ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>

  <ElDialog @close="dialogVisible = false" v-model="dialogVisible" :title="dialogTitle" width="500">
    <ElForm label-width="80px">
      <ElFormItem label="用户名">
        <ElInput v-model="userName" />
      </ElFormItem>
      <ElFormItem label="账号">
        <ElInput v-model="account" />
      </ElFormItem>
      <ElFormItem label="密码">
        <ElInput v-model="password" />
      </ElFormItem>
      <ElFormItem label="权限">
        <ElInput v-model="power" />
      </ElFormItem>
      <ElFormItem label="邮箱">
        <ElInput v-model="email" />
      </ElFormItem>
      <ElFormItem label="性别">
        <ElInput v-model="sex" />
      </ElFormItem>
    </ElForm>
    <div style="display: flex; justify-content: center; padding: 10px;">
      <ElButton @click="dialogVisible = false">取消</ElButton>
      <ElButton type="primary" @click="dialogVisible = false; handleConfirm()">确认</ElButton>
    </div>
  </ElDialog>
</template>

<script lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { User } from '../models/User';
import { ElButton, ElDialog, ElInput } from 'element-plus';
export default {
  name: 'User',
  setup() {
    const users = ref<User[]>([]);
    const searchKey = ref('');
    const password = ref('');
    const userName = ref('');
    const account = ref('');
    const power = ref('');
    const email = ref('');
    const sex = ref('');
    const userId = ref('');
    const dialogVisible = ref(false);
    const dialogTitle = ref('');
    const isEditMode = ref(false);
    const file = ref<File | null>(null);

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4001/diary-server/all/1/100');
        console.log('response:', response.data.data.records);
        users.value = response.data.data.records.map((userData: any) => new User(
          userData.userId,
          userData.userName,
          userData.account,
          userData.password,
          userData.power,
          new Date(userData.regTime),
          userData.email,
          userData.sex,
          userData.introduce,
          userData.txPicture,
          userData.code
        ));
        console.log('用户信息获取成功:', users);
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    };

    const showEditDialog = (user: User) => {
      userName.value = user.userName;
      account.value = user.account;
      power.value = user.power;
      email.value = user.email;
      sex.value = user.sex;
      userId.value = user.userId;
      dialogTitle.value = '修改用户信息';
      isEditMode.value = true;
      dialogVisible.value = true;
    };

    const showAddDialog = () => {
      clear();
      dialogTitle.value = '添加用户';
      isEditMode.value = false;
      dialogVisible.value = true;
    };

    const clear = () => {
      userName.value = '';
      account.value = '';
      password.value = '';
      power.value = '';
      email.value = '';
      sex.value = '';
    };

    const deleteUser = async (userId: String) => {
      try {
        const response = await axios.delete(`http://localhost:4001/diary-server/${userId}`);
        console.log('response:', response.data);
        alert(response.data.message);
        fetchUsers();
      } catch (error) {
        console.error('删除用户失败:', error);
      }
    };

    const searchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/diary-server/search/0/100`, {
          params: {
            'keyword': searchKey.value,
          }
        });
        users.value = response.data.data.records.map((userData: any) => new User(
          userData.userId,
          userData.userName,
          userData.account,
          userData.password,
          userData.power,
          new Date(userData.regTime),
          userData.email,
          userData.sex,
          userData.introduce,
          userData.txPicture,
          userData.code
        ));
        console.log('搜索用户成功:', users);
      } catch (error) {
        console.error('搜索用户失败:', error);
      }
    };

    const updateUser = async () => {
      try {
        const response = await axios.put(`http://localhost:4001/diary-server/updateUser`, {
          userId: userId.value,
          userName: userName.value,
          account: account.value,
          password: password.value,
          power: power.value,
          email: email.value,
        });
        alert(response.data.message);

        fetchUsers();
      } catch (error) {
        console.error('更新用户失败:', error);
      }
    };

    const addUser = async () => {
      try {
        const response = await axios.post(`http://localhost:4001/diary-server/addUser`, {
          userId: (users.value.length + 1).toString(),
          userName: userName.value,
          account: account.value,
          password: password.value,
          power: power.value,
          email: email.value,
          sex: sex.value,
          txPicture: 'photo' + (users.value.length + 1).toString() + '.jpg',
        });
        alert(response.data.message);
        fetchUsers();
      } catch (error) {
        console.error('添加用户失败:', error);
      }
    };

    const handleConfirm = () => {
      if (isEditMode.value) {
        updateUser();
      } else {
        addUser();
      }
      dialogVisible.value = false;
      clear();
    };
    onMounted(() => {
      fetchUsers();
    });

    return {
      users,
      deleteUser,
      searchKey,
      searchUsers,
      fetchUsers,
      showEditDialog,
      showAddDialog,
      userName,
      account,
      password,
      power,
      email,
      sex,
      updateUser,
      userId,
      clear,
      addUser,
      dialogVisible,
      dialogTitle,
      handleConfirm,
      file
    };
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      isEditMode: false,
    };
  },
};
</script>

<style scoped>
.table-container {
  overflow: visible;
}
</style>