const snippets = {
    button: {
        html: `<button class="{name}">Click Me</button>`,
        css: `.{name} {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
        }`,
        js: `document.querySelector('.{name}').addEventListener('click', () => alert('Button clicked!'));`
    },
    div: {
        html: `<div class="{name}"><p>New Snippet Div</p></div>`,
        css: `.{name} {
            border: 1px solid #ccc;
            padding: 16px;
            background-color: #f0f0f0;
        }`,
        js: '' // explicitly set empty string for consistency
    }
};

export function initSnippets() {
    return snippets;
}
