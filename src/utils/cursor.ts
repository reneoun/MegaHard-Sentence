export function getCaretPosition(element: HTMLElement): number {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;
    
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
}

export function setCaretPosition(element: HTMLElement, position: number): void {
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

export function isCaretAtStart(element: HTMLElement): boolean {
    return getCaretPosition(element) === 0;
}

export function isCaretAtEnd(element: HTMLElement): boolean {
    const position = getCaretPosition(element);
    const textLength = element.textContent?.length || 0;
    return position === textLength;
}

export function focusElement(element: HTMLElement): void {
    element.focus();
}

export function focusAtStart(element: HTMLElement): void {
    element.focus();
    setCaretPosition(element, 0);
}

export function focusAtEnd(element: HTMLElement): void {
    element.focus();
    setCaretPosition(element, element.textContent?.length || 0);
}