<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addCategoryDialogVisible">添加分类</el-button>
                </el-col>
            </el-row>
            <!--            表格-->
            <tree-table class="treeTable" :data="categories" :columns="columns" :selection-type="false"
                        :expand-type="false" show-index index-text="#" border :show-row-hover="false">

                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else style="color: red"></i>
                </template>

                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>

                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit"
                               @click="changeEditCateDialogVisible(scope.row.cat_id)">编辑
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="removeCateById(scope.row.cat_id)">删除
                    </el-button>
                </template>
            </tree-table>
            <!--            分页-->

            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next"
                    :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
                title="添加分类"
                :visible.sync="categoryDialogVisible"
                width="50%"
                @close="categoryDialogClosed">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader
                            clearable
                            v-model="selectedKeys"
                            :options="parentCateList"
                            :props="cascaderProps"
                            @change="parentCateChanged"></el-cascader>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
    <el-button @click="categoryDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
        </el-dialog>

        <el-dialog
                title="编辑分类"
                :visible.sync="editCategoryDialogVisible"
                width="50%">
            <el-form :model="editCateForm" :rules="addCateFormRules" ref="editCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="editCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="editCategoryDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCate">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "category",
        data() {
            return {
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5,
                },
                categories: [],
                total: 0,
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name',
                    },
                    {
                        label: '是否有效',
                        type: 'template',
                        template: 'isok'
                    },
                    {
                        label: '排序',
                        type: 'template',
                        template: 'order'
                    },
                    {
                        label: '操作',
                        type: 'template',
                        template: 'opt'
                    }
                ],
                categoryDialogVisible: false,
                addCateForm: {
                    cat_name: '',
                    cat_pid: 0,
                    cat_level: 0
                },
                addCateFormRules: {
                    cat_name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'}
                    ]
                },
                parentCateList: [],
                cascaderProps: {
                    expandTrigger: 'hover',
                    checkStrictly: true,
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                selectedKeys: [],
                editCategoryDialogVisible: false,
                editCateForm: {
                    cat_name: '',
                    cat_id: 0
                }
            }
        },
        created() {
            this.getCategories()
        },
        methods: {
            async getCategories() {
                const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.categories = res.data.result
                this.total = res.data.total
                console.log(this.categories)
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getCategories()
            },
            handleCurrentChange(newNum) {
                this.queryInfo.pagenum = newNum
                this.getCategories()
            },
            addCategoryDialogVisible() {
                this.categoryDialogVisible = true
                this.getParentCateList()
            },
            async getParentCateList() {
                const {data: res} = await this.$http.get('categories', {params: {type: 2}})
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.parentCateList = res.data
            },
            parentCateChanged() {
                console.log(this.selectedKeys)
                if (this.selectedKeys.length > 0) {
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                    this.addCateForm.cat_level = this.selectedKeys.length
                } else {
                    this.addCateForm.cat_pid = 0
                    this.addCateForm.cat_level = 0
                }
            },
            addCate() {
                this.$refs.addCateFormRef.validate(async valid => {
                    if (!valid) return
                    const {data: res} = await this.$http.post('categories', this.addCateForm)
                    if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
                    this.$message.success('添加成功')
                    this.categoryDialogVisible = false
                    this.getCategories();
                })
            },
            categoryDialogClosed() {
                this.$refs.addCateFormRef.resetFields()
                this.selectedKeys = []
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            },
            async changeEditCateDialogVisible(id) {
                const {data: res} = await this.$http.get(`categories/${id}`)
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.editCateForm.cat_id = res.data.cat_id
                this.editCateForm.cat_name = res.data.cat_name
                this.editCategoryDialogVisible = true
            },
            async editCate() {
                this.$refs.editCateFormRef.validate(async valid => {
                    if (!valid) return
                    console.log(this.editCateForm.cat_name)
                    const {data: res} = await this.$http.put(`categories/${this.editCateForm.cat_id}`, {cat_name: this.editCateForm.cat_name})
                    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                    this.$message.success(res.meta.msg)
                    this.editCategoryDialogVisible = false
                    this.getCategories();
                })
            },
            async removeCateById(id) {
                const confirmResult = await this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)

                if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
                const {data: res} = await this.$http.delete(`categories/${id}`)
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)
                this.getCategories()
            }
        }
    }
</script>

<style scoped>
    .treeTable {
        margin-top: 15px;
    }

    .el-cascader {
        width: 100%;
    }
</style>
