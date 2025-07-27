<script></script>

<template>
  <div class="customer-header">
    <p class="title">Customer Management</p>
    <a-button
      class="clear-btn"
      type="primary"
      :icon="h(PlusCircleFilled)"
      @click="showAddModal"
    >
      Add Data
    </a-button>
  </div>
  <a-table
    :columns="columns"
    :data-source="data.customers"
    :pagination="data.pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined />
          Name
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <!-- <template v-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
      </template> -->

      <template v-if="column.key === 'name'">
        <div class="name-wrapper">
          <div class="avatar">
            {{ record.name?.charAt(0).toUpperCase() }}
          </div>
          <span>{{ record.name }}</span>
        </div>
      </template>

      <template v-else-if="column.key === 'email'">
        <span>{{ record?.user?.email ?? "-" }}</span>
      </template>

      <template v-else-if="column.key === 'gender'">
        <a-tag :color="record.gender === 'male' ? 'green' : 'gold'">
          {{ record.gender }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'birth_date'">
        <span>{{ record.birth_date }}</span>
      </template>

      <template v-else-if="column.key === 'surname'">
        <span>{{ record.surname }}</span>
      </template>

      <template v-else-if="column.key === 'action'">
        <span class="action-icons">
          <!-- Edit Icon -->
          <edit-outlined class="icon edit" @click="showModal(record)" />

          <!-- Delete Icon with Confirmation -->
          <a-popconfirm
            title="Are you sure to delete this?"
            @confirm="onDelete(record.id)"
          >
            <delete-outlined class="icon delete" />
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>
  <div>
    <!-- <a-button type="primary" @click="showModal">Open Modal</a-button> -->
    <a-modal
      v-model:open="open"
      title="Form Update Customer"
      @ok="handleOk"
      :footer="null"
      @cancel="handleEditCancel"
    >
      <a-form ref="formRef" :model="editForm" layout="vertical">
        <a-form-item
          label="Name"
          name="name"
          :rules="[{ required: true, message: 'Please input your name!' }]"
        >
          <a-input v-model:value="editForm.name" />
        </a-form-item>

        <a-form-item
          label="Surname"
          name="surname"
          :rules="[{ required: true, message: 'Please input your surname!' }]"
        >
          <a-input v-model:value="editForm.surname" />
        </a-form-item>

        <a-form-item
          label="Email"
          name="email"
          :rules="[{ required: true, message: 'Please input your email!' }]"
        >
          <a-input v-model:value="editForm.email" />
        </a-form-item>

        <a-form-item
          label="Address"
          name="address"
          :rules="[{ required: true, message: 'Please input your address!' }]"
        >
          <a-input v-model:value="editForm.address" />
        </a-form-item>

        <a-form-item
          label="Birth Date"
          name="birth_date"
          :rules="[{ required: true, message: 'Please select birth date!' }]"
        >
          <a-date-picker
            v-model:value="editForm.birth_date"
            format="YYYY-MM-DD"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item
          label="Gender"
          name="gender"
          :rules="[{ required: true, message: 'Please select your gender!' }]"
        >
          <a-radio-group v-model:value="editForm.gender">
            <a-radio value="male">Male</a-radio>
            <a-radio value="female">Female</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
      <!-- Custom footer -->
      <div class="modal-footer">
        <a-button @click="handleEditCancel">Cancel</a-button>

        <a-button type="primary" class="custom-ok-btn" @click="handleOk">
          Confirm
        </a-button>
      </div>
    </a-modal>
  </div>

  <div>
    <a-modal v-model:open="AddOpen" title="Add Student">
      <a-form ref="formAdd" layout="vertical" :model="addForm">
        <a-form-item
          label="Name"
          name="name"
          :rules="[{ required: true, message: 'Please select your name!' }]"
        >
          <a-input v-model:value="addForm.name" placeholder="Enter name" />
        </a-form-item>

        <a-form-item
          label="Email"
          name="email"
          :rules="[{ required: true, message: 'Please select your Email!' }]"
        >
          <a-input v-model:value="addForm.email" placeholder="Enter email" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please select your Password!' }]"
        >
          <a-input-password
            v-model:value="addForm.password"
            placeholder="Enter password"
          />
        </a-form-item>
      </a-form>

      <!-- Custom Modal Footer -->
      <template #footer>
        <a-button @click="handleCancel">Cancel</a-button>

        <a-button type="primary" class="custom-ok-btn" @click="handleAddOk">
          <check-outlined />
          Confirm
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { h, onMounted, reactive, ref } from "vue";
import apiClient from "../../common/configuration/axios.config";
import type { ICustomer, ICustomerForm } from "./interface/customer.interface";
import { Form, message, type TablePaginationConfig } from "ant-design-vue";
// ✅ Import icons
import {
  SmileOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleFilled,
} from "@ant-design/icons-vue";
import dayjs from "dayjs";
import { useRegister } from "./composible/register";

const { register } = useRegister();
const { update } = useRegister();

const AddOpen = ref<boolean>(false);
const open = ref<boolean>(false);

const loading = ref(false);

const handleCancel = () => {
  AddOpen.value = false;
};

function handleEditCancel() {
  open.value = false;
}

// interface/customer.interface.ts

const addForm = ref<ICustomerForm>({
  name: "",
  email: "",
  password: "",
});

const formAdd = Form.useForm(addForm);

const showAddModal = () => {
  addForm.value = {
    name: "",
    email: "",
    password: "",
  };
  AddOpen.value = true;
};

const handleAddOk = async () => {
  try {
    // Add basic frontend validation if needed
    await formAdd.validate();

    await register(addForm.value);
    message.success("Student added successfully");
    AddOpen.value = false;
    await fetchData(data.pagination.current, data.pagination.pageSize);
  } catch (error) {
    console.error(error);
    message.error("Failed to add student.");
  }
};

// Form model for editing
const editForm = ref<ICustomerForm>({
  id: null,
  name: "",
  surname: "",
  address: "",
  birth_date: dayjs(),
  gender: "",
  user: {
    email: "",
  },
  email: "",
});

// AntD Form ref
const formRef = Form.useForm(editForm);

// Show edit modal with selected record
const showModal = (record: any) => {
  editForm.value = {
    ...record,
    birth_date: record.birth_date ? dayjs(record.birth_date) : dayjs(),
    user: { ...record.user },
    email: record.user?.email ?? "",
  };
  open.value = true;
};

// Submit modal form
const handleOk = async () => {
  try {
    await formRef.validate();

    await update(editForm);
    message.success("Customer updated successfully");
    open.value = false;

    // Reload customer list
    await fetchData(data.pagination.current, data.pagination.pageSize);
  } catch (error: any) {
    if (error?.errorFields) {
      message.error("Please complete the required fields.");
    } else {
      message.error("Update failed.");
      console.error(error);
    }
  }
};

const onDelete = async (id: number) => {
  try {
    await apiClient.delete(`/students/${id}`);
    message.success("Delete successfully");
    await fetchData(data.pagination.current, data.pagination.pageSize);
  } catch (error) {
    console.log(error);
    message.error("Delete failed");
  }
};

const columns = [
  {
    name: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Surname",
    dataIndex: "surname",
    key: "surname",
  },
  {
    title: "Email",
    key: "email",
    dataIndex: ["user", "email"],
    render: (_: any, record: any) => record?.user?.email ?? "-",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Birth day",
    dataIndex: "birth_date",
    key: "birth_date",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Action",
    key: "action",
  },
];

const data = reactive<ICustomer>({
  customers: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  },
});

