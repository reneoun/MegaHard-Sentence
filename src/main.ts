import { KeyboardService } from './services/keyboard-service.js';
import { PageService } from './services/page-service.js';

class TextEditor {
    private keyboardService: KeyboardService;

    constructor() {
        this.keyboardService = new KeyboardService();
        this.setupApplication();
    }

    private setupApplication(): void {
        document.addEventListener("DOMContentLoaded", () => {
            this.initializeEditor();
        });
    }

    private initializeEditor(): void {
        const editor = document.querySelector("div#editor") as HTMLDivElement;
        const section = document.querySelector("section[a4]") as HTMLElement;

        if (!editor || !section) {
            console.error("Required editor elements not found");
            return;
        }

        // Setup click focus for the section
        PageService.setupClickFocus(section, editor);

        // Setup keyboard handling
        const keydownHandler = (event: KeyboardEvent) => {
            this.keyboardService.handleKeyDown(event);
        };

        // Set the handler for PageService to use when creating new pages
        PageService.setKeydownHandler(keydownHandler);

        // Add keyboard listener to initial editor
        editor.addEventListener("keydown", keydownHandler);
    }

    // Public API for extending functionality
    addKeyboardShortcut(keys: string[], action: () => void): void {
        this.keyboardService.addShortcut(keys, action);
    }

    removeKeyboardShortcut(keys: string[]): void {
        this.keyboardService.removeShortcut(keys);
    }

    getRegisteredShortcuts(): string[] {
        return this.keyboardService.getRegisteredShortcuts();
    }

    createNewPage(): void {
        PageService.createNewPage();
    }

    getAllPages(): HTMLElement[] {
        return PageService.getAllPages();
    }

    getAllEditors(): HTMLDivElement[] {
        return PageService.getAllEditors();
    }
}

// Initialize the application
const textEditor = new TextEditor();

// Export for potential external use
export { textEditor };