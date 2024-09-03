import loader from '@monaco-editor/loader';
import { createPlugin } from './helpers';
import Editor from './Editor/index';
import Diff from './Diff/index';

const components = [Editor, Diff];

export const Plugin = createPlugin(components);

export { Editor, Diff, loader };
