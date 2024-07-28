import type { Nullable } from './types/index';
declare function useMonaco(): {
    monacoRef: import("vue").ShallowRef<Nullable<typeof import("monaco-editor")>>;
    unload: () => void;
};
export default useMonaco;
