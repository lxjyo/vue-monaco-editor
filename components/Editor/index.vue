<script setup lang="ts">
import type { editor } from 'monaco-editor';
import useMonaco from '../useMonaco';
import { ref, toRefs, watch, shallowRef, onUnmounted, nextTick } from 'vue';
import type { Nullable, MonacoEditor } from '../types';
interface IEditorProps {
  value: string;
  language?: string;
  height?: number | string;
  readonly?: boolean;
  placeholder?: string;
  options?: editor.IStandaloneEditorConstructionOptions;
}

interface IEditorEmits {
  (e: 'update:value', value: string): void;
  (e: 'change', value: string): void;
  (e: 'mount', editor: editor.IStandaloneCodeEditor, monaco: MonacoEditor): void;
}

defineOptions({
  name: 'Editor'
});

// 默认options
const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
  theme: 'light',
  foldingStrategy: 'auto', // 代码可分小段折叠
  formatOnPaste: true, // 格式化
  formatOnType: true,
  automaticLayout: true, // 自动调整布局
  scrollBeyondLastLine: false, // 滚动
  acceptSuggestionOnEnter: 'on',
  acceptSuggestionOnCommitCharacter: true,
  fontSize: 14,
  minimap: {
    enabled: false // 不要小地图
  }
};
const props = withDefaults(defineProps<IEditorProps>(), {
  height: '500px',
  language: 'json',
  readonly: false,
  options: () => ({})
});

const { monacoRef, unload } = useMonaco();
const { value, language, readonly, options } = toRefs(props);
const emits = defineEmits<IEditorEmits>();
const editorRef = ref<Nullable<HTMLDivElement>>(null);
const editorInstance = shallowRef<Nullable<editor.IStandaloneCodeEditor>>(null);
const fullscreen = ref<boolean>(false);
const showPlaceholder = ref<boolean>(!!props.placeholder && !props.value);

// 添加全屏功能
const addFullscreenAction = () => {
  editorInstance.value?.addAction({
    id: 'Fullscreen',
    label: 'Toggle Fullscreen',
    contextMenuOrder: 2,
    contextMenuGroupId: '1_modification',
    run: () => {
      fullscreen.value = !fullscreen.value;
    }
  });
};
// 添加修改内容事件
const addChangeEvent = () => {
  editorInstance.value?.onDidChangeModelContent(() => {
    // 获取编辑器中的语句
    const value = getValue();
    emits('update:value', value);
    emits('change', value);
    if (value) {
      showPlaceholder.value = false;
    } else {
      showPlaceholder.value = true;
    }
  });
};

// 初始化编辑器实例
const initEditorInstance = () => {
  console.log(editorRef.value, monacoRef.value);
  if (editorRef.value && monacoRef.value) {
    editorInstance.value = monacoRef.value.editor.create(editorRef.value, {
      ...defaultOptions,
      ...options.value,
      value: value.value,
      language: language.value,
      readOnly: readonly.value // 只读
    });
    addFullscreenAction();
    addChangeEvent();
    emits('mount', editorInstance.value, monacoRef.value);
  }
};

// 修改编辑器内部值
const setValue = (content: string) => {
  editorInstance.value?.setValue(content);
};

// 获取编辑器内部值
const getValue = () => {
  return editorInstance.value?.getValue() as string;
};

// 设置语言
const setModelLanguage = (language: string) => {
  if (editorInstance.value && monacoRef.value) {
    const model = editorInstance.value.getModel() as editor.ITextModel;
    monacoRef.value.editor.setModelLanguage(model, language);
  }
};

// 监听外部value的变化
watch(value, newValue => {
  if (newValue !== getValue()) {
    setValue(newValue);
  }
});
// 监听外部language的变化
watch(language, setModelLanguage);

// 监听外部readonly的变化
watch(readonly, newValue => {
  editorInstance.value?.updateOptions({
    readOnly: newValue
  });
});

watch(
  monacoRef,
  () => {
    nextTick(initEditorInstance);
  },
  {
    immediate: true
  }
);

onUnmounted(() => {
  if (editorInstance.value) {
    editorInstance.value.dispose();
  } else {
    unload();
  }
});
</script>
<template>
  <div :class="['editor-container', { fullscreen }]">
    <div class="placeholder" v-show="showPlaceholder">{{ placeholder }}</div>
    <div ref="editorRef" :style="{ height: fullscreen ? '100%' : height }"></div>
  </div>
</template>
<style lang="less" scoped>
.editor-container {
  position: relative;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  &.fullscreen {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0;
    z-index: 9999;
    background-color: #fff;
  }
  .placeholder {
    position: absolute;
    top: 0;
    left: 68px;
    color: #d9d9d9;
    pointer-events: none;
    user-select: none;
    z-index: 9;
  }
}
</style>
