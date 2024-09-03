import { language as sql } from 'monaco-editor/esm/vs/basic-languages/sql/sql';
const languageMap = {
  sql,
};

export default function registerCompletion(monaco, languageName) {
  if (!languageMap[languageName]) {
    return;
  }
  const language = languageMap[languageName];
  monaco.languages.registerCompletionItemProvider(languageName, {
    provideCompletionItems: function (model, position) {
      // get editor content before the pointer
      var textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });
      var match = textUntilPosition.match(/(\S+)$/);
      if (!match) return [];
      match = match[0].toUpperCase();

      var suggestions = [];
      (language.keywords || []).forEach(item => {
        if (item.toUpperCase().indexOf(match) !== -1) {
          suggestions.push({
            label: item,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: item,
            detail: 'keyword'
          });
        }
      });
      (language.operators || []).forEach(item => {
        if (item.indexOf(match) !== -1) {
          suggestions.push({
            label: item,
            kind: monaco.languages.CompletionItemKind.Operator,
            insertText: item,
            detail: 'operator'
          });
        }
      });

      (language.builtinFunctions || []).forEach(item => {
        if (item.indexOf(match) !== -1) {
          suggestions.push({
            label: item,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: item,
            detail: 'function'
          });
        }
      });
      return {
        suggestions
      };
    }
  });
}
