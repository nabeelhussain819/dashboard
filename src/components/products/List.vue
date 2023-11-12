<template>
    <a-spin :spinning="!dataSource">
        <h1 class="my-4">Products</h1>
        <a-row :gutter="16" class="py-4">
            <a-col :span="8">
                <a-card :bordered="false" class="app-card">
                    <h1>Total Products</h1>
                    <h2>{{ dataSource?.length }}+</h2>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card :bordered="false" class="app-card">
                    <h1>Total Categories</h1>
                    <h2>{{ categories?.length }}</h2>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card :bordered="false" class="app-card-danger">
                    <h1>Restocking Products</h1>
                    <h2 class="text-red-600">{{ dataSource?.filter((data) => data?.stock < 50).length }}</h2>
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
                <a-button type="primary" html-type="submit" class="w-52" @click="showModal">Create A Product</a-button>
            </div>
            <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading"
                @change="handleTableChange" :style="tableStyle">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'image'"><a-image :width="100"
                            :src="record.thumbnail" /></template>
                    <template v-if="column.dataIndex === 'title'">{{ record.title }}</template>
                    <template v-if="column.dataIndex === 'level'">
                        <a-tag color="red" v-if="record?.stock < 40" class="w-[96]">{{ record.stock }}</a-tag>
                        <a-tag color="green" v-else>{{ record.stock }}</a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'category'">{{ record.category }}</template>
                    <template v-if="column.dataIndex === 'price'">${{ record.price }}</template>
                    <template v-if="column.dataIndex === 'rating'">{{ record.rating }}</template>
                    <template v-if="column.dataIndex === 'description'">{{ record.description }}</template>
                </template>
            </a-table>

            <a-modal v-model:visible="visible" class="flex  justify-center items-center" style="width: 1000px"
                :ok-button-props="{ hidden: true }" :cancel-button-props="{ hidden: true }" :on-cancel="handleOk"
                title="Create A product">
                <a-form class="w-100" ref="formRef" :model="formState" name="basic" :rules="rules" autocomplete="off"
                    layout="vertical" @finish="onFinish" @finishFailed="onFinishFailed">
                    <a-form-item name="thumbnail" class="w-100">
                        <a-upload-dragger action="/" :before-upload="beforeUpload" :custom-request="customRequest"
                            v-model:value="formState.thumbnail" list-type="picture" maxCount="2" class="upload-list-inline">
                            <p class="ant-upload-drag-icon">
                                <InboxOutlined type="inbox" />
                            </p>
                            <p class="ant-upload-text">Click or drag file to this area to upload Product Thumbnail</p>
                        </a-upload-dragger>
                    </a-form-item>
                    <div class="w-100">
                        <a-form-item label="Product Name" class="w-100" name="title" has-feedback>
                            <a-input v-model:value="formState.title" placeholder="Enter Product Name" />
                        </a-form-item>
                        <a-form-item label="Price" class="w-100" name="price" has-feedback>
                            <a-input v-model:value="formState.price" placeholder="Enter Price" />
                        </a-form-item>
                        <a-form-item label="Inital Stock Level" class="w-100" name="stock" has-feedback>
                            <a-row>
                                <a-col :span="14">
                                    <a-slider v-model:value="formState.stock" :min="1" :max="100" />
                                </a-col>
                                <a-col :span="4">
                                    <a-input-number v-model:value="formState.stock" :min="1" :max="100"
                                        style="margin-left: 16px" />
                                </a-col>
                            </a-row>
                        </a-form-item>
                        <a-form-item label="Category" class="w-100" name="category" has-feedback><a-select ref="select"
                                v-model:value="formState.category" @focus="focus" placeholder="Select Category">
                                <a-select-option v-for="(cat, index) in categories" :value="cat" :key="index">{{ cat
                                }}</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="Description" class="w-100" name="description" has-feedback>
                            <a-textarea v-model:value="formState.description" placeholder="Enter Description" />
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
import { SearchOutlined, InboxOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import { ref } from 'vue';
const visible = ref(false);
let searchText = ref(null);
let categories = ref([]);
import { reactive } from "vue";
import { message } from "ant-design-vue";
import { notification } from 'ant-design-vue';
export default {
    name: 'UserList',
    components: {
        SearchOutlined, InboxOutlined
    },
    setup() {
        const columns = [
            {
                title: '',
                dataIndex: 'image',
            },
            {
                title: 'Title',
                dataIndex: 'title',
                width: '20%',
            },
            {
                title: 'Level',
                dataIndex: 'level',
                width: '20%',
            },
            {
                title: 'Category',
                dataIndex: 'category',
                width: '20%',
            },
            {
                title: 'Price',
                dataIndex: 'price',
            },
            {
                title: 'Rating',
                dataIndex: 'rating',
            },
            {
                title: 'Description',
                dataIndex: 'description',
            },
        ];
        const { data: dataSource, run, loading, pagination } = usePagination(
            async (params) => {
                if (params?.search) {
                    const response = await axios.get(`https://dummyjson.com/products/search?q=${params.search}`);
                    return response.data.products || [];

                }
                const response = await axios.get(`https://dummyjson.com/products`, {
                    params,
                });
                return response.data.products || [];
            },
            {
                pagination: {
                    currentKey: 'page',
                },
            }
        );
        const getCategory = async () => {
            const response = await axios.get(`https://dummyjson.com/products/categories`);
            categories.value = response.data || [];
        }
        const handleTableChange = (pagination, filters, sorter) => {
            run({
                page: pagination.currentKey,
                sortField: sorter.field,
                sortOrder: sorter.order,
                ...filters,
            });
        };

        onMounted(() => {
            run();
            getCategory()
        });
        const seachData = () => {
            run({
                search: searchText
            });

        }
        const changeVal = (item) => {
            searchText = item
        }
        const showModal = () => {
            visible.value = true;
        };

        const handleOk = () => {
            visible.value = false;
        };
        const formRef = ref();
        const formState = reactive({
            title: "",
            price: 0,
            stock: 0,
            description: "",
            thumbnail: FileList,
            category: "",
            agreed: true,
        });
        const beforeUpload = (file) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
                message.error(`${file.name} is not an image file.`);
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error(`${file.name} exceeds the 2MB size limit.`);
                return false;
            }
            return true;
        };

        const customRequest = async ({ onSuccess, onError, file }) => {
            try {
                const response = await uploadFileToServer(file);
                onSuccess(response, file);
                message.success(`${file.name} file uploaded successfully`);
            } catch (error) {
                console.error("File upload failed:", error);
                onError(error, file);
                message.error(`${file.name} file upload failed`);
            }
        };

        const uploadFileToServer = async (file) => {
            console.log("Uploading file:", file.name);
        };

        const onFinish = (values) => {
            fetch('https://dummyjson.com/products/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })
                .then(res => res.json())
            visible.value = false;
            notification["success"]({
                message: 'Product Created Successfully',
                placement: 'bottom'
            });
        };

        const onFinishFailed = (errorInfo) => {
            console.log("Form submission failed:", errorInfo);
        };
        let validatePass = async () => {
            const value = formState.price;
            if (value < 1) {
                return Promise.reject("Please input the price");
            } else {
                return Promise.resolve();
            }
        };
        let validateLevel = async () => {
            const value = formState.level;
            if (value < 1) {
                return Promise.reject("Please input the Intial Stock Level");
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
            price: [
                {
                    required: true,
                    validator: validatePass,
                    trigger: "change",
                    message: "Please Enter Price",
                },
            ],
            details: [
                {
                    required: true,
                    validator: validatePass2,
                    trigger: "change",
                    message: "Please Enter Description",
                },
            ],
            product_name: [
                {
                    required: true,
                    message: "Please Enter Product Name",
                },
                {
                    min: 3,
                    max: 30,
                    message: "3-30 characters",
                },
            ],
            level: [
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
            beforeUpload,
            customRequest,
            changeVal,
            seachData,
            searchText,
            categories,
            getCategory,
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