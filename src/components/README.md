# Global Components

## TextEditor Component

A rich text editor component built with Quill.js that can be used throughout the application.

### Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import TextEditor from '@/components/TextEditor.vue';

const content = ref('<p>Hello World</p>');
</script>

<template>
  <TextEditor
    v-model:value="content"
    placeholder="Enter your content here..."
    height="200px"
    theme="snow"
  />
</template>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `""` | The HTML content of the editor |
| `placeholder` | `string` | `"Enter content..."` | Placeholder text when editor is empty |
| `height` | `string` | `"150px"` | Minimum height of the editor |
| `readonly` | `boolean` | `false` | Whether the editor is read-only |
| `theme` | `'snow' \| 'bubble'` | `'snow'` | Quill editor theme |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when content changes |

### Methods (via ref)

| Method | Description |
|--------|-------------|
| `getContent()` | Gets the current HTML content |
| `setText(text: string)` | Sets the editor content |
| `clear()` | Clears all content |

### Features

- Rich text formatting (bold, italic, underline, etc.)
- Headers, lists, quotes, code blocks
- Links and image insertion
- Text colors and backgrounds
- Alignment options
- Font sizes and families
- RTL support
- Read-only mode
- Responsive design
- Ant Design themed styling

### Examples

#### Basic Usage
```vue
<TextEditor
  v-model:value="content"
  placeholder="Write something amazing..."
/>
```

#### Read-only Mode
```vue
<TextEditor
  v-model:value="content"
  :readonly="true"
  height="100px"
/>
```

#### Custom Height
```vue
<TextEditor
  v-model:value="content"
  height="300px"
  placeholder="Long form content here..."
/>
```

#### Bubble Theme
```vue
<TextEditor
  v-model:value="content"
  theme="bubble"
  placeholder="Click to edit..."
/>
```

#### With Methods
```vue
<script setup lang="ts">
import { ref } from 'vue';
import TextEditor from '@/components/TextEditor.vue';

const editorRef = ref();
const content = ref('');

const clearEditor = () => {
  editorRef.value.clear();
};

const setSampleText = () => {
  editorRef.value.setText('<h2>Sample Title</h2><p>This is sample content.</p>');
};
</script>

<template>
  <TextEditor
    ref="editorRef"
    v-model:value="content"
    height="200px"
  />
  <div style="margin-top: 16px;">
    <button @click="clearEditor">Clear</button>
    <button @click="setSampleText">Set Sample</button>
  </div>
</template>
```