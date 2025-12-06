<template>
  <div class="modal-footer">
    <a-button class="custom-cancel-btn" @click="$emit('cancel')">
      Cancel
    </a-button>

    <a-button type="primary" class="custom-ok-btn" @click="$emit('ok')">
      Confirm
    </a-button>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 15px;
}

.custom-ok-btn {
  background-color: #0d334aff;
  border-color: #0d334aff;
  color: #ffffff;
}

.custom-ok-btn:hover {
  background-color: #0d334aff;
  border-color: #0d334aff;
  color: #ffffff;
}

.custom-cancel-btn:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}
</style>
