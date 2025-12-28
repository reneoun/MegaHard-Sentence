const keyboardShortcuts = new Map<string[], () => void>([
    [["Meta", "Enter"], () => {
        const sectionA4 = document.querySelector("section[a4]:last-child") as HTMLElement;
        // Implement the action for Control + Enter => new a4 page
        const newSection = sectionA4.cloneNode(true) as HTMLElement;
        sectionA4.parentNode?.appendChild(newSection);
        newSection.scrollIntoView({ behavior: "smooth" });
        const editor = newSection.querySelector("div#editor") as HTMLDivElement;
        if (editor) {
            editor.id = `editor-${Date.now()}`; // Unique ID for each new editor
            editor.addEventListener("keydown", textAreaKeyListener);
            editor.textContent = "";
            editor.focus();
        }
    }]
]);

function getCaretPosition(element: HTMLElement): number {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;
    
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
}

function setCaretPosition(element: HTMLElement, position: number) {
    const range = document.createRange();
    const selection = window.getSelection();
    if (!selection) return;

    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null
    );

    let charCount = 0;
    let node;
    
    while (node = walker.nextNode()) {
        const nodeLength = node.textContent?.length || 0;
        if (charCount + nodeLength >= position) {
            range.setStart(node, position - charCount);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            return;
        }
        charCount += nodeLength;
    }
    
    // If position is beyond text, place at end
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
}

document.addEventListener("DOMContentLoaded", () => {
    const textArea = document.querySelector("div#editor") as HTMLDivElement;
    const sectionA4 = document.querySelector("section[a4]") as HTMLElement;

    if (sectionA4) {
        const onClick = () => {
            if (textArea) textArea.focus();
        };
        sectionA4.addEventListener("click", onClick);
        sectionA4.addEventListener("touchstart", onClick);
    }

    textArea.addEventListener("keydown", textAreaKeyListener);
});

const textAreaKeyListener = (event: KeyboardEvent) => {
    keyboardShortcuts.forEach((action, keys) => {
        if (keys.every(key => event.getModifierState(key) || event.key === key)) {
            event.preventDefault();
            action();
        }
    });

    const textArea = event.target as HTMLDivElement;
    
    if (textArea) {
        // if empty textarea and user presses Backspace, remove the a4 section if more than one exists
        if (event.key === "Backspace" && textArea.textContent === "") {
            const sectionA4 = textArea.closest("section[a4]") as HTMLElement;
            const allSections = document.querySelectorAll("section[a4]");
            if (allSections.length > 1 && sectionA4) {
                sectionA4.remove();
                const lastSection = document.querySelector("section[a4]:last-child") as HTMLElement;
                const lastEditor = lastSection.querySelector("div[contenteditable]") as HTMLElement;
                if (lastEditor) {
                    lastEditor.focus();
                }
            }
        }

        // if cursor is at the start and user presses arrow up or left, move focus to previous editor
        const caretPosition = getCaretPosition(textArea);
        const textLength = textArea.textContent?.length || 0;
        
        if ((event.key === "ArrowUp" || event.key === "ArrowLeft") && caretPosition === 0) {
            const sectionA4 = textArea.parentElement?.previousElementSibling?.querySelector("div[contenteditable]") as HTMLElement;
            
            if (sectionA4) {
                sectionA4.focus();
                // Place cursor at end of previous editor
                setCaretPosition(sectionA4, sectionA4.textContent?.length || 0);
            }
        }

        // if cursor is at the end and user presses arrow down or right, move focus to next editor
        if ((event.key === "ArrowDown" || event.key === "ArrowRight") && caretPosition === textLength) {
            const sectionA4 = textArea.parentElement?.nextElementSibling?.querySelector("div[contenteditable]") as HTMLElement;
            if (sectionA4) {
                sectionA4.focus();
                // Place cursor at start of next editor
                setCaretPosition(sectionA4, 0);
            }
        }
    }
};