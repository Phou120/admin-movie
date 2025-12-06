<template>
  <a-layout-header style="background: #fff">
    <menu-unfold-outlined
      v-if="collapsed"
      class="trigger"
      @click="onCollapsed"
      style="font-size: 20px; margin-left: -35px"
    />
    <menu-fold-outlined
      v-else
      class="trigger"
      @click="onCollapsed"
      style="margin-left: -35px; font-size: 20px"
    />

    <div class="header-action-container">
      <a-badge count="2">
        <a-avatar shape="square" size="large" class="navbar-btn">
          <shopping-cart-outlined class="menu-icon" />
        </a-avatar>
      </a-badge>
      <a-badge count="3">
        <a-avatar shape="square" size="large" class="navbar-btn">
          <comment-outlined class="menu-icon" />
        </a-avatar>
      </a-badge>
      <!-- <a-badge>
        <a-avatar shape="square" size="large" class="navbar-btn">
          <LogoutOutlined />
        </a-avatar>
      </a-badge> -->
      <a-badge>
        <a-avatar
          shape="square"
          size="large"
          class="navbar-btn"
          @click="confirmLogout"
          style="cursor: pointer"
        >
          <LogoutOutlined />
        </a-avatar>
      </a-badge>
    </div>
  </a-layout-header>
</template>

<script lang="ts" setup>
import { h, ref } from "vue";
import {
  ShoppingCartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CommentOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import { message, Modal } from "ant-design-vue";

const collapsed = ref<boolean>(false);

const emit = defineEmits<{ (e: "toggleSidebar"): void }>();

const onCollapsed = () => {
  collapsed.value = !collapsed.value;
  emit("toggleSidebar");
};

const router = useRouter();

function confirmLogout() {
  Modal.confirm({
    title: "ຢືນຢັນການອອກຈາກລະບົບ",
    icon: h(ExclamationCircleOutlined),
    content: "ທ່ານແນ່ໃຈບໍວ່າຈະອອກຈາກລະບົບ?",
    okText: "ຕົກລົງ",
    cancelText: "ຍົກເລີກ",
    centered: true,
    width: 280, // set smaller width directly
    class: "custom-confirm-modal",
    // okButtonProps: {
    //   style: {
    //     backgroundColor: "#FFD700",
    //     borderColor: "#FFD700",
    //     color: "#000",
    //   },
    // },
    style: {
      top: "20px",
      right: "20px",
      position: "fixed",
      margin: 0,
      zIndex: 1000,
    },
    async onOk() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        localStorage.removeItem("token");
        message.success("ທ່ານໄດ້ອອກຈາກລະບົບແລ້ວ.");
        router.push("/login");
      } catch (err) {
        message.error("ການອອກຈາກລະບົບລົ້ມເຫຼວ. ກະລຸນາລອງໃໝ່.");
      }
    },
  });
}
</script>

<style lang="scss" scoped>
.header-action-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  margin-right: -25px;
  .navbar-btn {
    background-color: #0d334aff;
    // background-color: rgb(191, 219, 254);
    // color: #FFD700;
    color: rgb(255, 255, 255);
    width: 32px;
    height: 32px;
    line-height: 32px;
    border-radius: 50% !important;
    padding-right: 0;
    padding-left: 0;
    text-align: center !important;
    :hover {
      cursor: pointer;
    }
  }
}
.ant-layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

/* Make the overall modal smaller */
.custom-confirm-modal.ant-modal {
  width: 280px !important;
  max-width: 90%;
}

/* Style the modal box content */
.custom-confirm-modal .ant-modal-content {
  padding: 12px;
  border-radius: 8px;
}

/* Style the body text */
.custom-confirm-modal .ant-modal-body {
  font-size: 14px;
}
</style>
