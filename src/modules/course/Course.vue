<script setup lang="ts">
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleFilled,
  EyeOutlined,
} from "@ant-design/icons-vue";
import { h, onMounted, reactive, ref } from "vue";
import { useCourse } from "./composible";
import type { ICourse } from "./interface/course.interface";
import type { ICourseEntity } from "./entity/course.entity";
import formatDate from "../../common/utils/format-date.util";
import { notification, type TablePaginationConfig } from "ant-design-vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";

const {
  fetchItem,
  getAllTeachers,
  getAllCategories,
  createCourse,
  deleteCourse,
  updateCourse,
} = useCourse();

const loading = ref(false);
const data = reactive<ICourse>({
  courses: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  },
  teachers: [],
  categories: [],
});

const formatPrice = (price: number) =>
  new Intl.NumberFormat("lo-LA", {
    style: "currency",
    currency: "LAK",
    minimumFractionDigits: 0,
  }).format(price);

const columns = [
  { title: "ລຳດັບ", dataIndex: "id", key: "id", align: "center", width: 64 },
  { title: "ຊື່ຫຼັກສູດ", dataIndex: "title", key: "title", ellipsis: true },
  {
    title: "ປະເພດ",
    dataIndex: "category",
    key: "category",
    customRender: ({ record }: { record: ICourseEntity }) =>
      record?.category?.name ?? "-",
    width: 200,
  },
  {
    title: "ນັກຮຽນສູງສຸດ",
    dataIndex: "max_student",
    key: "max_student",
    align: "center",
    width: 80,
  },
  {
    title: "ຊົ່ວໂມງຮຽນ",
    dataIndex: "duration_hours",
    key: "duration_hours",
    align: "center",
    width: 68,
  },
  {
    title: "ລາຄາ",
    dataIndex: "price",
    key: "price",
    align: "center",
    customRender: ({ record }: { record: ICourseEntity }) =>
      formatPrice(record.price),
    width: 110,
  },
  {
    title: "ເລີ່ມລົງທະບຽນ",
    dataIndex: "registration_start_date",
    key: "registration_start_date",
    customRender: ({ record }: { record: ICourseEntity }) =>
      record.registration_start_date
        ? formatDate(
            typeof record.registration_start_date === "string"
              ? record.registration_start_date
              : record.registration_start_date.format()
          )
        : "-",
  },
  {
    title: "ສິ້ນສຸດລົງທະບຽນ",
    dataIndex: "registration_end_date",
    key: "registration_end_date",
    customRender: ({ record }: { record: ICourseEntity }) =>
      record.registration_end_date
        ? formatDate(
            typeof record.registration_end_date === "string"
              ? record.registration_end_date
              : record.registration_end_date.format()
          )
        : "-",
  },
  {
    title: "ເລີ່ມຮຽນ",
    dataIndex: "start_date",
    key: "start_date",
    customRender: ({ record }: { record: ICourseEntity }) =>
      formatDate(
        typeof record.start_date === "string"
          ? record.start_date
          : record.start_date?.format() ?? "-"
      ),
  },
  {
    title: "ສິ້ນສຸດ",
    dataIndex: "end_date",
    key: "end_date",
    customRender: ({ record }: { record: ICourseEntity }) =>
      formatDate(
        typeof record.end_date === "string"
          ? record.end_date
          : record.end_date?.format() ?? "-"
      ),
  },
  {
    title: "ສະຖານະ",
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 77,
  },
  {
    title: "ຈັດການສະຖານະ",
    key: "action_status",
  },
  { title: "ຈັດການ", key: "action", align: "center" },
];

