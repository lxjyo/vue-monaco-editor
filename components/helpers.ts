import loader from "@monaco-editor/loader";
import type { App, Plugin, Component, DefineComponent } from "vue";

// 这里定义了一个新的 SFCWithInstall 的类型
// 这是一个泛型类型，代表的是一个即是类型 T 又是 Plugin 类型的类型
// 也就是说，这个类型的对象既有 T 类型的所有属性和方法，也有 Plugin 的所有属性和方法
export type SFCWithInstall<T> = T & Plugin;

export const withInstall = <T extends Component | DefineComponent>(
  component: T
) => {
  (component as SFCWithInstall<T>).install = (app: App) => {
    const name = (component as SFCWithInstall<T>).name as string;
    // 注册组件
    app.component(name, component);
  };
  return component as SFCWithInstall<T>;
};

type Options = Parameters<typeof loader.config>[0];

/**
 * 创建一个Vue插件，用于注册一组组件。
 * @param components 组件数组，每个组件应该是一个具有 `name` 属性的 Vue 组件。
 * @returns Vue插件对象，包含一个`install`方法。
 */
export function createPlugin(
  components: (Component | DefineComponent)[]
): Plugin {
  return {
    install: (app: App, options: Options) => {
      if (options) {
        loader.config(options);
      }
      components.forEach((component) => {
        app.component(component.name as string, component);
      });
    },
  };
}
