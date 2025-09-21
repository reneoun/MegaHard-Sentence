import { marked } from "marked";

document.addEventListener("DOMContentLoaded", () => {
    const textArea = document.querySelector("textarea#editor") as HTMLTextAreaElement;
    const preview = document.querySelector("div#preview") as HTMLDivElement;
    const sectionA4 = document.querySelector("section[a4]") as HTMLElement;

    if (sectionA4) {
        const onClick = () => {
            if (textArea) textArea.focus();
        };
        sectionA4.addEventListener("click", onClick);
        sectionA4.addEventListener("touchstart", onClick);
    }

    const updatePreview = () => {
        const markdown = textArea.value;
        const selectionStart = textArea.selectionStart;
        const selectionEnd = textArea.selectionEnd;
        
        let processedMarkdown;
        
        if (selectionStart === selectionEnd) {
            // No selection, just cursor
            const beforeCursor = markdown.slice(0, selectionStart);
            const afterCursor = markdown.slice(selectionStart);
            
            let cursorMarkdown;
            if (selectionStart > 0 && markdown[selectionStart - 1] === '\n') {
                cursorMarkdown = '<span class="cursor"></span>&#8203;';
            } else {
                cursorMarkdown = '&#8203;<span class="cursor"></span>&#8203;';
            }
            
            processedMarkdown = beforeCursor + cursorMarkdown + afterCursor;
        } else {
            // Text is selected
            const beforeSelection = markdown.slice(0, selectionStart);
            const selectedText = markdown.slice(selectionStart, selectionEnd);
            const afterSelection = markdown.slice(selectionEnd);
            
            processedMarkdown = beforeSelection + 
                '<span class="selection">' + selectedText + '</span>' + 
                afterSelection;
        }
        
        // Convert single newlines to line breaks for preview
        processedMarkdown = processedMarkdown.replace(/\n/g, '  \n');
        
        let html = marked(processedMarkdown);
        if (typeof html !== "string") {
            html = String(html);
        }
        if (preview) preview.innerHTML = html;
    };

    textArea.addEventListener("input", updatePreview);
    textArea.addEventListener("selectionchange", updatePreview);
    textArea.addEventListener("keyup", updatePreview);
    textArea.addEventListener("click", updatePreview);
});