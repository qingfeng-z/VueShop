<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png">
            </div>
            <!-- 登录表单-->
            <el-form ref="loginFormRef" label-width="0px" :model="loginForm" :rules="loginFormRules" class="login_form">
                <!-- username-->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- password-->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password"
                              prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <!-- 登录按钮-->
                <el-form-item class="btns">
                    <el-button @click="login" type="primary">登录</el-button>
                    <el-button @click="resetLoginForm" type="info">重置</el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                loginFormRules: {
                    username: [
                        {required: true, message: '请输入登录名称', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在3-10个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入登录密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在6-15个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            resetLoginForm() {
                this.$refs.loginFormRef.resetFields();
            },
            login() {
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) return
                    const {data: result} = await this.$http.post('login', this.loginForm)
                    if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
                    console.log(result.data)
                    window.sessionStorage.setItem('token', result.data.token)
                    // this.$message.success('登录成功')
                    await this.$router.push('/home')
                });
            },
        }
    }
</script>

<style lang='less' scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;

        }
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }
</style>
