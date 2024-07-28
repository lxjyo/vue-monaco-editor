import type { Plugin, Component, DefineComponent } from 'vue';
export type SFCWithInstall<T> = T & Plugin;
export declare const withInstall: <T extends Component | DefineComponent>(
  component: T
) => SFCWithInstall<T>;
/**
 * 创建一个Vue插件，用于注册一组组件。
 * @param components 组件数组，每个组件应该是一个具有 `name` 属性的 Vue 组件。
 * @returns Vue插件对象，包含一个`install`方法。
 */
export declare function createPlugin(components: (Component | DefineComponent)[]): Plugin;
