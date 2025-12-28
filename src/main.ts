const keyboardShortcuts = new Map<string[], () => void>([
    [["Meta", "Enter"], () => {
        const sectionA4 = document.querySelector("section[a4]:last-child") as HTMLElement;
        // Implement the action for Control + Enter => new a4 page
        const newSection = sectionA4.cloneNode(true) as HTMLElement;
        sectionA4.parentNode?.appendChild(newSection);
        newSection.scrollIntoView({ behavior: "smooth" });
        const textArea = newSection.querySelector("textarea") as HTMLTextAreaElement;
        if (textArea) {
            textArea.addEventListener("keydown", textAreaKeyListener);
            textArea.value = "";
            textArea.focus();
        }
    }]
]);

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

    textArea.addEventListener("keydown", textAreaKeyListener);
});

const textAreaKeyListener = (event: KeyboardEvent) => {
    keyboardShortcuts.forEach((action, keys) => {
        if (keys.every(key => event.getModifierState(key) || event.key === key)) {
            event.preventDefault();
            action();
        }
    });

    const textArea = event.target as HTMLTextAreaElement;
    if (textArea) {
        // if empty textarea and user presses Backspace, remove the a4 section if more than one exists
        if (event.key === "Backspace" && textArea.value === "") {
            const sectionA4 = textArea.closest("section[a4]") as HTMLElement;
            const allSections = document.querySelectorAll("section[a4]");
            if (allSections.length > 1 && sectionA4) {
                sectionA4.remove();
                const lastSection = document.querySelector("section[a4]:last-child") as HTMLElement;
                const lastTextArea = lastSection.querySelector("textarea") as HTMLTextAreaElement;
                if (lastTextArea) {
                    lastTextArea.focus();
                }
            }
        }

        // if cursor is at the start and user presses arrow up or left, move focus to previous textarea
        if ((event.key === "ArrowUp" || event.key === "ArrowLeft") && textArea.selectionStart === 0) {
            const sectionA4 = textArea.parentElement?.previousElementSibling?.querySelector("textarea") as HTMLElement;
            
            if (sectionA4) {
                sectionA4.focus();
            }
        }

        // if cursor is at the end and user presses arrow down or right, move focus to next textarea
        if ((event.key === "ArrowDown" || event.key === "ArrowRight") && textArea.selectionStart === textArea.value.length) {
            const sectionA4 = textArea.parentElement?.nextElementSibling?.querySelector("textarea") as HTMLElement;
            if (sectionA4) {
                sectionA4.focus();
            }
        }
    }
};
