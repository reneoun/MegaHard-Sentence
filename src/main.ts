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

    textArea.addEventListener("input", () => {
        const markdown = textArea.value;
        let html = marked(markdown);
        if (typeof html !== "string") {
            html = String(html);
        }
        if (preview) preview.innerHTML = html;
    });
});