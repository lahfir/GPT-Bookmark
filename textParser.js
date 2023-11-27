function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function prepareTextForFormatting(rawText) {
  // Escaping single backticks
  let processedText = rawText.replace(/`/g, "\\`");

  // Replace triple backticks with a placeholder
  processedText = processedText.replace(/```/g, "CODEBLOCK");

  return processedText;
}

function formatText(text) {
  let formattedText = "";
  let inCodeBlock = false;
  let codeBlockLanguage = "";

  const lines = text.split("\n");
  lines.forEach((line, index) => {
    if (line.trim().startsWith("```") && inCodeBlock) {
      // End of the code block
      formattedText += `</code></div></div></pre>`;
      inCodeBlock = false;
      codeBlockLanguage = "";
    } else if (line.trim().startsWith("```") && !inCodeBlock) {
      // Start of the code block
      codeBlockLanguage = line.trim().substring(3).trim(); // get the language type
      formattedText += `<pre class="md:max-w-none max-w-lg"><div class="rounded-md"><div style="background: rgba(52, 53, 65, 1)" class="flex items-center relative text-gray-200 px-4 py-2 text-xs font-sans justify-between rounded-t-md dark:bg-gray-900"><span>${codeBlockLanguage}</span><button class="hljs-copy copy-code-button flex ml-auto gizmo:ml-0 gap-2 items-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" stroke-width="2"></path><path d="M9 6C9 4.34315 10.3431 3 12 3V3C13.6569 3 15 4.34315 15 6V6C15 6.55228 14.5523 7 14 7H10C9.44772 7 9 6.55228 9 6V6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path></svg>Copy code</button></div><div class="overflow-y-auto"><code class="!whitespace-pre text-white language-${codeBlockLanguage}">`;
      inCodeBlock = true;
    } else {
      if (inCodeBlock) {
        // Preserve the text as is within a code block
        formattedText += line + "\n";
      } else {
        let escapedLine = escapeHTML(line);

        if (escapedLine.trim() === "<hr>") {
          formattedText += `<hr>`;
        }
        // Check for bullet points, ensuring it's not an HR tag
        else if (escapedLine.trim().startsWith("---")) {
          escapedLine = `<hr>${escapedLine.trim().substring(2)}</hr>`;
        }

        // Check for headings
        if (escapedLine.trim().startsWith("###")) {
          escapedLine = `<h3 class="font-semibold text-lg">${escapedLine
            .trim()
            .substring(4)}</h3>`;
        }

        // Check for bullet points
        if (escapedLine.trim().startsWith("-")) {
          escapedLine = `<li>${escapedLine.trim().substring(2)}</li>`;
        }

        escapedLine = escapedLine.replace(
          /\*\*(.*?)\*\*/g,
          "<strong>$1</strong>"
        );
        escapedLine = escapedLine.replace(/\*(.*?)\*/g, "<em>$1</em>");
        escapedLine = escapedLine.replace(
          /`([^`]+)`/g,
          "<code><strong>`$1`</strong></code>"
        );
        formattedText += escapedLine + "<br>";
      }
    }
  });

  if (inCodeBlock) {
    // Close any remaining open code block
    formattedText += `</code></div></div></pre>`;
  }

  return formattedText;
}

function displayFormattedText(text, chatId) {
  const formattedTextContainer = document.createElement("div");
  const parentContainer = document.createElement("div");
  parentContainer.className =
    "flex p-5 flex-1 gap-4 text-base group border-b-2 border-gray-500 dark:border-gray-800";
  formattedTextContainer.className =
    "formatted-text-container min-w-sm max-w-2xl break-words";
  const formattedText = formatText(text);
  const logoContainer = document.createElement("div");
  logoContainer.innerHTML = `
  <div class="flex-shrink-0 flex flex-col relative items-end"><div><div class="pt-0.5">
    <div class="gizmo-shadow-stroke flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
      <div class="relative p-1 rounded-sm h-9 w-9 text-white flex items-center justify-center" style="background-color: rgb(171, 104, 255); width: 24px; height: 24px;">
        <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm" role="img"><text x="-9999" y="-9999">ChatGPT</text><path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="currentColor"></path></svg>
        </div>
        </div>
        </div>
        </div>
        </div>
  `;
  parentContainer.appendChild(logoContainer);
  const nameContainer = document.createElement("div");
  nameContainer.className =
    "font-semibold w-full flex justify-between items-center mb-2";
  nameContainer.innerHTML =
    "ChatGPT" +
    `<div class="flex items-center gap-1.5 text-xs">
      <button data-id="${chatId}" class="scroll-to-chat-button flex gap-2 items-center font-semibold">
        View on ChatGPT
      </button>
    </div>`;

  formattedTextContainer.appendChild(nameContainer);
  formattedTextContainer.innerHTML += formattedText;

  // Add child element
  const childElement = document.createElement("div");
  childElement.innerHTML = `<div class="flex justify-between flex justify-between">
        <div class="text-gray-400 flex self-end lg:self-center justify-center lg:justify-start mt-2 mt-0 visible gap-1">
          <button class="hover:text-black dark:hover:text-white flex ml-auto ml-0 gap-2 items-center rounded-md p-1 text-xs gap-1.5 dark:text-gray-400 disabled:dark:hover:text-gray-400 hover:text-gray-950">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" stroke-width="2"></path>
              <path d="M9 6C9 4.34315 10.3431 3 12 3V3C13.6569 3 15 4.34315 15 6V6C15 6.55228 14.5523 7 14 7H10C9.44772 7 9 6.55228 9 6V6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path>
            </svg>
          </button>
        </div>
        <button class="remove-bookmark-button hover:text-black dark:hover:text-white rounded-md disabled:dark:hover:text-gray-400 dark:hover:text-gray-200 dark:text-gray-400 text-gray-400 hover:text-gray-950" id="bookmark-button">
          <div class="flex items-center gap-1.5 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4261 17.2864L6.03397 20.2404C5.60345 20.4642 5.07306 20.3058 4.83572 19.8826C4.76705 19.7515 4.73 19.6062 4.72754 19.4583V6.36894C4.72754 3.87257 6.43339 2.87402 8.88816 2.87402H14.6548C17.0347 2.87402 18.8154 3.806 18.8154 6.20252V19.4583C18.8154 19.6944 18.7216 19.9209 18.5546 20.0878C18.3876 20.2548 18.1612 20.3486 17.925 20.3486C17.7744 20.3462 17.6263 20.3092 17.4923 20.2404L12.0669 17.2864C11.8669 17.1784 11.6261 17.1784 11.4261 17.2864Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 18.3291L22.0001 5.60152" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </button>
      </div>`;
  formattedTextContainer.appendChild(childElement);
  formattedTextContainer.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightElement(block);
  });
  parentContainer.appendChild(formattedTextContainer);
  return parentContainer;
}

const text = `To enable text wrapping in a \`<code>\` element, especially when displayed inside a \`<pre>\` tag, you can use CSS. Normally, text inside \`<pre>\` elements is displayed exactly as written, including whitespace, which means it doesn't automatically wrap. However, you can override this behavior with CSS.

Here's how you can modify your CSS to enable text wrapping in \`<code>\` elements within \`<pre>\` tags:

1. **Add CSS for Wrapping:**
   You can use the \`white-space\` property to change how white space inside an element is handled. Setting \`white-space\` to \`pre-wrap\` allows the text to wrap to the next line while still preserving the whitespace formatting that \`<pre>\` is typically used for.

\`\`\`css
{
  white-space: pre-wrap;       /* Since CSS 2.1 */
  white-space: -moz-pre-wrap;  /* For Mozilla, since 1999 */
  white-space: -pre-wrap;      /* For Opera 4-6 */
  white-space: -o-pre-wrap;    /* For Opera 7 */
  word-wrap: break-word;       /* Internet Explorer 5.5+ */
}
\`\`\`

2. **Apply CSS to Your Elements:**
   Make sure this CSS is included in your page's stylesheet or in a \`<style>\` tag in your HTML document's \`<head>\` section.

3. **Check for Conflicting Styles:**
   If the text still doesn't wrap, there might be other CSS rules that are overriding this setting. Use your browser's developer tools to inspect the \`<code>\` element and see if any other styles are being applied that could prevent wrapping.

4. **Viewport Width:**
   Ensure that the container of your \`<pre>\` and \`<code>\` elements is not extending beyond the viewport width due to padding, margin, or other elements forcing it wider. This can sometimes create horizontal scrolling rather than wrapping text.

5. **Font and Size Adjustments:**
   Sometimes, adjusting the font size or the font family can also affect how text wraps in these elements. 

By applying these styles, your code block should wrap text to the next line when it reaches the edge of its containing element.`;

// displayFormattedText(text);
