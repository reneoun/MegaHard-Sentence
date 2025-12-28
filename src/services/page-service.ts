import { focusAtEnd, focusAtStart } from '../utils/cursor.js';

export class PageService {
    private static keydownHandler: (event: KeyboardEvent) => void;

    static createNewPage(): void {
        const lastSection = document.querySelector("section[a4]:last-child") as HTMLElement;
        if (!lastSection) return;

        const newSection = lastSection.cloneNode(true) as HTMLElement;
        lastSection.parentNode?.appendChild(newSection);
        newSection.scrollIntoView({ behavior: "smooth" });
        
        const editor = newSection.querySelector("div#editor") as HTMLDivElement;
        if (editor) {
            editor.id = `editor-${Date.now()}`;
            editor.textContent = "";
            
            if (this.keydownHandler) {
                editor.addEventListener("keydown", this.keydownHandler);
            }
            
            editor.focus();
        }
    }

    static deletePage(editorElement: HTMLDivElement): boolean {
        const sectionA4 = editorElement.closest("section[a4]") as HTMLElement;
        const allSections = document.querySelectorAll("section[a4]");
        
        if (allSections.length <= 1 || !sectionA4) return false;

        sectionA4.remove();
        const lastSection = document.querySelector("section[a4]:last-child") as HTMLElement;
        const lastEditor = lastSection.querySelector("div[contenteditable]") as HTMLElement;
        
        if (lastEditor) {
            lastEditor.focus();
        }
        
        return true;
    }

    static navigateToPreviousPage(currentEditor: HTMLDivElement): boolean {
        const previousSection = currentEditor.parentElement?.previousElementSibling;
        const previousEditor = previousSection?.querySelector("div[contenteditable]") as HTMLElement;
        
        if (previousEditor) {
            focusAtEnd(previousEditor);
            return true;
        }
        
        return false;
    }

    static navigateToNextPage(currentEditor: HTMLDivElement): boolean {
        const nextSection = currentEditor.parentElement?.nextElementSibling;
        const nextEditor = nextSection?.querySelector("div[contenteditable]") as HTMLElement;
        
        if (nextEditor) {
            focusAtStart(nextEditor);
            return true;
        }
        
        return false;
    }

    static isEmpty(editor: HTMLDivElement): boolean {
        return !editor.textContent?.trim();
    }

    static getAllPages(): HTMLElement[] {
        return Array.from(document.querySelectorAll("section[a4]"));
    }

    static getAllEditors(): HTMLDivElement[] {
        return Array.from(document.querySelectorAll("div[contenteditable]"));
    }

    static setKeydownHandler(handler: (event: KeyboardEvent) => void): void {
        this.keydownHandler = handler;
    }

    static setupClickFocus(section: HTMLElement, editor: HTMLDivElement): void {
        const onClick = () => {
            if (editor) editor.focus();
        };
        
        section.addEventListener("click", onClick);
        section.addEventListener("touchstart", onClick);
    }
}