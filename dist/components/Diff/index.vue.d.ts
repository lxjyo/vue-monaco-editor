declare const _default: import("vue").DefineComponent<{
    original: {
        type: StringConstructor;
        required: true;
    };
    modified: {
        type: StringConstructor;
        required: true;
    };
    language: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    height: {
        type: null;
        required: false;
        default: string;
    };
    showTitle: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    inline: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    options: {
        type: null;
        required: false;
        default: () => {};
    };
}, (_ctx: any, _cache: any) => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:original" | "mount")[], "update:original" | "mount", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    original: {
        type: StringConstructor;
        required: true;
    };
    modified: {
        type: StringConstructor;
        required: true;
    };
    language: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    height: {
        type: null;
        required: false;
        default: string;
    };
    showTitle: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    inline: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    options: {
        type: null;
        required: false;
        default: () => {};
    };
}>> & {
    "onUpdate:original"?: ((...args: any[]) => any) | undefined;
    onMount?: ((...args: any[]) => any) | undefined;
}, {
    height: any;
    language: string;
    showTitle: boolean;
    inline: boolean;
    options: any;
}, {}>;
export default _default;
