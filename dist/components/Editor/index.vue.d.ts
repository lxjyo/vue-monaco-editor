declare const _default: import('vue').DefineComponent<
  {
    value: {
      type: StringConstructor;
      required: true;
    };
    language: {
      type: StringConstructor;
      required: false;
      default: string;
    };
    height: {
      type: (StringConstructor | NumberConstructor)[];
      required: false;
      default: string;
    };
    readonly: {
      type: BooleanConstructor;
      required: false;
      default: boolean;
    };
    placeholder: {
      type: StringConstructor;
      required: false;
    };
    options: {
      type: null;
      required: false;
      default: () => {};
    };
  },
  (
    _ctx: any,
    _cache: any
  ) => import('vue').VNode<
    import('vue').RendererNode,
    import('vue').RendererElement,
    {
      [key: string]: any;
    }
  >,
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  ('update:value' | 'change' | 'mount')[],
  'update:value' | 'change' | 'mount',
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<{
      value: {
        type: StringConstructor;
        required: true;
      };
      language: {
        type: StringConstructor;
        required: false;
        default: string;
      };
      height: {
        type: (StringConstructor | NumberConstructor)[];
        required: false;
        default: string;
      };
      readonly: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
      };
      placeholder: {
        type: StringConstructor;
        required: false;
      };
      options: {
        type: null;
        required: false;
        default: () => {};
      };
    }>
  > & {
    'onUpdate:value'?: ((...args: any[]) => any) | undefined;
    onChange?: ((...args: any[]) => any) | undefined;
    onMount?: ((...args: any[]) => any) | undefined;
  },
  {
    language: string;
    height: string | number;
    readonly: boolean;
    options: any;
  },
  {}
>;
export default _default;
