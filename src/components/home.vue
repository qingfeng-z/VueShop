<template>
    <el-container class="home-container">
        <!--        头部区域-->
        <el-header>
            <div>
                <img src="../assets/logo.png">
                <span>电商管理系统</span>
            </div>
            <el-button @click="logout" type="info">退出</el-button>
        </el-header>
        <!--        主体区域-->
        <el-container>
            <!--          左侧边栏-->
            <el-aside :width="isCollapse ? '64px' : '200px'" >
                <div class="togger-button" @click="toggleCollapse">|||</div>
                <el-menu
                        :default-active="$route.path"
                        :router="true"
                        :collapse-transition = "false"
                        :collapse = "isCollapse"
                        :unique-opened = "true"
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409EFF">
                    <!--                    一级菜单-->
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <!--                        一级菜单模板-->
                        <template slot="title">
                            <!--                            图标-->
                            <i class="el-icon-location"></i>
                            <!--                            文本-->
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                            <template slot="title">
                                <!--                            图标-->
                                <i class="el-icon-menu"></i>
                                <!--                            文本-->
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!--            右侧内容主体-->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                // 左侧菜单数据
                menuList: [],
                isCollapse:false,
            }
        },
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login')
            },
            async getMenuList() {
                const {data: res} = await this.$http.get('menus')
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.menuList = res.data;
                console.log(res.data)
            },
            toggleCollapse(){
                // 操作菜单的折叠展开
                this.isCollapse = !this.isCollapse;
            }
        },
        created() {
            this.getMenuList();
        }
    }
</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 20px;

        > div {
            display: flex;
            align-items: center;

            > span {
                margin-left: 15px;
            }

            > img {
                margin-left: 15px;
                height: 40px;
            }
        }
    }

    .el-aside {
        background-color: #333744;
    }

    .el-main {
        background-color: #eaedf1;
    }

    .el-menu{
        border-right: 0;
    }
    .togger-button{
        background-color: #4A5064;
        font-size: 15px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>
