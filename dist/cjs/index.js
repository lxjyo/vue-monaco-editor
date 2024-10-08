'use strict';

var loader = require('@monaco-editor/loader');
var vue = require('vue');

const withInstall = (component) => {
    component.install = (app) => {
        const name = component.name;
        // 注册组件
        app.component(name, component);
    };
    return component;
};
/**
 * 创建一个Vue插件，用于注册一组组件。
 * @param components 组件数组，每个组件应该是一个具有 `name` 属性的 Vue 组件。
 * @returns Vue插件对象，包含一个`install`方法。
 */
function createPlugin(components) {
    return {
        install: (app, options) => {
            if (options) {
                loader.config(options);
            }
            components.forEach(component => {
                app.component(component.name, component);
            });
        }
    };
}

function useMonaco() {
    const monacoRef = vue.shallowRef(loader.__getMonacoInstance());
    let cancelable;
    vue.onMounted(() => {
        if (!monacoRef.value) {
            cancelable = loader.init();
            cancelable
                .then(monaco => {
                monacoRef.value = monaco;
            })
                .catch(error => {
                if (error?.type !== 'cancelation') {
                    console.error('Monaco initialization error:', error);
                }
            });
        }
    });
    const unload = () => cancelable?.cancel();
    return {
        monacoRef,
        unload
    };
}

var script$1 = /*#__PURE__*/ vue.defineComponent({
    ...{
        name: 'Editor'
    },
    __name: 'index',
    props: {
        value: { type: String, required: false, default: '' },
        language: { type: String, required: false, default: 'json' },
        height: { type: null, required: false, default: '500px' },
        readonly: { type: Boolean, required: false, default: false },
        placeholder: { type: String, required: false },
        options: { type: null, required: false, default: () => ({}) }
    },
    emits: ["update:value", "change", "mount"],
    setup(__props, { emit: __emit }) {
        // 默认options
        const defaultOptions = {
            theme: 'light',
            foldingStrategy: 'auto',
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            acceptSuggestionOnEnter: 'on',
            acceptSuggestionOnCommitCharacter: true,
            fontSize: 14,
            minimap: {
                enabled: false // 不要小地图
            }
        };
        const props = __props;
        const { monacoRef, unload } = useMonaco();
        const { value, language, readonly, options } = vue.toRefs(props);
        const emits = __emit;
        const editorRef = vue.ref(null);
        const editorInstance = vue.shallowRef(null);
        const fullscreen = vue.ref(false);
        const showPlaceholder = vue.ref(!!props.placeholder && !props.value);
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
                }
                else {
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
        const setValue = (content) => {
            editorInstance.value?.setValue(content);
        };
        // 获取编辑器内部值
        const getValue = () => {
            return editorInstance.value?.getValue();
        };
        // 设置语言
        const setModelLanguage = (language) => {
            if (editorInstance.value && monacoRef.value) {
                const model = editorInstance.value.getModel();
                monacoRef.value.editor.setModelLanguage(model, language);
            }
        };
        // 监听外部value的变化
        vue.watch(value, newValue => {
            if (newValue !== getValue()) {
                setValue(newValue);
            }
        });
        // 监听外部language的变化
        vue.watch(language, setModelLanguage);
        // 监听外部readonly的变化
        vue.watch(readonly, newValue => {
            editorInstance.value?.updateOptions({
                readOnly: newValue
            });
        });
        vue.watch(monacoRef, () => {
            vue.nextTick(initEditorInstance);
        }, {
            immediate: true
        });
        vue.onUnmounted(() => {
            if (editorInstance.value) {
                editorInstance.value.dispose();
            }
            else {
                unload();
            }
        });
        return (_ctx, _cache) => {
            return (vue.openBlock(), vue.createElementBlock("div", {
                class: vue.normalizeClass(['editor-container', { fullscreen: fullscreen.value }])
            }, [
                vue.withDirectives(vue.createElementVNode("div", { class: "placeholder" }, vue.toDisplayString(_ctx.placeholder), 513 /* TEXT, NEED_PATCH */), [
                    [vue.vShow, showPlaceholder.value]
                ]),
                vue.createElementVNode("div", {
                    ref_key: "editorRef",
                    ref: editorRef,
                    style: vue.normalizeStyle({ height: fullscreen.value ? '100%' : _ctx.height })
                }, null, 4 /* STYLE */)
            ], 2 /* CLASS */));
        };
    }
});

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$1 = ".editor-container[data-v-4696e08b] {\n  position: relative;\n  border: 1px solid #d9d9d9;\n  border-radius: 6px;\n  overflow: hidden;\n}\n.editor-container.fullscreen[data-v-4696e08b] {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  border-radius: 0;\n  z-index: 9999;\n  background-color: #fff;\n}\n.editor-container .placeholder[data-v-4696e08b] {\n  position: absolute;\n  top: 0;\n  left: 68px;\n  color: #d9d9d9;\n  pointer-events: none;\n  user-select: none;\n  z-index: 9;\n}\n";
styleInject(css_248z$1);

script$1.__scopeId = "data-v-4696e08b";
script$1.__file = "components/Editor/index.vue";

var Editor = withInstall(script$1);

