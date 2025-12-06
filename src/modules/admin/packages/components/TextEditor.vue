<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

interface Props {
  modelValue?: string;
  placeholder?: string;
  height?: string;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "Enter content...",
  height: "150px",
});

const emit = defineEmits<Emits>();

const quillEditor = ref<any>(null);
const editorElement = ref<HTMLDivElement | null>(null);

let Quill: any = null;

onMounted(async () => {
  // Dynamically import Quill to avoid SSR issues
  const QuillModule = await import("quill");
  Quill = QuillModule.default;

  if (editorElement.value && Quill) {
    // Initialize Quill editor
    quillEditor.value = new Quill(editorElement.value, {
      theme: "snow",
      placeholder: props.placeholder,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ["clean"],
          ["link", "image"],
        ],
      },
    });

    // Set initial content
    if (props.modelValue) {
      quillEditor.value.root.innerHTML = props.modelValue;
    }

    // Listen for content changes
    quillEditor.value.on("text-change", () => {
      const html = quillEditor.value.root.innerHTML;
      emit("update:modelValue", html);
    });
  }
});

// Watch for external value changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (quillEditor.value && newValue !== quillEditor.value.root.innerHTML) {
      quillEditor.value.root.innerHTML = newValue || "";
    }
  }
);
</script>

<template>
  <div class="text-editor-container">
    <div ref="editorElement" class="quill-editor"></div>
  </div>
</template>

<style lang="scss" scoped>
.text-editor-container {
  .quill-editor {
    min-height: v-bind(height);
  }
}

// Global styles for Quill editor
:global(.ql-toolbar) {
  border-radius: 6px 6px 0 0;
  border-color: #d9d9d9;
  background-color: #fafafa;

  &:hover {
    border-color: #4096ff;
  }

  &.ql-active {
    border-color: #4096ff;
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }
}

:global(.ql-container) {
  border-radius: 0 0 6px 6px;
  border-color: #d9d9d9;
  font-size: 14px;

  &:hover {
    border-color: #4096ff;
  }

  &.ql-active {
    border-color: #4096ff;
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }
}

:global(.ql-editor) {
  min-height: v-bind(height);
  padding: 12px;

  &:hover {
    border-color: #4096ff;
  }
}

// Customize toolbar buttons
:global(.ql-toolbar button) {
  border-radius: 4px;

  &:hover {
    background-color: rgba(24, 144, 255, 0.1);
  }
}

// Customize colors in the toolbar
:global(.ql-toolbar .ql-picker) {
  &:hover {
    border-color: #4096ff;
  }
}

:global(.ql-toolbar .ql-picker-label) {
  &:hover {
    color: #4096ff;
  }
}
</style>
