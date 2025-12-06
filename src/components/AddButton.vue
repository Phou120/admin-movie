<template>
  <a-button
    type="primary"
    class="clear-btn"
    :icon="h(PlusCircleFilled)"
    @click="$emit('click')"
  >
    <span class="btn-text">{{ label }}</span>
  </a-button>
</template>

<script setup lang="ts">
import { h } from "vue";
import { PlusCircleFilled } from "@ant-design/icons-vue";

defineProps({
  label: { type: String, default: "Add" },
});
defineEmits(["click"]);
</script>

<style scoped>
.clear-btn {
  background-color: #0d334aff;
  border-color: #0d334aff;
  color: #ffffff;
}

.clear-btn:hover {
  background-color: #0d334aff;
  border-color: #0d334aff;
  color: #ffffff;
}
.btn-text {
  margin-left: 6px;
}
</style>
