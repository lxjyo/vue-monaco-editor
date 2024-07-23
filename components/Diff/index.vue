<script setup lang="ts">
import { ref, shallowRef, toRefs, watch, onMounted, onUnmounted, nextTick } from "vue";
import type { editor } from "monaco-editor";
import useMonaco from "../useMonaco";
import type { MonacoEditor, Nullable } from "../types";
defineOptions({
  name: "Diff",
});

interface IDiffProps {
  original: string;
  modified: string;
  language?: string;
  height?: number | string;
  // 是否显示标题
  showTitle?: boolean;
  // 是否使用inline模式对比
  inline?: boolean;
  options?: editor.IStandaloneDiffEditorConstructionOptions;
}

interface IDiffEmits {
  (e: "update:original", value: string): void;
  (e: "mount", diff: editor.IStandaloneDiffEditor, monaco: MonacoEditor): void;
}

const defaultOptions: editor.IStandaloneDiffEditorConstructionOptions = {
  readOnly: true, // 只读
  enableSplitViewResizing: true, // 允许调整大小
  automaticLayout: true, // 自动调整布局
  scrollBeyondLastLine: false, // 滚动
  fontSize: 14,
};
const props = withDefaults(defineProps<IDiffProps>(), {
  language: "json",
  height: "500px",
  showTitle: true,
  inline: false,
  options: () => ({}),
});
const emits = defineEmits<IDiffEmits>();
const { options, original, modified, language } = toRefs(props);
const diffRef = ref<Nullable<HTMLDivElement>>();
const diffInstance = shallowRef<Nullable<editor.IStandaloneDiffEditor>>();
const inlineMode = ref(props.inline);
const fullscreen = ref(false);
const { monacoRef, unload } = useMonaco();

// 全屏切换
const addFullscreenAction = () => {
  if (diffInstance.value) {
    const monacoDiffInstance = diffInstance.value;
    // 需要分开添加，否则sidebyside时，只有一侧有新增的菜单
    const originEditor = monacoDiffInstance.getOriginalEditor();
    const modifiedEditor = monacoDiffInstance.getModifiedEditor();
    // 添加全屏功能
    const fullscreenAction = {
      id: "Fullscreen",
      label: "Toggle Fullscreen",
      contextMenuOrder: 2,
      contextMenuGroupId: "1_modification",
      run: () => {
        fullscreen.value = !fullscreen.value;
      },
    };
    originEditor.addAction(fullscreenAction);
    modifiedEditor.addAction(fullscreenAction);
  }
};

// 切换模式action
const addToggleModeAction = () => {
  if (diffInstance.value) {
    const monacoDiffInstance = diffInstance.value;
    // 需要分开添加，否则sidebyside时，只有一侧有新增的菜单
    const originEditor = monacoDiffInstance.getOriginalEditor();
    const modifiedEditor = monacoDiffInstance.getModifiedEditor();
    // 添加切换模式功能
    const toggleModeAction = {
      id: "inlineMode",
      label: "Toggle Mode",
      contextMenuOrder: 2,
      contextMenuGroupId: "1_modification",
      run: () => {
        inlineMode.value = !inlineMode.value;
      },
    };
    originEditor.addAction(toggleModeAction);
    modifiedEditor.addAction(toggleModeAction);
  }
};
// 设置内容
const setModel = (original: string, modified: string) => {
  if (monacoRef.value) {
    const originModel = monacoRef.value.editor.createModel(
      original,
      language.value
    );
    const modifiedModel = monacoRef.value.editor.createModel(
      modified,
      language.value
    );
    diffInstance.value?.setModel({
      original: originModel,
      modified: modifiedModel,
    });
  }
};

// 获取内容
const getModelValue = (): string[] => {
  const monacoDiffModel = diffInstance.value?.getModel();
  const original = monacoDiffModel?.original.getValue() || "";
  const modified = monacoDiffModel?.modified?.getValue() || "";
  return [original, modified] as const;
};

// 添加修改内容事件
const addChangeEvent = () => {
  // 需要分开添加，否则sidebyside时，只有一侧有新增的菜单
  const originEditor = diffInstance.value?.getOriginalEditor();
  originEditor?.onDidChangeModelContent(() => {
    // 获取编辑器中的语句
    const value = originEditor.getValue();
    emits("update:original", value);
  });
};

// 初始化实例
const initDiffInstance = () => {
  if (diffRef.value && monacoRef.value) {
    diffInstance.value = monacoRef.value.editor.createDiffEditor(
      diffRef.value,
      {
        ...defaultOptions,
        ...options.value,
        renderSideBySide: !inlineMode.value,
      }
    );
    addFullscreenAction();
    addToggleModeAction();
    setModel(original.value, modified.value);
    // original 可编辑时，添加修改事件
    if (options.value.originalEditable) {
      addChangeEvent();
    }
    emits("mount", diffInstance.value, monacoRef.value);
  }
};
// 监听内容的变化
watch([original, modified], ([newOriginal, newModified]) => {
  const [originalValue, modifiedValue] = getModelValue();
  if (originalValue !== newOriginal || modifiedValue !== newModified) {
    setModel(newOriginal, newModified);
  }
});

watch(monacoRef, () => {
  nextTick(initDiffInstance)
}, {
  immediate: true,
});
onUnmounted(() => {
  if (diffInstance.value) {
    diffInstance.value.dispose();
  } else {
    unload();
  }
});
</script>
<template>
  <div :class="['diff-container', fullscreen ? 'fullscreen' : '']">
    <div class="diff-title-container" v-if="showTitle">
      <slot>original >> modified </slot>
    </div>
    <div ref="diffRef" :style="{ height: fullscreen ? '100%' : height }"></div>
  </div>
</template>
<style lang="less" scoped>
.diff-container {
  box-sizing: border-box;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}
.diff-container.fullscreen {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  border-radius: 0;
  // background-color: #fff;
}
.diff-title-container {
  box-sizing: border-box;
  padding: 0 16px;
  height: 36px;
  line-height: 36px;
  border-bottom: 1px solid #d9d9d9;
}
</style>
