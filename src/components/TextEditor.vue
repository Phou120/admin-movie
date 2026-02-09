<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

interface Props {
  modelValue?: string;
  placeholder?: string;
  height?: string;
  readonly?: boolean;
  theme?: "snow" | "bubble";
}

interface Emits {
  (e: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "Enter content...",
  height: "150px",
  readonly: false,
  theme: "snow",
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
      theme: props.theme,
      placeholder: props.placeholder,
      readOnly: props.readonly,
      modules: {
        toolbar: props.readonly
          ? false
          : [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
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
              ["link", "image", "video"],
              [{ emoji: true }],
            ],
      },
    });

    // Set initial content
    if (props.modelValue) {
      quillEditor.value.root.innerHTML = props.modelValue;
    }

    // Listen for content changes
    if (!props.readonly) {
      quillEditor.value.on("text-change", () => {
        const html = quillEditor.value.root.innerHTML;
        emit("update:modelValue", html);
      });
    }
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

// Expose methods for parent component
defineExpose({
  getContent: () => quillEditor.value?.root.innerHTML || "",
  setText: (text: string) => {
    if (quillEditor.value) {
      quillEditor.value.root.innerHTML = text;
    }
  },
  clear: () => {
    if (quillEditor.value) {
      quillEditor.value.setText("");
    }
  },
});
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

  &.ql-blank::before {
    font-style: normal;
  }
}

// Customize toolbar buttons
:global(.ql-toolbar button) {
  border-radius: 4px;
  margin: 1px;

  &:hover {
    background-color: rgba(24, 144, 255, 0.1);
  }

  &.ql-active {
    background-color: rgba(24, 144, 255, 0.1);
    color: #1890ff;
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

:global(.ql-toolbar .ql-picker-options) {
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

// Customize tooltips
:global(.ql-tooltip) {
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

// Fix for snow theme
:global(.ql-snow .ql-editor) {
  line-height: 1.6;
}

:global(.ql-snow .ql-stroke) {
  stroke: #595959;
}

:global(.ql-snow .ql-fill) {
  fill: #595959;
}

:global(.ql-snow .ql-picker-label::before) {
  color: #595959;
}

// RTL support
:global(.ql-editor.ql-rtl) {
  text-align: right;
}

// Focus styles
:global(.ql-container.ql-focus) {
  border-color: #4096ff;
  box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
}

:global(.ql-toolbar.ql-focus) {
  border-color: #4096ff;
  box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
}

// Read-only mode
:global(.ql-container.ql-disabled .ql-editor) {
  background-color: #f5f5f5;
  opacity: 0.7;
}
</style>
