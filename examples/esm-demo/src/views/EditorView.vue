<script setup lang="ts">
// import { loader, Editor } from 'monaco-components';
import { ref } from 'vue';
// import monaco from '../monaco';
// import registerCompletion from './registerCompletion';
// loader.config({
//   monaco
// });
// registerCompletion(monaco, 'sql');
const value = ref('');
const editorRef = ref(null);
const onMountEditor = value => {
  console.log(editorRef.value, value);
  editorRef.value = value;
};
</script>
<template>
  <Editor v-model:value="value" language="sql" @mount="onMountEditor" />
</template>
