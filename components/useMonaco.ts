import loader from '@monaco-editor/loader';
import { onMounted, shallowRef } from 'vue';
import type { Nullable, MonacoEditor } from './types/index';
function useMonaco() {
  const monacoRef = shallowRef<Nullable<MonacoEditor>>(loader.__getMonacoInstance());
  let cancelable: ReturnType<typeof loader.init>;

  onMounted(() => {
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

export default useMonaco;
