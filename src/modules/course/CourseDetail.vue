<template>
  <div>
    <!-- Back Button -->
    <a-button type="default" @click="goBack" class="custom-back-button">
      <template #icon>
        <ArrowLeftOutlined />
      </template>
      ກັບໄປທີ່ຫຼັກສູດ
    </a-button>
    <br /><br />

    <!-- Course Details Card -->
    <a-card v-if="course" title="ລາຍລະອຽດຫຼັກສູດ" :bordered="false">
      <!-- Basic Info -->
      <a-descriptions column="2" size="small">
        <template #title>
          <IdcardOutlined style="margin-right: 6px" />
          ຂໍ້ມູນພື້ນຖານ
        </template>

        <a-descriptions-item label="ຫົວຂໍ້">{{
          course.title
        }}</a-descriptions-item>
        <a-descriptions-item label="ລາຍລະອຽດ">{{
          course.description
        }}</a-descriptions-item>
        <a-descriptions-item label="ນັກຮຽນສູງສຸດ">{{
          course.max_student
        }}</a-descriptions-item>
        <a-descriptions-item label="ຊົ່ວໂມງ">{{
          course.duration_hours
        }}</a-descriptions-item>
        <a-descriptions-item label="ລາຄາ">{{
          course.price
        }}</a-descriptions-item>
        <a-descriptions-item label="ສະຖານະ">
          <a-tag :color="course.status === 'open' ? 'green' : 'red'">
            {{ course.status }}
          </a-tag>
        </a-descriptions-item>
      </a-descriptions>

      <a-divider />

      <!-- Course Dates -->
      <a-descriptions column="2" size="small">
        <template #title>
          <CalendarOutlined style="margin-right: 6px" />
          ວັນທີຂອງຫຼັກສູດ
        </template>

        <a-descriptions-item label="ເລີ່ມລົງທະບຽນ">{{
          course.registration_start_date
        }}</a-descriptions-item>
        <a-descriptions-item label="ສິ້ນສຸດການລົງທະບຽນ">{{
          course.registration_end_date
        }}</a-descriptions-item>
        <a-descriptions-item label="ເລີ່ມຮຽນ">{{
          course.start_date
        }}</a-descriptions-item>
        <a-descriptions-item label="ສິ້ນສຸດການຮຽນ">{{
          course.end_date
        }}</a-descriptions-item>
      </a-descriptions>

      <a-divider />

      <!-- Teacher Info -->
      <a-descriptions column="2" size="small">
        <template #title>
          <UserOutlined style="margin-right: 6px" />
          ຂໍ້ມູນອາຈານ
        </template>

        <a-descriptions-item label="ຊື່ຜູ້ສອນ">{{
          course.teacher?.user?.username
        }}</a-descriptions-item>
        <a-descriptions-item label="ອີເມວ">{{
          course.teacher?.user?.email
        }}</a-descriptions-item>
        <a-descriptions-item label="ວິຊາສະເພາະ">{{
          course.teacher?.specialization
        }}</a-descriptions-item>
        <a-descriptions-item label="ປະສົບການ">{{
          course.teacher?.experience
        }}</a-descriptions-item>
        <a-descriptions-item label="ລະດັບສຶກສາ">{{
          course.teacher?.education
        }}</a-descriptions-item>
      </a-descriptions>

      <a-divider />

      <!-- Category Info -->
      <a-descriptions column="1" size="small">
        <template #title>
          <FolderOpenOutlined style="margin-right: 6px" />
          ຂໍໍ້ມູນປະເພດ
        </template>

        <a-descriptions-item label="ຊື່">{{
          course.category?.name
        }}</a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- Centered Loading Spinner -->
    <div
      v-else
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
        margin-top: 50px;
      "
    >
      <a-spin />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "../../common/configuration/axios.config";

// Ant Design Icons
import {
  IdcardOutlined,
  CalendarOutlined,
  UserOutlined,
  FolderOpenOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons-vue";

const course = ref(null);
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  try {
    const { data } = await apiClient.get(`/course/by-id/${route.params.id}`);
    course.value = data.data;
  } catch (error) {
    console.error("Error loading course detail:", error);
  }
});

const goBack = () => router.push({ name: "course" });
</script>

<style scoped>
a-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

a-card,
a-card * {
  font-weight: 25px !important;
}

.custom-back-button {
  background-color: #ffd700;
  border-color: #ffd700;
  color: #000;
  font-weight: bold;
}

.custom-back-button:hover {
  background-color: #000;
  border-color: #000;
  color: #ffd700;
  font-weight: bold;
}
</style>
