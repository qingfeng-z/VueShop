<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="roleList" stripe border>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottpm',i1 ===0 ? 'bdtop':'','vcenter']"
                                v-for="(item1,i1) in scope.row.children"
                                :key="item1.id">
                            <!--                            一级权限-->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--                            二级权限-->
                            <el-col :span="19">
                                <el-row :class="[i2 ===0 ? '':'bdtop','vcenter']" v-for="(item2,i2) in item1.children"
                                        :key="item2.id">
                                    <!--                            一级权限-->
                                    <el-col :span="6">
                                        <el-tag closable type="success" @close="removeRightById(scope.row,item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag closable type="warning" v-for="(item3) in item2.children"
                                                :key="item3.id" @close="removeRightById(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作" width="400px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit"> 编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete"> 删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)"> 分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog
                title="分配权限"
                :visible.sync="setRightDialogVisible"
                width="30%" @close="setRightDialogClosed">
            <el-tree :data="rights" :props="treeProps" show-checkbox default-expand-all node-key="id"
                     :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "roles",
        data() {
            return {
                roleList: [],
                setRightDialogVisible: false,
                rights: [],
                // 树型控件的属性绑定对象
                treeProps: {
                    children: 'children',
                    label: 'authName'
                },
                defKeys: [],
                roleId: ''
            }
        },
        created() {
            this.getRoleList()
        },
        methods: {
            async getRoleList() {
                const {data: res} = await this.$http.get('roles')
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.roleList = res.data
                console.log(res)
            },
            async removeRightById(role, rightId) {
                const confirmResult = await this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)

                if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
                const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)
                role.children = res.data
            },
            async showSetRightDialog(role) {
                this.roleId = role.id
                const {data: res} = await this.$http.get('rights/tree')
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.rights = res.data
                this.getLeafKeys(role, this.defKeys)
                this.setRightDialogVisible = true
            },
            getLeafKeys(node, arr) {
                if (!node.children) {
                    return arr.push(node.id)
                }
                node.children.forEach(item => {
                    this.getLeafKeys(item, arr)
                })
            },
            setRightDialogClosed() {
                this.defKeys = []
            },
            async allotRights() {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ];
                const idStr = keys.join(',')
                const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`,
                    {rids: idStr})
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                console.log(res.data)
                this.getRoleList()
                this.setRightDialogVisible = false
            }
        }
    }
</script>

<style scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottpm {
        border-bottom: 1px solid #eee;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>
