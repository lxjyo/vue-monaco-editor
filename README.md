# vue-monaco-editor
基于monaco-editor的vue组件，包含编辑器、对比组件，支持全屏切换

## Installation
```
npm install vue-monaco-editor --save

```
## Usage
```ts
import { createApp } from 'vue';
import plugin from 'vue-monaco-editor';
const app = createApp(App);

app.use(plugin, {
  paths: {
    // CDN 配置
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs'
  },
});
```
**Editor**
```vue
<template>
  <Editor v-model:value="value" language="sql" @mount="onMountEditor" />
</template>
<script setup>
import { ref } from 'vue';
const value = ref('');
const editorRef = ref(null); // 获取编辑器实例
const onMountEditor = value => {
  console.log(editorRef.value, value);
  editorRef.value = value;
};
</script>
```
**Diff**
```vue
<template>
  <Diff :original="modified" :modified="originalContent" language="javascript" />
</template>
<script setup>
import { ref } from 'vue';
const modified = ref('');
const originalContent = ref('');
</script>
```
## Props & Events
### Editor
#### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| value(v-model:value) | string | - | 编辑器内容 |
| language | string | 'json' | 编辑器语言 |
| height | string\|number| '500px' | 编辑器高度 |
| readonly | boolean| false | 是否只读 |
| placeholder| string | - | 编辑器占位符 |
| options| editor.IStandaloneEditorConstructionOptions| - | [编辑器配置](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html)
```js
// 预设options:
{
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
}
```
#### Events
| Event | Type | Description |
| --- | --- | --- |
| mount | (editor: editor.IStandaloneCodeEditor, monaco: MonacoEditor) => void | 编辑器挂载后触发 |
| change | (value: string) => void | 编辑器内容改变触发 |

### Diff
#### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| original(v-model:original) | string | - | 原始内容 |
| modified | string | - | 修改内容 |
| language | string | 'json' | 编辑器语言 |
| height | string\|number| '500px' | 编辑器高度 |
| showTitle | boolean | true | 是否显示标题 |
| inline | boolean | false | // 是否使用inline模式对比 |
| options| editor.IStandaloneDiffEditorConstructionOptions| - | [DiffEditor](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IDiffEditorConstructionOptions.html)
```js
// 预设options:
{
  readOnly: true, // 只读
  enableSplitViewResizing: true, // 允许调整大小
  automaticLayout: true, // 自动调整布局
  scrollBeyondLastLine: false, // 滚动
  fontSize: 14
}
```
#### Events
| Event | Type | Description |
| --- | --- | --- |
| mount | (diff: editor.IStandaloneDiffEditor, monaco: MonacoEditor) => void | 挂载后触发 |

#### Slots
| Slot | Description |
| --- | --- |
| default | 对比标题 |

## Configuration
基于[@monaco-editor/loader](https://github.com/suren-atoyan/monaco-loader)配置来源

### CDN

```ts
import { createApp } from 'vue'
import VueMonacoEditorPlugin from 'vue-monaco-editor'

const app = createApp(App)
app.use(VueMonacoEditorPlugin, {
  paths: {
    // CDN 配置
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs'
  },
});
```
```ts
import { loader } from 'vue-monaco-editor'

// CDN 加载
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs'
  },
})

//  可以配置语言
loader.config({ "vs/nls": { availableLanguages: { "*": "de" } } })

// or
loader.config({
  paths: {
    vs: "...",
  },
  "vs/nls" : {
    availableLanguages: {
      "*": "de",
    },
  },
})
```
## NPM Package
如果你想以 `NPM Package` 的形式使用 [monaco-editor](https://microsoft.github.io/monaco-editor/)，从 `node_modules` 中加载 `monaco-editor` 文件并打包到你的代码中，则仍需要使用打包工具的插件。

```js
import * as monaco from "monaco-editor"
import { loader } from "vue-monaco-editor"

// 配置从 `node_modules` 中加载 monaco-editor
loader.config({ monaco });
```
### Vite

如果使用 `vite`，你需要这样做（具体可查看 [#1791 (comment)](https://github.com/vitejs/vite/discussions/1791#discussioncomment-321046)）：

```js
import { loader } from "@guolao/vue-monaco-editor"

import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker()
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker()
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker()
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

loader.config({ monaco })
```

### Rollup

如果使用 `Rollup`，你可以使用社区提供的插件 [rollup-plugin-monaco-editor](https://github.com/chengcyber/rollup-plugin-monaco-editor)。

### Webpack

如果使用 `webpack`，[monaco-editor](https://microsoft.github.io/monaco-editor/) 官方提供了 `webpack` 的插件 [monaco-editor-webpack-plugin](https://www.npmjs.com/package/monaco-editor-webpack-plugin)，你可以安装并使用它。

## Inspiration
源自于以下项目:

- [monaco-loader](https://github.com/suren-atoyan/monaco-loader)
- [monaco-react](https://github.com/suren-atoyan/monaco-react/tree/master)
- [monaco-vue](https://github.com/imguolao/monaco-vue)