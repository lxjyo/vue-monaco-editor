<script setup lang="ts">
import { loader, Editor } from "monaco-components";
import monaco from "../monaco";
import registerCompletion from "./registerCompletion";
loader.config({
  monaco
});
registerCompletion(monaco, "sql");
import { onMounted, ref } from "vue";
const value = ref("");
const editorRef = ref(null);
const onMountEditor = (value) => {
  console.log(editorRef.value, value);
  editorRef.value = value;
  console.log(editorRef.value.onDidChangeModelContent)
}
</script>
<template>
  <Editor v-model:value="value" language="sql" @mount="onMountEditor" />
</template>
