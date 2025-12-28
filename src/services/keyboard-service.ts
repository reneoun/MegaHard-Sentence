import { isCaretAtStart, isCaretAtEnd } from '../utils/cursor.js';
import { PageService } from './page-service.js';

type KeyCombination = string[];
type KeyboardAction = () => void;

export class KeyboardService {
    private shortcuts = new Map<string, KeyboardAction>();

    constructor() {
        this.setupDefaultShortcuts();
    }

    private setupDefaultShortcuts(): void {
        this.addShortcut(['Meta', 'Enter'], () => {
            PageService.createNewPage();
        });
    }

    addShortcut(keys: KeyCombination, action: KeyboardAction): void {
        const keyString = keys.sort().join('+');
        this.shortcuts.set(keyString, action);
    }

    removeShortcut(keys: KeyCombination): void {
        const keyString = keys.sort().join('+');
        this.shortcuts.delete(keyString);
    }

    handleKeyDown(event: KeyboardEvent): void {
        // Check for shortcuts first
        const pressedKeys: string[] = [];
        
        if (event.metaKey) pressedKeys.push('Meta');
        if (event.ctrlKey) pressedKeys.push('Ctrl');
        if (event.altKey) pressedKeys.push('Alt');
        if (event.shiftKey) pressedKeys.push('Shift');
        
        if (event.key && !['Meta', 'Control', 'Alt', 'Shift'].includes(event.key)) {
            pressedKeys.push(event.key);
        }

        const keyString = pressedKeys.sort().join('+');
        const shortcutAction = this.shortcuts.get(keyString);

        if (shortcutAction) {
            event.preventDefault();
            shortcutAction();
            return;
        }

        // Handle editor navigation
        this.handleEditorNavigation(event);
    }

    private handleEditorNavigation(event: KeyboardEvent): void {
        const editor = event.target as HTMLDivElement;
        if (!editor || !editor.contentEditable) return;

        // Handle page deletion
        if (event.key === "Backspace" && PageService.isEmpty(editor)) {
            PageService.deletePage(editor);
            return;
        }

        // Handle navigation between pages
        if ((event.key === "ArrowUp" || event.key === "ArrowLeft") && isCaretAtStart(editor)) {
            if (PageService.navigateToPreviousPage(editor)) {
                event.preventDefault();
            }
            return;
        }

        if ((event.key === "ArrowDown" || event.key === "ArrowRight") && isCaretAtEnd(editor)) {
            if (PageService.navigateToNextPage(editor)) {
                event.preventDefault();
            }
            return;
        }
    }

    getRegisteredShortcuts(): string[] {
        return Array.from(this.shortcuts.keys());
    }
}