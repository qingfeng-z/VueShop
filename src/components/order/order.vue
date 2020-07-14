<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="orderList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price" width="100px"></el-table-column>
                <el-table-column label="是否付款" width="100px">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
                        <el-tag type="success" v-else>已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>
                <el-table-column label="下单时间" prop="create_time" width="200px">
                    <template slot-scope="scope">
                        {{scope.row.create_time|dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" @click="showBox"></el-button>
                        <el-button type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <el-dialog
                title="修改地址"
                :visible.sync="addressVisible"
                width="30%" @close="addressVisibleClosed">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader
                            v-model="addressForm.address1"
                            :options="cityData"
                            :props="addressProps">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
  </span>
        </el-dialog>

        <el-dialog
                title="物流进度"
                :visible.sync="progressVisible"
                width="30%">
            <el-timeline>
                <el-timeline-item
                        v-for="(activity, index) in progressInfo"
                        :key="index"
                        :timestamp="activity.time">
                    {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
    import cityData from "./citydata";

    export default {
        name: "order",
        data() {
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                total: 0,
                orderList: [],
                addressVisible: false,
                addressForm: {
                    address1: [],
                    address2: ''
                },
                addressFormRules: {
                    address1: [
                        {required: true, message: '请选择省市区/县', trigger: 'blur'}
                    ],
                    address2: [
                        {required: true, message: '请输入详细地址', trigger: 'blur'}
                    ]
                },
                cityData,
                addressProps: {
                    expandTrigger: 'hover'
                },
                progressVisible: false,
                progressInfo: []
            }
        },
        created() {
            this.getOrderList()
        },
        methods: {
            async getOrderList() {
                const {data: res} = await this.$http.get('orders', {params: this.queryInfo})
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.orderList = res.data.goods
                this.total = res.data.total
                console.log(this.orderList)
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getOrderList()
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getOrderList()
            },
            showBox() {
                this.addressVisible = true
            },
            async showProgressBox() {
                const id = 110697512662
                const {data: res} = await this.$http.get(`kuaidi/${id}`)
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.progressInfo = res.data
                console.log(res.data)
                this.progressVisible = true
            },
            addressVisibleClosed() {
                this.$refs.addressFormRef.resetFields()
            }
        }
    }
</script>

<style scoped>
    .el-cascader {
        width: 100%;
    }
</style>
