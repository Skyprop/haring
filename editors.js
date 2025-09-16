export function initEditors() {
    const htmlEditor = CodeMirror.fromTextArea(document.getElementById('html-code'), {
        mode: 'htmlmixed',
        theme: 'dracula',
        lineNumbers: true,
        smartIndent: true,
        indentUnit: 4,
        autoCloseTags: true,
        autoCloseBrackets: true,
        lint: true,
        extraKeys: {
            "Tab": cm => cm.replaceSelection("    ", "end")
        }
    });

    htmlEditor.on("inputRead", function(cm, change) {
        if (change.text[0].match(/[\w<]/)) cm.showHint({ completeSingle: false });
    });

    const cssEditor = CodeMirror.fromTextArea(document.getElementById('css-code'), {
        mode: 'css',
        theme: 'dracula',
        lineNumbers: true,
        smartIndent: true,
        indentUnit: 4,
        lint: true,
        autoCloseBrackets: true,
        extraKeys: {
            "Tab": cm => cm.replaceSelection("    ", "end")
        }
    });

    cssEditor.on("inputRead", function(cm, change) {
        if (change.text[0].match(/[\w-]/)) cm.showHint({ completeSingle: false });
    });

    const jsEditor = CodeMirror.fromTextArea(document.getElementById('js-code'), {
        mode: 'javascript',
        theme: 'dracula',
        lineNumbers: true,
        smartIndent: true,
        indentUnit: 4,
        lint: true,
        autoCloseBrackets: true,
        extraKeys: {
            "Tab": cm => cm.replaceSelection("    ", "end")
        }
    });

    jsEditor.on("inputRead", function(cm, change) {
        if (change.text[0].match(/[\w\.]/)) cm.showHint({ completeSingle: false });
    });

    return { htmlEditor, cssEditor, jsEditor };
}