const _hoisted_1 = {
    key: 0,
    class: "diff-title-container"
};
var script = /*#__PURE__*/ vue.defineComponent({
    ...{
        name: 'Diff'
    },
    __name: 'index',
    props: {
        original: { type: String, required: true },
        modified: { type: String, required: true },
        language: { type: String, required: false, default: 'json' },
        height: { type: null, required: false, default: '500px' },
        showTitle: { type: Boolean, required: false, default: true },
        inline: { type: Boolean, required: false, default: false },
        options: { type: null, required: false, default: () => ({}) }
    },
    emits: ["update:original", "mount"],
    setup(__props, { emit: __emit }) {
        const defaultOptions = {
            readOnly: true,
            enableSplitViewResizing: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            fontSize: 14
        };
        const props = __props;
        const emits = __emit;
        const { options, original, modified, language } = vue.toRefs(props);
        const diffRef = vue.ref();
        const diffInstance = vue.shallowRef();
        const inlineMode = vue.ref(props.inline);
        const fullscreen = vue.ref(false);
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
                    id: 'Fullscreen',
                    label: 'Toggle Fullscreen',
                    contextMenuOrder: 2,
                    contextMenuGroupId: '1_modification',
                    run: () => {
                        fullscreen.value = !fullscreen.value;
                    }
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
                    id: 'inlineMode',
                    label: 'Toggle Mode',
                    contextMenuOrder: 2,
                    contextMenuGroupId: '1_modification',
                    run: () => {
                        inlineMode.value = !inlineMode.value;
                    }
                };
                originEditor.addAction(toggleModeAction);
                modifiedEditor.addAction(toggleModeAction);
            }
        };
        // 设置内容
        const setModel = (original, modified) => {
            if (monacoRef.value) {
                const originModel = monacoRef.value.editor.createModel(original, language.value);
                const modifiedModel = monacoRef.value.editor.createModel(modified, language.value);
                diffInstance.value?.setModel({
                    original: originModel,
                    modified: modifiedModel
                });
            }
        };
        // 获取内容
        const getModelValue = () => {
            const monacoDiffModel = diffInstance.value?.getModel();
            const original = monacoDiffModel?.original.getValue() || '';
            const modified = monacoDiffModel?.modified?.getValue() || '';
            return [original, modified];
        };
        // 添加修改内容事件
        const addChangeEvent = () => {
            // 需要分开添加，否则sidebyside时，只有一侧有新增的菜单
            const originEditor = diffInstance.value?.getOriginalEditor();
            originEditor?.onDidChangeModelContent(() => {
                // 获取编辑器中的语句
                const value = originEditor.getValue();
                emits('update:original', value);
            });
        };
        // 初始化实例
        const initDiffInstance = () => {
            if (diffRef.value && monacoRef.value) {
                diffInstance.value = monacoRef.value.editor.createDiffEditor(diffRef.value, {
                    ...defaultOptions,
                    ...options.value,
                    renderSideBySide: !inlineMode.value
                });
                addFullscreenAction();
                addToggleModeAction();
                setModel(original.value, modified.value);
                // original 可编辑时，添加修改事件
                if (options.value.originalEditable) {
                    addChangeEvent();
                }
                emits('mount', diffInstance.value, monacoRef.value);
            }
        };
        // 监听内容的变化
        vue.watch([original, modified], ([newOriginal, newModified]) => {
            const [originalValue, modifiedValue] = getModelValue();
            if (originalValue !== newOriginal || modifiedValue !== newModified) {
                setModel(newOriginal, newModified);
            }
        });
        vue.watch(monacoRef, () => {
            vue.nextTick(initDiffInstance);
        }, {
            immediate: true
        });
        vue.onUnmounted(() => {
            if (diffInstance.value) {
                diffInstance.value.dispose();
            }
            else {
                unload();
            }
        });
        return (_ctx, _cache) => {
            return (vue.openBlock(), vue.createElementBlock("div", {
                class: vue.normalizeClass(['diff-container', fullscreen.value ? 'fullscreen' : ''])
            }, [
                (_ctx.showTitle)
                    ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
                        vue.renderSlot(_ctx.$slots, "default", {}, () => [
                            vue.createTextVNode("original >> modified ")
                        ])
                    ]))
                    : vue.createCommentVNode("v-if", true),
                vue.createElementVNode("div", {
                    ref_key: "diffRef",
                    ref: diffRef,
                    style: vue.normalizeStyle({ height: fullscreen.value ? '100%' : _ctx.height })
                }, null, 4 /* STYLE */)
            ], 2 /* CLASS */));
        };
    }
});

var css_248z = ".diff-container[data-v-006fa1e3] {\n  box-sizing: border-box;\n  border: 1px solid #d9d9d9;\n  border-radius: 6px;\n  overflow: hidden;\n}\n.diff-container.fullscreen[data-v-006fa1e3] {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 9999;\n  border-radius: 0;\n}\n.diff-title-container[data-v-006fa1e3] {\n  box-sizing: border-box;\n  padding: 0 16px;\n  height: 36px;\n  line-height: 36px;\n  border-bottom: 1px solid #d9d9d9;\n}\n";
styleInject(css_248z);

script.__scopeId = "data-v-006fa1e3";
script.__file = "components/Diff/index.vue";

var Diff = withInstall(script);

const components = [Editor, Diff];
const Plugin = createPlugin(components);

exports.loader = loader;
exports.Diff = Diff;
exports.Editor = Editor;
exports.Plugin = Plugin;
