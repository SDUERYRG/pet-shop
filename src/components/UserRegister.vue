<template>
    <div class="container">
        <div class="loginCard">
            <ElInput class=loginInput v-model="account" placeholder="请输入账号" />
            <ElInput class=loginInput v-model="userName" placeholder="请输入用户名" />
            <ElInput class=loginInput type=password v-model="password" placeholder="请输入密码" />
            <ElInput class=loginInput type=password v-model="confirm" placeholder="请确认密码" />
            <ElInput class=loginInput v-model="email" placeholder="请输入邮箱" />
            <ElButton class=loginButton type="primary" @click="sendCode()">发送验证码</ElButton>
            <ElInput class=loginInput v-model="code" placeholder="请输入验证码" />
            <ElButton class=loginButton type="primary" @click="register()">注册</ElButton>
            <ElButton style="margin-top: 10px;margin-left: 0px;" class=loginButton type="primary" @click="goToLogin()">
                去登录</ElButton>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { ElInput, ElButton } from 'element-plus';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
    name: 'UserRegister',
    setup() {
        const router = useRouter();
        const account = ref('');
        const password = ref('');
        const userName = ref('');
        const confirm = ref('');
        const power = ref('用户');
        const email = ref('');
        const code = ref('');

        const sendCode = async () => {
            const response = await axios.get(`http://localhost:4001/diary-server/sendMail/${email.value}`);
            console.log(response);
            if (response.status == 200) {
                alert("发送成功，有效期5分钟");
            }
        }

        const register = async () => {
            const response = await axios.post('http://localhost:4001/diary-server/userRegister', {
                userName: userName.value,
                account: account.value,
                email: email.value,
                password: password.value,
                code: code.value,
                power: power.value,
                regTime: new Date().toDateString,
            });
            console.log(response);
            // if (response.status == 200) {
            //     alert("注册成功！")
            // } else {
            //     alert("注册失败！")
            // }
            alert(response.data.message);
        }

        const goToLogin = () => {
            router.back();
        }

        return {
            account,
            password,
            userName,
            confirm,
            power,
            email,
            code,
            sendCode,
            register,
            goToLogin
        };
    },
}
</script>

<style scoped>
.loginButton {
    width: 100%;
}

.loginInput {
    height: 50px;
    padding-bottom: 10px;
}
</style>