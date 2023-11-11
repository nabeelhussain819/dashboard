<template>
        <a-row :gutter="16" class="py-4">
      <a-col :span="8">
        <a-card  :bordered="false" class="app-card">
            <h1>Total Products</h1>
          <h2>10k+</h2>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card  :bordered="false" class="app-card">
            <h1>Total Categories</h1>
          <h2>10+</h2>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card  :bordered="false" class="app-card">
            <h1>Total Products Owners</h1>
          <h2>4k+</h2>
        </a-card>
      </a-col>
    </a-row>
    <a-card class="w-100">
        <div class="flex items-center justify-between pb-3">
            <a-space>
                <a-input placeholder="Search By Name" class="w-96" allowClear />
                <a-button @click="changeVal">
                    <SearchOutlined />
                </a-button>
            </a-space>
            <a-button type="primary" html-type="submit" class="w-52" @click="showModal">Create A Product</a-button>
        </div>
        <a-table :columns="columns" :row-key="record => record.login.uuid" :data-source="dataSource"
            :pagination="pagination" :loading="loading" @change="handleTableChange" :style="tableStyle">
            <template #bodyCell="{ column, text }">
                <template v-if="column.dataIndex === 'picture'"><a-image :width="70" :src="text.large" /></template>
                <template v-if="column.dataIndex === 'name'">{{ text.first }} {{ text.last }}</template>
            </template>
        </a-table>

        <a-modal v-model:visible="visible" class="flex  justify-center items-center" style="width: 1000px"
            :ok-button-props="{ hidden: true }" :cancel-button-props="{ hidden: true }" :on-cancel="handleOk"
            title="Create A product">
            <a-form class="w-100" ref="formRef" :model="formState" name="basic" :rules="rules" autocomplete="off"
                layout="vertical" @finish="onFinish" @finishFailed="onFinishFailed">
                <a-form-item name="profilePicture" class="w-100">
                    <a-upload-dragger action="/" :before-upload="beforeUpload" :custom-request="customRequest"
                        v-model:value="formState.profilePicture" list-type="picture" maxCount="2"
                        class="upload-list-inline">
                        <p class="ant-upload-drag-icon">
                            <InboxOutlined type="inbox" />
                        </p>
                        <p class="ant-upload-text">Click or drag file to this area to upload Product Image</p>
                    </a-upload-dragger>
                </a-form-item>
                <div class="w-100">
                    <a-form-item label="Product Name" class="w-100" name="product_name" has-feedback>
                        <a-input v-model:value="formState.product_name" placeholder="Enter Product Name" />
                    </a-form-item>
                    <a-form-item label="Price" class="w-100" name="price" has-feedback>
                        <a-input v-model:value="formState.price" placeholder="Enter Price" />
                    </a-form-item>
                    <a-form-item label="Inital Stock Level" class="w-100" name="level" has-feedback>
                        <a-row>
                            <a-col :span="14">
                                <a-slider v-model:value="formState.level" :min="1" :max="20" :tooltip-open="true" />
                            </a-col>
                            <a-col :span="4">
                                <a-input-number v-model:value="formState.level" :min="1" :max="20"
                                    style="margin-left: 16px" />
                            </a-col>
                        </a-row>
                    </a-form-item>
                    <a-form-item label="Description" class="w-100" name="details" has-feedback>
                        <a-textarea v-model:value="formState.details" placeholder="Enter Description" />
                    </a-form-item>
                </div>
                <a-form-item name="agreed" :wrapper-col="{ offset: 6, span: 18 }">
                    <a-checkbox v-model:checked="formState.agreed">
                        I agree to
                        <a-typography-text underline> terms of use </a-typography-text>
                        and
                        <a-typography-text underline> privacy policy </a-typography-text>
                    </a-checkbox>
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 6, span: 12 }">
                    <a-button type="primary" block html-type="submit">Submit</a-button>
                </a-form-item>
            </a-form>
        </a-modal>
        {{ console.log(visible) }}
    </a-card>
</template>
  
<script>
import { onMounted } from 'vue';
import { usePagination } from 'vue-request';
import { SearchOutlined, InboxOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import { ref } from 'vue';
const visible = ref(false); // Change this line
import { reactive } from "vue";
import { message } from "ant-design-vue";
export default {
    name: 'UserList',
    components: {
        SearchOutlined, InboxOutlined
    },
    setup() {
        const columns = [
            {
                title: '',
                dataIndex: 'picture',
                width: '10%',
            },
            {
                title: 'Name',
                dataIndex: 'name',
                sorter: true,
                width: '20%',
            },
            {
                title: 'Gender',
                dataIndex: 'gender',
                filters: [
                    {
                        text: 'Male',
                        value: 'male',
                    },
                    {
                        text: 'Female',
                        value: 'female',
                    },
                ],
                width: '20%',
            },
            {
                title: 'Email',
                dataIndex: 'email',
            },
            {
                title: 'Phone Number',
                dataIndex: 'phone',
            },
        ];

        const { data: dataSource, run, loading, pagination } = usePagination(
            async (params) => {
                const response = await axios.get('https://randomuser.me/api?noinfo?page=1&results=20', {
                    params,
                });
                return response.data.results || [];
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

        onMounted(() => {
            run();
        });
        const changeVal = () => {
            run();

        }
        const showModal = () => {
            console.log('asd');
            visible.value = true; // Change this line
        };

        const handleOk = e => {
            console.log(e);
            visible.value = false; // Change this line
        };
        const formRef = ref();
        const formState = reactive({
            product_name: "",
            price: 0,
            level: 0,
            details: "",
            product_image: "",
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
            console.log("Form values:", values);
        };

        const onFinishFailed = (errorInfo) => {
            console.log("Form submission failed:", errorInfo);
        };
        let validatePass = async () => {
            const value = formState.price;
            if (value < 1) {
                // console.log("validPass is empty")
                return Promise.reject("Please input the price");
            } else {
                return Promise.resolve();
            }
        };
        let validateLevel = async () => {
            const value = formState.level;
            if (value < 1) {
                // console.log("validPass is empty")
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
            changeVal
        };
    },
};

</script>
<style>
.ant-table {
    height: 70vh;
}

.ant-table-container {
    height: 70vh;
    overflow-y: auto;
}

.ant-modal-content {
    width: 800px;
}

.ant-modal-footer .ant-btn-primary {
    display: none;
}
</style>  