const fetchData = async (
  page = data.pagination.current,
  limit = data.pagination.pageSize
) => {
  loading.value = true;
  try {
    const response = await fetchItem(page, limit);
    data.courses = response.data;

    const paginate = response.pagination;

    data.pagination = {
      current: paginate.currentPage,
      pageSize: paginate.limit,
      total: paginate.total,
      showSizeChanger: true,
    };

    const teachers = await getAllTeachers();
    data.teachers = teachers.data.map((teacher: any) => ({
      label: teacher.user.username || "ບໍ່ມີຊື່",
      value: teacher.id,
    }));

    const categories = await getAllCategories();
    data.categories = categories.data.map((category: any) => ({
      label: category.name,
      value: category.id,
    }));
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

// Handler for table pagination/sorting/filter changes
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  fetchData(current, pageSize);
}
const isEditModalVisible = ref(false);

const formUpdate = ref<ICourseEntity>({
  id: 0,
  title: "",
  teacher_id: 0,
  category_id: 0,
  max_student: 0,
  duration_hours: 0,
  price: 0,
  registration_start_date: "",
  registration_end_date: "",
  start_date: "",
  end_date: "",
  description: "",
});

const openUpdateModal = (record: ICourseEntity) => {
  formUpdate.value.id = record.id;
  formUpdate.value.title = record.title;
  formUpdate.value.teacher_id = record.teacher_id;
  formUpdate.value.category_id = record.category_id;
  formUpdate.value.max_student = record.max_student;
  formUpdate.value.duration_hours = record.duration_hours;
  formUpdate.value.price = record.price;
  formUpdate.value.registration_start_date = record.registration_start_date
    ? dayjs(record.registration_start_date)
    : null;
  formUpdate.value.registration_end_date = record.registration_end_date
    ? dayjs(record.registration_end_date)
    : null;
  formUpdate.value.start_date = record.start_date
    ? dayjs(record.start_date)
    : null;
  formUpdate.value.end_date = record.end_date ? dayjs(record.end_date) : null;
  formUpdate.value.description = record.description;
  isEditModalVisible.value = true;
};

const SubmitUpdate = async () => {
  console.log("Update Form Data:", formUpdate.value.id);
  try {
    await updateCourse(formUpdate.value);
    notification.success({
      message: "ອັບເດດສໍາເລັດ",
      duration: 4,
    });
    isEditModalVisible.value = false;
    await fetchData();
  } catch (err) {
    notification.error({
      message: "ອັບເດດບໍ່ສໍາເລັດ",
      duration: 4,
    });
  }
};

const onDelete = async (id: number) => {
  console.log("Delete ID:", id);
  try {
    await deleteCourse(id);
    notification.success({
      message: "ລຶບສໍາເລັດ",
      duration: 4,
    });
    await fetchData();
  } catch (error) {
    notification.error({
      message: "ລຶບບໍ່ສໍາເລັດ",
      duration: 4,
    });
  }
};

const isAddModalVisible = ref(false);

const openAddModal = () => {
  isAddModalVisible.value = true;
};

const handleCancel = () => {
  isAddModalVisible.value = false;
};

const handleUpdateCancel = () => {
  isEditModalVisible.value = false;
};

const formState = ref({
  title: "",
  teacher_id: "",
  category_id: "",
  max_student: 0,
  duration_hours: 0,
  price: 0,
  registration_start_date: "",
  registration_end_date: "",
  start_date: "",
  end_date: "",
  description: "",
});

const resetForm = () => {
  formState.value = {
    title: "",
    teacher_id: "",
    category_id: "",
    max_student: 0,
    duration_hours: 0,
    price: 0,
    registration_start_date: "",
    registration_end_date: "",
    start_date: "",
    end_date: "",
    description: "",
  };
};

const submitAdd = async () => {
  try {
    console.log("object", formState);
    await createCourse(formState.value);
    notification.success({
      message: "ບັນທຶກສໍາເລັດ",
      duration: 4,
    });
    isAddModalVisible.value = false;
    resetForm();
    await fetchData();
  } catch (err) {
    notification.error({
      message: "ບັນທຶກບໍ່ສໍາເລັດ",
      duration: 4,
    });
  }
};

const router = useRouter();

const onViewDetail = (id: number) => {
  router.push({ name: "detail", params: { id } });
};
</script>

<template>
  <div class="customer-header">
    <h1>Course</h1>
    <div>
      <a-button
        type="primary"
        class="clear-btn"
        :icon="h(PlusCircleFilled)"
        @click="openAddModal"
      >
        Add Course
      </a-button>
    </div>
  </div>

  <a-table
    :columns="columns"
    :data-source="data.courses"
    :loading="loading"
    :pagination="data.pagination"
    :scroll="{ x: 'max-content' }"
    row-key="id"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'id'">
        {{
          (data.pagination.current - 1) * data.pagination.pageSize + index + 1
        }}
      </template>
      <template v-else-if="column.key === 'title'">
        <a class="gold-highlight">{{ record.title }}</a>
      </template>
      <template v-else-if="column.key === 'status'">
        <a-tag
          :color="
            record.status === 'open'
              ? 'green'
              : record.status === 'closed'
              ? 'red'
              : 'default'
          "
          class="status-font"
        >
          {{
            record.status === "open"
              ? "ເປີດ"
              : record.status === "closed"
              ? "ປິດ"
              : "-"
          }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'action_status'">
        <a-switch
          :checked="record.status === 'open'"
          @change="(checked: boolean) => { record.status = checked ? 'open' : 'closed' }"
          checked-children="ເປີດ"
          un-checked-children="ປິດ"
          :class="record.status === 'open' ? 'switch-open' : 'switch-closed'"
        />
      </template>

      <template v-else-if="column.key === 'action'">
        <span class="action-icons">
          <!-- View Detail Icon -->
          <a-tooltip title="View Detail">
            <eye-outlined class="icon view" @click="onViewDetail(record.id)" />
          </a-tooltip>
          <a-tooltip title="Edit">
            <edit-outlined class="icon edit" @click="openUpdateModal(record)" />
          </a-tooltip>
          <a-tooltip title="Delete">
            <a-popconfirm
              title="Are you sure to delete this?"
              @confirm="onDelete(record.id)"
            >
              <delete-outlined class="icon delete" />
            </a-popconfirm>
          </a-tooltip>
        </span>
      </template>
    </template>
  </a-table>

  <!-- Add Course Modal -->
  <div>
    <a-modal
      v-model:open="isAddModalVisible"
      title="Add Course"
      :footer="null"
      @cancel="handleCancel"
    >
      <!-- Modal Form Content -->
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Select Teacher">
              <a-select
                v-model:value="formState.teacher_id"
                show-search
                placeholder="Select teacher"
                allowClear
                :options="data.teachers"
                :status="formState.teacher_id ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Select Category">
              <a-select
                v-model:value="formState.category_id"
                placeholder="Select category"
                allowClear
                :options="data.categories"
                :status="formState.category_id ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Title">
              <a-textarea
                v-model:value="formState.title"
                placeholder="Enter course title"
                :rows="2"
                :status="formState.title ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Max Student">
              <a-input
                type="number"
                min="0"
                v-model:value="formState.max_student"
                placeholder="Enter max student"
                :status="formState.max_student ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Duration Hours">
              <a-input
                type="number"
                min="0"
                v-model:value="formState.duration_hours"
                placeholder="Enter duration hours"
                :status="formState.max_student ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Price">
              <a-input
                type="number"
                min="0"
                v-model:value="formState.price"
                placeholder="Enter price"
                :status="formState.price ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Registration Start Date">
              <a-date-picker
                v-model:value="formState.registration_start_date"
                placeholder="Select registration start date"
                style="width: 100%"
                :status="formState.registration_start_date ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Registration End Date">
              <a-date-picker
                v-model:value="formState.registration_end_date"
                placeholder="Select registration end date"
                style="width: 100%"
                :status="formState.registration_end_date ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Course Start Date">
              <a-date-picker
                v-model:value="formState.start_date"
                placeholder="Select course start date"
                style="width: 100%"
                :status="formState.start_date ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Course End Date">
              <a-date-picker
                v-model:value="formState.end_date"
                placeholder="Select course end date"
                style="width: 100%"
                :status="formState.end_date ? '' : 'error'"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Description">
          <a-textarea
            v-model:value="formState.description"
            placeholder="Enter course description"
            :rows="3"
            :status="formState.description ? '' : 'error'"
          />
        </a-form-item>
      </a-form>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <a-button @click="handleCancel">Cancel</a-button>
        <a-button type="primary" class="custom-ok-btn" @click="submitAdd"
          >Confirm</a-button
        >
      </div>
    </a-modal>
  </div>

  <!-- update Course Modal -->
  <div>
    <!-- Edit Course Modal -->
    <a-modal
      v-model:open="isEditModalVisible"
      title="Edit Course"
      :footer="null"
      @cancel="handleUpdateCancel"
    >
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Select Teacher">
              <a-select
                v-model:value="formUpdate.teacher_id"
                placeholder="Select teacher"
                :options="data.teachers"
                :status="formUpdate.teacher_id ? '' : 'error'"
                allowClear
                show-search
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Select Category">
              <a-select
                v-model:value="formUpdate.category_id"
                placeholder="Select category"
                allowClear
                :options="data.categories"
                :status="formUpdate.category_id ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Title">
              <a-textarea
                v-model:value="formUpdate.title"
                placeholder="Enter course title"
                :rows="2"
                :status="formUpdate.title ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Max Student">
              <a-input
                type="number"
                min="0"
                v-model:value="formUpdate.max_student"
                placeholder="Enter max student"
                :status="formUpdate.max_student ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Duration Hours">
              <a-input
                type="number"
                min="0"
                v-model:value="formUpdate.duration_hours"
                placeholder="Enter duration hours"
                :status="formUpdate.duration_hours ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Price">
              <a-input
                type="number"
                min="0"
                v-model:value="formUpdate.price"
                placeholder="Enter price"
                :status="formUpdate.price ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Registration Start Date">
              <a-date-picker
                v-model:value="formUpdate.registration_start_date"
                placeholder="Select registration start date"
                style="width: 100%"
                :status="formUpdate.registration_start_date ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Registration End Date">
              <a-date-picker
                v-model:value="formUpdate.registration_end_date"
                placeholder="Select registration end date"
                style="width: 100%"
                :status="formUpdate.registration_end_date ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Course Start Date">
              <a-date-picker
                v-model:value="formUpdate.start_date"
                placeholder="Select course start date"
                style="width: 100%"
                :status="formUpdate.start_date ? '' : 'error'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Course End Date">
              <a-date-picker
                v-model:value="formUpdate.end_date"
                placeholder="Select course end date"
                style="width: 100%"
                :status="formUpdate.end_date ? '' : 'error'"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="Description">
          <a-textarea
            v-model:value="formUpdate.description"
            placeholder="Enter description"
            :rows="3"
          />
        </a-form-item>
      </a-form>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <a-button @click="handleUpdateCancel">Cancel</a-button>
        <a-button type="primary" class="custom-ok-btn" @click="SubmitUpdate">
          Confirm
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped>
.status-font {
  font-family: "Noto Sans Lao", sans-serif;
}

.action-icons {
  display: flex;
  justify-content: center;
  gap: 10px;

  .icon {
    font-size: 20px;
    cursor: pointer;
    transition: color 0.3s;

    &.edit {
      color: #ffd700;

      &:hover {
        color: #e6c200;
      }
    }

    &.delete {
      color: #ff4d4f;

      &:hover {
        color: #ff7875;
      }
    }
  }
}

.gold-highlight {
  color: black;
  padding: 2px 4px;
  display: inline-block;
  border-radius: 4px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #ffd700;
  }
}

.customer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
}

.customer-header h1 {
  color: black;
}

.customer-header .clear-btn {
  background-color: #ffd700 !important;
  color: white !important;
  border: none;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
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

.switch-open {
  background-color: #ffd700 !important; /* gold */
}

.switch-closed {
  background-color: red !important;
}

.icon.view {
  font-size: 20px;
  color: #1890ff; /* or any color to make it visible */
}
</style>
