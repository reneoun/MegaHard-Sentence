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
        
        // Replace empty line markers with actual breaks, then handle normal newlines
        processedMarkdown = processedMarkdown
            .replace(/^\n/g, '-([EMPTY-LINE])-\n') // Handle empty line at start
            .replace(/\n(?=\n)/g, '\n-([EMPTY-LINE])-') // Mark each empty line
            .replace(/-\(\[EMPTY-LINE\]\)-/g, '&nbsp;') // Replace markers with visible space
            .replace(/\n/g, '  \n'); // Convert remaining newlines to line breaks
        
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
    textArea.addEventListener("paste", () => {
        // Use setTimeout to ensure paste content is processed first
        setTimeout(updatePreview, 0);
    });

    // Handle clicks on preview to move cursor in textarea
    preview.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Get click position in preview
        const range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (!range) return;
        
        // Calculate approximate position in original text
        const clickedNode = range.startContainer;
        const offset = range.startOffset;
        
        // Simple approximation: count text content before click position
        let textPosition = 0;
        const walker = document.createTreeWalker(
            preview,
            NodeFilter.SHOW_TEXT,
            null,
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node === clickedNode) {
                textPosition += offset;
                break;
            }
            textPosition += node.textContent?.length || 0;
        }
        
        // Set cursor position in textarea (approximate)
        textArea.focus();
        textArea.setSelectionRange(textPosition, textPosition);
        updatePreview();
    });
});