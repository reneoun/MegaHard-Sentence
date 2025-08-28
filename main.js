document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section[a4]");
  sections.forEach((section) => {
    section.addEventListener("click", (event) => {
      const closestEditable = event.target.closest("*[contenteditable]");
      if (closestEditable) {
        closestEditable.focus();
        return;
      }

      const sourceElement = event.target.querySelector("*[a4] > div");
      if (sourceElement) {
        const lastChild = sourceElement.lastElementChild;
        if (lastChild) {
          if (lastChild.innerHTML.length > 0) {
            const sel = getSelection();
            sel.removeAllRanges();

            const rng = document.createRange();
            const textNode = lastChild.firstChild;
            rng.setStart(textNode, textNode.data.length);
            rng.setEnd(textNode, textNode.data.length);
            sel.addRange(rng);
          }
          lastChild.focus();
          return;
        }

        sourceElement.focus();
      }
    });
  });

  const editableDivs = document.querySelectorAll("*[contenteditable]");
  console.log("Editable divs:", editableDivs);

  const onInput = (event) => {
    const target = event.target;
    console.log("event:", event);

    if (target.isContentEditable) {
      // Markdown support
      var parsedMD = marked.parse(target.innerHTML);
      var parsedMDElement = document.createElement("div");
      parsedMDElement.innerHTML = parsedMD;
      let childrenInParsedMD = Array.from(parsedMDElement.children);
      console.log("Children in parsed MD:", childrenInParsedMD);
      if (event.inputType == "insertParagraph") {
        // remove second last child
        childrenInParsedMD.splice(childrenInParsedMD.length - 2, 1);
      }
      for (const child of childrenInParsedMD) {
        child.setAttribute("contenteditable", "true");
        child.addEventListener("input", onInput);
      }

      let lastChildInParsedMD =
        childrenInParsedMD[childrenInParsedMD.length - 1];

      if (lastChildInParsedMD.tagName === "BR") {
        childrenInParsedMD.pop();
        lastChildInParsedMD = document.createElement("p");
        lastChildInParsedMD.setAttribute("contenteditable", "true");
        lastChildInParsedMD.addEventListener("input", onInput);
        childrenInParsedMD.push(lastChildInParsedMD);
      }


      if (target.tagName !== "DIV") {
        target.replaceWith(...childrenInParsedMD);
      } else {
        target.replaceWith(parsedMDElement);
      }
      if (lastChildInParsedMD) {
        if (lastChildInParsedMD.innerHTML.length > 0) {
          const sel = getSelection();
          sel.removeAllRanges();

          const rng = document.createRange();
          const textNode = lastChildInParsedMD.firstChild;
          rng.setStart(textNode, textNode.data.length);
          rng.setEnd(textNode, textNode.data.length);
          sel.addRange(rng);
        }

        lastChildInParsedMD.focus();
      }
    }
  };
  editableDivs.forEach((div) => {
    div.addEventListener("input", onInput);
  });
});

document.addEventListener("unload", () => {
  const editableDivs = document.querySelectorAll("div[contenteditable]");
  editableDivs.forEach((div) => {
    div.removeEventListener("input", onInput);
  });
});
