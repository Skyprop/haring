
        // init modules 

        import { initSnippets } from "./snippets";
        import { initEditors } from "./editors";
        // declare variables in outer scope
        let htmlEditor, cssEditor, jsEditor;
        let snippets;

        document.addEventListener('DOMContentLoaded', () => {
            snippets = initSnippets();
            ({ htmlEditor, cssEditor, jsEditor } = initEditors());

            // Now you can safely call functions that use these editors
            updatePreview();

            // Add any editor-specific initializations here
        });

        // Function to update the live preview
        function updatePreview() {
            const htmlCode = htmlEditor.getValue();
            const cssCode = cssEditor.getValue();
            const jsCode = jsEditor.getValue();

            const fullDocument = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <style>
                        ${cssCode}
                        html, body {height: 100%;}
                        </style>
                </head>
                <body>
                    ${htmlCode}
                    <script>
                        try {
                            ${jsCode}
                        } catch (e) {
                            console.error(e);
                        }
                    <\/script>
                </body>
                </html>
            `;

            const iframe = document.getElementById('preview');
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(fullDocument);
            iframeDoc.close();
        }

        // Listen for changes in the editors
        htmlEditor.on('change', updatePreview);
        cssEditor.on('change', updatePreview);
        jsEditor.on('change', updatePreview);

        // Insert predefined snippets into the respective editors
        function insertSnippet(type) {
            let snippet;
            if (type === 'html') {
                snippet = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>My Web Page</title></head><body><h1>Welcome to my website</h1></body></html>`;
                htmlEditor.setValue(snippet);
            } else if (type === 'css') {
                snippet = `body { display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f0f0; } h1 { color: #333; }`;
                cssEditor.setValue(snippet);
            } else if (type === 'js') {
                snippet = `function showAlert() { alert('Hello, world!'); } showAlert();`;
                jsEditor.setValue(snippet);
            }
            updatePreview();
        }

        const resizer = document.getElementById('resizer');
        const editorContainer = document.getElementById('editor-container');
        const previewContainer = document.getElementById('preview-container');

        let isResizing = false;

        // Create overlay once
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.cursor = 'col-resize';
        overlay.style.zIndex = '9999'; // on top of iframe
        overlay.style.backgroundColor = 'rgba(0,0,0,0)'; // fully transparent

        function startResizing(e) {
            e.preventDefault();
            isResizing = true;

            document.body.appendChild(overlay); // add overlay

            overlay.addEventListener('mousemove', handleMouseMove);
            overlay.addEventListener('mouseup', stopResizing);
        }

        function handleMouseMove(e) {
            if (!isResizing) return;
            const editorWidth = e.clientX;
            const totalWidth = window.innerWidth;
            const editorWidthPercentage = (editorWidth / totalWidth) * 100;

            editorContainer.style.width = `${editorWidthPercentage}%`;
            previewContainer.style.width = `${100 - editorWidthPercentage}%`;
            resizer.style.left = `${editorWidthPercentage}%`;
        }

        function stopResizing() {
            isResizing = false;

            // remove overlay and listeners
            overlay.removeEventListener('mousemove', handleMouseMove);
            overlay.removeEventListener('mouseup', stopResizing);
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }

        resizer.addEventListener('mousedown', startResizing);

        // Set the initial preview width based on window load
        window.addEventListener('load', function() {
            const initialWidth = 50; // Start with 50% width
            editorContainer.style.width = `${initialWidth}%`;
            previewContainer.style.width = `${100 - initialWidth}%`;
            resizer.style.left = `${initialWidth}%`;

            cssEditor.setValue("body {background-color:rgb(10,10,10); color:white; display:flex;} h1{margin:auto; font-size:4rem}");
            htmlEditor.setValue("<h1>Yoeri's code editor</h1>");
        });

        // Initial preview update
        updatePreview();

        let draggingSnippet = null;

        document.querySelectorAll('.snippet-draggable').forEach(btn => {
            btn.addEventListener('dragstart', (e) => {
                draggingSnippet = snippets[btn.dataset.snippetType];
                e.dataTransfer.setData("application/json", JSON.stringify(draggingSnippet));
            });


            btn.addEventListener('dragend', () => {
                draggingSnippet = null;
                if (highlightedTagMarker) {
                    highlightedTagMarker.clear();
                    highlightedTagMarker = null;
                }
            });
        });

        let highlightedTagMarker = null;

        htmlEditor.getWrapperElement().addEventListener('dragover', function(e) {
            const droppedData = e.dataTransfer.getData("text/plain");
            if (!droppedData) return;
            // ...
            doc.replaceRange(`    ${droppedData}\n`, insertPos);


            e.preventDefault();
            const pos = htmlEditor.coordsChar({ left: e.clientX, top: e.clientY });

            const token = htmlEditor.getTokenAt(pos);
            const doc = htmlEditor.getDoc();

            // Try to find the enclosing tag
            const line = doc.getLine(pos.line);

            const tagMatch = line.slice(0, token.end).match(/<(\w+)[^>]*?>/);
            if (tagMatch) {
                const tagName = tagMatch[1];

                // Find start and end tag positions (simple approach)
                const startLine = pos.line;
                let endLine = startLine;
                for (let i = startLine + 1; i < doc.lineCount(); i++) {
                    if (doc.getLine(i).includes(`</${tagName}`)) {
                        endLine = i;
                        break;
                    }
                }

                if (highlightedTagMarker) highlightedTagMarker.clear();
                highlightedTagMarker = htmlEditor.markText(
                    { line: startLine, ch: 0 },
                    { line: endLine + 1, ch: 0 },
                    { className: 'tag-highlight' }
                );
            }
        });

htmlEditor.getWrapperElement().addEventListener('drop', function(e) {
    e.preventDefault();

    const droppedDataJson = e.dataTransfer.getData("application/json");
    if (!droppedDataJson) return;
    const droppedData = JSON.parse(droppedDataJson);

    // Ask user for class name
    const className = prompt("Enter a class name for this snippet:", "my-class");
    if (!className) return;  // if user cancels, abort

    // Replace {name} placeholder with actual class name
    const updatedHtml = droppedData.html.replace(/{name}/g, className);
    const updatedCss = droppedData.css.replace(/{name}/g, className);

    const pos = htmlEditor.coordsChar({ left: e.clientX, top: e.clientY });
    const doc = htmlEditor.getDoc();

    // Insert the snippet HTML at the drop position
    doc.replaceRange(`\n${updatedHtml}\n`, pos);

    // Append CSS snippet to cssEditor content
    const currentCss = cssEditor.getValue();
    cssEditor.setValue(currentCss + "\n\n" + updatedCss);

    // Append JS snippet if present
    const updatedJs = droppedData.js ? droppedData.js.replace(/{name}/g, className) : '';
    const currentJs = jsEditor.getValue();
    jsEditor.setValue(currentJs + "\n\n" + updatedJs);

    updatePreview();

    if (highlightedTagMarker) {
        highlightedTagMarker.clear();
        highlightedTagMarker = null;
    }

    draggingSnippet = null;
});
