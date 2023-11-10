<template>
    <a-card class="w-100">
        <div class="flex items-center justify-between pb-3">
            <a-space>
                <a-input placeholder="Search By Name" class="w-96" />
                <a-button @click="visible = !visible">
                    <SearchOutlined />
                </a-button>
            </a-space>
            <a-button type="primary" html-type="submit" class="w-52" @click="showModal">Create A Product</a-button>
        </div>
        <a-table :columns="columns" :row-key="record => record.login.uuid" :data-source="dataSource"
            :pagination="pagination" :loading="loading" @change="handleTableChange">
            <template #bodyCell="{ column, text }">
                <template v-if="column.dataIndex === 'picture'"><a-image :width="70" :src="text.large" /></template>
                <template v-if="column.dataIndex === 'name'">{{ text.first }} {{ text.last }}</template>
            </template>
        </a-table>

        <a-modal v-model:visible="visible" class="flex  justify-center items-center" width="1000px" @ok="handleOk"
            :ok-button-props="{ hidden: true }" :cancel-button-props="{ hidden: true }" :on-cancel="handleOk"
            title="Create A product">
            <a-form class="w-100" ref="formRef" :model="formState" name="basic" :rules="rules" autocomplete="off"
                layout="vertical" @finish="onFinish" @finishFailed="onFinishFailed">
                <a-form-item name="profilePicture" class="w-96">
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
                    <a-form-item label="Name" class="w-96" name="name" has-feedback>
                        <a-input v-model:value="formState.name" />
                    </a-form-item>
                    <a-form-item label="Email" class="w-96" name="email" has-feedback>
                        <a-input v-model:value="formState.email" />
                    </a-form-item>
                    <a-form-item label="Password" class="w-96" name="password" has-feedback>
                        <a-input-password v-model:value="formState.password" />
                    </a-form-item>
                    <a-form-item label="Confirm Password" class="w-96" name="confirmPassword" has-feedback>
                        <a-input-password v-model:value="formState.confirmPassword" />
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
import { validatePassword } from "../../utils/validations"
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
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            profilePicture: "",
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
            const value = formState.password;
            if (value === "") {
                // console.log("validPass is empty")
                return Promise.reject("Please input the password");
            } else {
                try {
                    await validatePassword(value);
                    if (formState.confirmPassword !== "") {
                        formRef.value.validateFields("confirmPassword");
                    }
                    return Promise.resolve();
                } catch (err) {
                    return Promise.reject(err);
                }
            }
        };
        let validatePass2 = async () => {
            const value = formState.confirmPassword;
            if (value === "") {
                return Promise.reject("Please input the password again");
            } else if (value !== formState.password) {
                return Promise.reject("Two passwords don't match!");
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
            password: [
                {
                    required: true,
                    validator: validatePass,
                    trigger: "change",
                },
            ],
            confirmPassword: [
                {
                    required: true,
                    validator: validatePass2,
                    trigger: "change",
                },
            ],
            name: [
                {
                    required: true,
                    message: "cannot be empty",
                },
                {
                    min: 3,
                    max: 30,
                    message: "3-30 characters",
                },
            ],
            email: [
                {
                    required: true,
                    type: "email",
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
        };
    },
};
</script>
  