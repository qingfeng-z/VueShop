<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-alert
                    show-icon
                    :closable="false"
                    title="注意: 只允许为第三级分类设置相关参数!"
                    type="warning">
            </el-alert>
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类: </span>
                    <el-cascader
                            clearable
                            v-model="selectedCateKeys"
                            :options="categories"
                            :props="cateProps"
                            @change="selectedCateKeysChange"></el-cascader>
                </el-col>
            </el-row>

            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数
                    </el-button>

                    <el-table :data="manyTableDate" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                                        @close="handleClose(i,scope.row)">{{item}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>

                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="showEditDialogVisible(scope.row.attr_id)">编辑
                                </el-button>
                                <el-button type="danger" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">

                    <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性
                    </el-button>

                    <el-table :data="onlyTableDate" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                                        @close="handleClose(i,scope.row)">{{item}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>

                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="showEditDialogVisible(scope.row.attr_id)">编辑
                                </el-button>
                                <el-button type="danger" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <el-dialog
                :title="'添加' + titleText"
                :visible.sync="addDialogVisible"
                width="50%" @close="addDialogVisibleClosed">

            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
        </el-dialog>

        <el-dialog
                :title="'修改' + titleText"
                :visible.sync="editDialogVisible"
                width="50%" @close="editDialogVisibleClosed">

            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef"
                     label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
        </el-dialog>


    </div>
</template>

<script>
    export default {
        name: "params",
        data() {
            return {
                categories: [],
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                selectedCateKeys: [],
                activeName: 'many',
                manyTableDate: [],
                onlyTableDate: [],
                addDialogVisible: false,
                editDialogVisible: false,
                addForm: {
                    attr_name: ''
                },
                addFormRules: {
                    attr_name: [
                        {required: true, message: '请输入参数名称', trigger: 'blur'}
                    ]
                },
                editForm: {},
                editFormRules: {
                    attr_name: [
                        {required: true, message: '请输入参数名称', trigger: 'blur'}
                    ]
                },
            }
        },
        created() {
            this.getCategories();
        },
        methods: {
            async getCategories() {
                const {data: res} = await this.$http.get('categories', {params: {attr_sel: this.activeName}})
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.categories = res.data
            },
            selectedCateKeysChange() {
                this.getParamsData()
            },
            handleTabClick() {
                this.getParamsData()
            },
            async getParamsData() {
                if (this.selectedCateKeys.length !== 3) {
                    this.selectedCateKeys = []
                    return
                }
                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,
                    {params: {sel: this.activeName}})
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                    item.inputVisible = false
                    item.inputValue = ''
                })
                console.log(res.data)

                if (this.activeName === 'many') {
                    this.manyTableDate = res.data
                } else {
                    this.onlyTableDate = res.data
                }

            },
            addDialogVisibleClosed() {
                this.$refs.addFormRef.resetFields()
            },
            editDialogVisibleClosed() {
                this.$refs.editFormRef.resetFields()
            },
            addParams() {
                this.$refs.addFormRef.validate(async vaild => {
                    if (!vaild) return
                    const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    })
                    console.log(res)
                    if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
                    this.addDialogVisible = false
                    this.getParamsData()
                })
            },
            async showEditDialogVisible(id) {
                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`)
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.editForm = res.data
                this.editDialogVisible = true
            },
            editParams() {
                this.$refs.editFormRef.validate(async vaild => {
                    if (!vaild) return
                    const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.activeName
                    })
                    console.log(res)
                    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                    this.editDialogVisible = false
                    this.getParamsData()
                })
            },
            async removeParams(id) {
                const confirmResult = await this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

                const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)
                this.getParamsData()
            },
            async handleInputConfirm(row) {
                if (row.inputValue.trim().length === 0) {
                    row.inputValue = ''
                    row.inputVisible = false
                    return
                }
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = ''
                row.inputVisible = false
                this.saveAttrVals(row)
            },
            async saveAttrVals(row) {
                const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
                    {
                        attr_name: row.attr_name,
                        attr_sel: row.attr_sel,
                        attr_vals: row.attr_vals.join(','),
                    })
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)
            },
            showInput(row) {
                row.inputVisible = true
                this.$nextTick(_ => {
                    console.log(_)
                    this.$refs.saveTagInput.$refs.input.focus()
                })
            },
            handleClose(i, row) {
                row.attr_vals.splice(i, 1)
                this.saveAttrVals(row)
            }
        },
        computed: {
            isBtnDisabled() {
                if (this.selectedCateKeys.length !== 3) {
                    return true
                }
                return false
            },
            cateId() {
                if (this.selectedCateKeys.length === 3) {
                    return this.selectedCateKeys[2]
                }
                return null
            },
            titleText() {
                if (this.activeName === 'many') {
                    return '动态参数'
                } else {
                    return '静态属性'
                }
            }
        }
    }
</script>

<style scoped>
    .cat_opt {
        margin: 15px 0px;
    }

    .el-tag {
        margin: 10px;
    }

    .input-new-tag {
        width: 120px;
    }
</style>