const handleTableChange = (pagination: TablePaginationConfig) => {
  fetchData(pagination.current ?? 1, pagination.pageSize ?? 10);
};

const fetchData = async (page: number, limit: number) => {
  loading.value = true;
  try {
    const response = await apiClient.get("/students", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: {
        page,
        limit,
      },
    });

    data.customers = response.data.data;
    // set pagination
    const paginate = response.data.pagination;

    const pagination = {
      current: paginate.currentPage,
      pageSize: paginate.limit,
      total: paginate.total,
      showSizeChanger: true,
    };
    data.pagination = pagination;

    console.log("data", response.data);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchData(data.pagination.current, data.pagination.pageSize);
});
</script>

<style scoped>
.customer-header {
  display: flex;
  justify-content: space-between; /* Space between title & button */
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
}

.title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.action-icons {
  display: flex;
  gap: 12px;
}

.icon {
  font-size: 20px;
  cursor: pointer;
}

.icon.delete {
  color: red;
}

.icon.edit {
  color: #ffd700;
}

.name-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  background-color: #ffd700; /* green-ish */
  color: white;
  font-weight: bold;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
}

.clear-btn {
  background-color: #ffd700;
  border-color: #ffd700;
  color: #ffffff;
}

.clear-btn:hover {
  background-color: #e6c200;
  border-color: #e6c200;
  color: #ffffff;
}

.custom-ok-btn {
  background-color: #ffd700;
  border-color: #ffd700;
  color: #000;
}

.custom-ok-btn:hover {
  background-color: #e6c200;
  border-color: #e6c200;
  color: #000;
}

.custom-ok-btn:active {
  background-color: #ccac00;
  border-color: #ccac00;
  color: #000;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-footer a-button {
  width: 120px;
}
</style>
