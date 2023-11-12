<template>
    <a-spin :spinning="!dataSource">
        <h1 class="my-4">Inventory</h1>
        <a-row :gutter="16" class="py-4">
            <a-col :span="8">
                <a-card :bordered="false" class="app-card">
                    <h1>Total Inventory</h1>
                    <h2>{{ dataSource?.length }}+</h2>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card :bordered="false" class="app-card-danger ">
                    <h1>Low Inventory Product</h1>
                    <h2 class="text-red-600">{{ dataSource?.filter((data) => data?.stock < 50).length }}</h2>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card :bordered="false" class="app-card-danger">
                    <h1>Restocking Products</h1>
                    <h2 class="text-red-600">{{ (dataSource?.filter((data) => data?.stock < 30).length) }}</h2>
                </a-card>
            </a-col>
        </a-row>
        <a-card class="w-100">
            <div class="flex items-center justify-between pb-3">
                <a-space>
                    <a-input placeholder="Search By Name" class="w-96" @change="(e) => changeVal(e.target.value)" />
                    <a-button @click="seachData">
                        <SearchOutlined />
                    </a-button>
                </a-space>
                <a-select ref="select" class="w-96" placeholder="Sort By:" @focus="focus" @change="handleChange">
                    <a-select-option value="ASC">Lower Stock Level</a-select-option>
                    <a-select-option value="DSC">Higher Stock Level</a-select-option>
                </a-select>
            </div>
            <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading"
                @change="handleTableChange" :style="tableStyle">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'title'">{{ record.title }}</template>
                    <template v-if="column.dataIndex === 'level'">
                        <a-tag color="red" v-if="record?.stock < 40" class="w-[96]">{{ record.stock }}</a-tag>
                        <a-tag color="green" v-else>{{ record.stock }}</a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'status'">{{ record.stock > 40 ? "good" : "need Update"
                    }}</template>
                    <template v-if="column.dataIndex === 'description'">{{ record.description }}</template>
                    <template v-if="column.dataIndex === 'action'">
                        <a @click="showModal(record)">Edit</a>
                    </template>
                </template>
            </a-table>

            <a-modal v-model:visible="visible" class="flex  justify-center items-center" style="width: 1000px"
                :ok-button-props="{ hidden: true }" :cancel-button-props="{ hidden: true }" :on-cancel="handleOk"
                title="Update Inventory">
                <a-form class="w-100" ref="formRef" :model="updateData" name="basic" :rules="rules" autocomplete="off"
                    layout="vertical" @finish="onFinish" @finishFailed="onFinishFailed">
                    <div class="w-100">
                        <a-form-item label="Name" class="w-100" name="title" has-feedback>
                            <a-input v-model:value="updateData.title" placeholder="Enter Name" />
                        </a-form-item>
                        <a-form-item label="Stock Level" class="w-100" name="stock" has-feedback>
                            <a-row>
                                <a-col :span="14">
                                    <a-slider v-model:value="updateData.stock" :min="1" :max="100" />
                                </a-col>
                                <a-col :span="4">
                                    <a-input-number v-model:value="updateData.stock" :min="1" :max="100"
                                        style="margin-left: 16px" />
                                </a-col>
                            </a-row>
                        </a-form-item>
                        <a-form-item label="Description" class="w-100" name="description" has-feedback>
                            <a-textarea v-model:value="updateData.description" placeholder="Enter Description" />
                        </a-form-item>
                    </div>
                    <a-form-item :wrapper-col="{ offset: 6, span: 12 }">
                        <a-button type="primary" block html-type="submit">Submit</a-button>
                    </a-form-item>
                </a-form>
            </a-modal>
        </a-card>
    </a-spin>
</template>

