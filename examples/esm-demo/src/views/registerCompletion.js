import { language as sql } from 'monaco-editor/esm/vs/basic-languages/sql/sql';
import { language as javascript } from 'monaco-editor/esm/vs/basic-languages/javascript/javascript';
import { language as mysql } from 'monaco-editor/esm/vs/basic-languages/mysql/mysql';
import { language as sparql } from 'monaco-editor/esm/vs/basic-languages/sparql/sparql';
import { language as java } from 'monaco-editor/esm/vs/basic-languages/java/java';
import { language as python } from 'monaco-editor/esm/vs/basic-languages/python/python';
import { language as go } from 'monaco-editor/esm/vs/basic-languages/go/go';
import { language as yaml } from 'monaco-editor/esm/vs/basic-languages/yaml/yaml';
import { language as shell } from 'monaco-editor/esm/vs/basic-languages/shell/shell';
import { language as xml } from 'monaco-editor/esm/vs/basic-languages/xml/xml';
const languageMap = {
  javascript,
  sql,
  mysql,
  sparql,
  python,
  java,
  go,
  yaml,
  shell,
  xml
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