<script>
import { onMounted } from 'vue';
import { usePagination } from 'vue-request';
import { SearchOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import { ref } from 'vue';
const visible = ref(false);
const updateData = ref({});
let searchText = ref(null);
import { reactive } from "vue";
import { notification } from 'ant-design-vue';
export default {
    name: 'UserList',
    components: {
        SearchOutlined
    },
    setup() {
        const columns = [
            {
                title: 'Title',
                dataIndex: 'title',
                width: '20%',
            },
            {
                title: 'Level',
                dataIndex: 'level',
                width: '10%',
            },
            {
                title: 'Status',
                dataIndex: 'status',
            },
            {
                title: 'Description',
                dataIndex: 'description',
            },
            {
                title: 'Action',
                dataIndex: 'action',
            },
        ];
        const { data: dataSource, run, loading, pagination } = usePagination(
            async (params) => {
                if (params?.search) {
                    const response = await axios.get(`https://dummyjson.com/products/search?q=${params.search}`);
                    if (params?.sort === "ASC") {
                        return response.data.products.sort((a, b) => a.stock - b.stock)
                    }
                    return response.data.products.sort((a, b) => b.stock - a.stock)
                }
                const response = await axios.get(`https://dummyjson.com/products`, {
                    params,
                });
                if (params?.sort === "ASC") {
                    return response.data.products.sort((a, b) => a.stock - b.stock)
                }
                return response.data.products.sort((a, b) => b.stock - a.stock)
            },
            {
                pagination: {
                    currentKey: 'page',
                },
            }
        );

        const handleTableChange = (pagination, filters, sorter) => {
            run({
                page: pagination.currentKey,
                sortField: sorter.field,
                sortOrder: sorter.order,
                ...filters,
            });
        };
        const handleChange = (item) => {
            run({
                sort: item
            });
        }
        onMounted(() => {
            run();
        });
        const seachData = () => {
            run({
                search: searchText
            });

        }
        const changeVal = (item) => {
            searchText = item
        }
        const showModal = (text) => {
            visible.value = true;
            updateData.value = text
        };

        const handleOk = () => {
            visible.value = false;
        };
        const formRef = ref();
        const formState = reactive({
            title: updateData.value.title,
            stock: updateData.value.stock,
            description: updateData.value.description,
            agreed: true,
        });
        const onFinish = (values) => {
            visible.value = false;
            fetch('https://dummyjson.com/products/1', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })
                .then(res => res.json())
            notification["success"]({
                message: 'Inventory Update Successfully',
                placement: 'bottom'
            });
            console.log("Form values:", values);
        };

        const onFinishFailed = (errorInfo) => {
            console.log("Form submission failed:", errorInfo);
        };
        let validateLevel = async () => {
            const value = formState.level;
            if (value < 1) {
                return Promise.reject("Please input the Stock Level");
            } else {
                return Promise.resolve();
            }
        };
        let validatePass2 = async () => {
            const value = formState.details;
            if (value === "") {
                return Promise.reject("Please input the details");
            } else {
                return Promise.resolve();
            }
        };
        let validateAgreed = async () => {
            const agreed = formState.agreed;
            if (agreed) {
                return Promise.resolve();
            } else return Promise.reject("Please agree to proceed");
        };

        const rules = {
            description: [
                {
                    required: true,
                    validator: validatePass2,
                    trigger: "change",
                    message: "Please Enter Description",
                },
            ],
            title: [
                {
                    required: true,
                    message: "Please Enter Name",
                },
                {
                    min: 3,
                    max: 30,
                    message: "3-30 characters",
                },
            ],
            stock: [
                {
                    required: true,
                    validator: validateLevel,
                    message: "Please Enter Initial Stock Level",
                },
            ],
            agreed: [
                {
                    required: true,
                    validator: validateAgreed,
                    trigger: "change",
                },
            ],
        };

        return {
            columns,
            dataSource,
            loading,
            pagination,
            handleTableChange,
            showModal,
            handleOk,
            visible,
            formState,
            onFinish,
            onFinishFailed,
            formRef,
            rules,
            changeVal,
            updateData,
            seachData,
            searchText,
            handleChange,
        };
    },
};

</script>
<style>
.ant-table {
    height: 58vh !important;
}

.ant-table-container {
    height: 58vh !important;
    overflow-y: auto;
}

.ant-modal-content {
    width: 800px;
}

.ant-modal-footer .ant-btn-primary {
    display: none;
}
</style>  