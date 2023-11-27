function getModalHtml() {
  return `
  <div class="absolute inset-0 flex items-center justify-center w-full max-w-full">
  <div
    data-state="open"
    class="fixed inset-0 bg-black/50 dark:bg-gray-600/70 w-full h-full z-50"
    style="pointer-events: auto"
  >
    <div
      class="grid-cols-[10px_1fr_10px] grid h-full w-full grid-rows-[minmax(10px,_1fr)_auto_minmax(10px,_1fr)] md:grid-rows-[minmax(20px,_1fr)_auto_minmax(20px,_1fr)] overflow-y-auto"
    >
      <div
        role="dialog"
        id="radix-:r3u:"
        aria-describedby="radix-:r40:"
        aria-labelledby="radix-:r3v:"
        data-state="open"
        class="relative col-auto col-start-2 row-auto row-start-2 w-full rounded-xl text-left shadow-xl transition-all left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 md:max-w-xl"
        tabindex="-1"
        style="pointer-events: auto"
      >
        <div
          class="px-4 pb-4 pt-5 sm:p-6 flex items-center justify-between border-b border-black/10 dark:border-white/10"
        >
          <div class="flex">
            <div class="flex items-center">
              <div class="flex grow flex-col gap-1">
                <h2
                  id="radix-:r3v:"
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200"
                >
                  Bookmarks
                </h2>
              </div>
            </div>
          </div>
          <button
            class="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              stroke="currentColor"
              fill="none"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              height="20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="">
          <div
            dir="ltr"
            data-orientation="vertical"
            class="flex flex-col gap-6 md:flex-row"
          >
            <div
              role="tablist"
              aria-orientation="vertical"
              class="m-2 md:m-0 md:px-4 md:pl-6 md:pt-4 flex flex-shrink-0 md:-ml-[8px] md:min-w-[180px] max-w-[200px] flex-col gap-2"
              tabindex="0"
              data-orientation="vertical"
              style="outline: none"
            >
              <button
                type="button"
                role="tab"
                aria-selected="false"
                aria-controls="radix-:r41:-content-BuilderProfile"
                data-state="inactive"
                id="radix-:r41:-trigger-BuilderProfile"
                class="group flex items-center justify-start gap-2 rounded-md px-2 py-1.5 text-sm text-token-text-primary radix-state-active:bg-white dark:radix-state-active:bg-token-surface-tertiary md:radix-state-active:bg-token-surface-tertiary md:radix-state-active:text-token-text-primary"
                tabindex="-1"
                data-orientation="vertical"
                data-radix-collection-item=""
              >
                <div class="truncate">Builder profile</div>
              </button>
            </div>
            <div
              data-state="active"
              data-orientation="vertical"
              role="tabpanel"
              aria-labelledby="radix-:r41:-trigger-General"
              id="radix-:r41:-content-General"
              tabindex="0"
              class="max-h-[calc(100vh-150px)] w-full overflow-y-auto p-4 sm:pr-6 md:min-h-[375px] md:pb-0 md:pl-0"
              style="animation-duration: 0s"
            >
              <div
                class="flex flex-col gap-3 text-sm text-token-text-primary"
              >
                <div>Hello</div>
              </div>
            </div>
            <div
              data-state="inactive"
              data-orientation="vertical"
              role="tabpanel"
              aria-labelledby="radix-:r41:-trigger-BetaFeatures"
              hidden=""
              id="radix-:r41:-content-BetaFeatures"
              tabindex="0"
              class="max-h-[calc(100vh-150px)] w-full overflow-y-auto p-4 sm:pr-6 md:min-h-[375px] md:pb-0 md:pl-0"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}

function openBookmarkModal() {
  const modalHtml = getModalHtml();
  const modalContainer = document.querySelector(
    "#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden > div.relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden > main > div.flex.h-full.flex-col"
  );
  modalContainer.innerHTML += modalHtml;
}

document.body.addEventListener("click", function (e) {
  let target = e.target;
  while (target != null) {
    if (String(target.className).includes("top-bookmark-icon")) {
      // openBookmarkModal();
      chrome.runtime.sendMessage({ action: "openPopup" });
    }
    target = target.parentElement;
  }
});

function generateUUID() {
  var d = new Date().getTime();
  var d2 = (performance && performance.now && performance.now() * 1000) || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function mainButtonContainer(parentElement) {
  const bookmarkButton = document.createElement("button");
  bookmarkButton.className =
    "btn relative btn-neutral btn-small flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-lg border border-token-border-medium focus:ring-0 top-bookmark-icon";

  const innerDiv = document.createElement("div");
  innerDiv.className = "flex w-full gap-2 items-center justify-center";

  innerDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="bookmark">
            <g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" transform="translate(3.5 2)">
                <path d="M8.16475977,16.631579 L2.23340962,19.881007 C1.75983818,20.1271252 1.17640846,19.9529066 0.915331812,19.4874143 L0.915331812,19.4874143 C0.839799009,19.3432192 0.79904873,19.1833528 0.796338677,19.0205951 L0.796338677,4.62242565 C0.796338677,1.87643022 2.67276889,0.778032041 5.37299774,0.778032041 L11.7162472,0.778032041 C14.3340962,0.778032041 16.2929063,1.80320367 16.2929063,4.43935929 L16.2929063,19.0205951 C16.2929063,19.2803494 16.1897192,19.5294649 16.0060452,19.713139 C15.8223711,19.8968131 15.5732556,20.0000001 15.3135012,20.0000001 C15.1478164,19.9973723 14.9849578,19.9566576 14.8375287,19.881007 L8.86956526,16.631579 C8.64965001,16.5127732 8.38467502,16.5127732 8.16475977,16.631579 Z"></path>
                <line x1="4.87" x2="12.165" y1="7.323" y2="7.323"></line>
            </g>
        </svg>
    `;

  bookmarkButton.appendChild(innerDiv);
  parentElement.appendChild(bookmarkButton);
  mainButtonObserver.disconnect();
}

function isBookmarked(conversationId) {
  chrome.storage.local.get("bookmarks", function (result) {
    const bookmarks = result.bookmarks;
    if (bookmarks) {
      fetchUserId(function (userId) {
        const chatId = getChatId();
        if (bookmarks[userId] && bookmarks[userId].bookmarks[chatId]) {
          const bookmarksForChat = bookmarks[userId].bookmarks[chatId];
          const isBookmarked = bookmarksForChat.some(
            (bookmark) => bookmark.id === conversationId
          );
          return isBookmarked;
        }
      });
    }
  });
}

function createBookmarkButton(referenceNode) {
  const bookmarkButton = document.createElement("button");
  bookmarkButton.className =
    "gizmo:pl-0 rounded-md disabled:dark:hover:text-gray-400 dark:hover:text-gray-200 dark:text-gray-400 text-gray-400 hover:text-gray-950 md:invisible md:group-hover:visible md:group-[.final-completion]:visible";
  bookmarkButton.id = "bookmark-button";
  const innerDiv = document.createElement("div");
  innerDiv.className = "flex items-center gap-1.5 text-xs";

  bookmarkButton.appendChild(innerDiv);

  const ancestorWithTestId = referenceNode.closest("div[data-testid]");

  const testId = ancestorWithTestId
    ? ancestorWithTestId.getAttribute("data-testid")
    : null;
  var bookmarked = isBookmarked(testId);

  const bookmarkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
    <g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" transform="translate(3.5 2)">
        <path d="M8.16475977,16.631579 L2.23340962,19.881007 C1.75983818,20.1271252 1.17640846,19.9529066 0.915331812,19.4874143 L0.915331812,19.4874143 C0.839799009,19.3432192 0.79904873,19.1833528 0.796338677,19.0205951 L0.796338677,4.62242565 C0.796338677,1.87643022 2.67276889,0.778032041 5.37299774,0.778032041 L11.7162472,0.778032041 C14.3340962,0.778032041 16.2929063,1.80320367 16.2929063,4.43935929 L16.2929063,19.0205951 C16.2929063,19.2803494 16.1897192,19.5294649 16.0060452,19.713139 C15.8223711,19.8968131 15.5732556,20.0000001 15.3135012,20.0000001 C15.1478164,19.9973723 14.9849578,19.9566576 14.8375287,19.881007 L8.86956526,16.631579 C8.64965001,16.5127732 8.38467502,16.5127732 8.16475977,16.631579 Z"></path>
        <line x1="4.87" x2="12.165" y1="7.323" y2="7.323"></line>
    </g>
  </svg>`;

  const UnBookmarkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4261 17.2864L6.03397 20.2404C5.60345 20.4642 5.07306 20.3058 4.83572 19.8826C4.76705 19.7515 4.73 19.6062 4.72754 19.4583V6.36894C4.72754 3.87257 6.43339 2.87402 8.88816 2.87402H14.6548C17.0347 2.87402 18.8154 3.806 18.8154 6.20252V19.4583C18.8154 19.6944 18.7216 19.9209 18.5546 20.0878C18.3876 20.2548 18.1612 20.3486 17.925 20.3486C17.7744 20.3462 17.6263 20.3092 17.4923 20.2404L12.0669 17.2864C11.8669 17.1784 11.6261 17.1784 11.4261 17.2864Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2 18.3291L22.0001 5.60152" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  innerDiv.innerHTML = bookmarkIcon;

  bookmarkButton.addEventListener("click", function () {
    if (referenceNode.querySelector('img[alt="Generated by DALL·E"]')) {
      alert("Sorry, bookmarking images is coming soon!");
      return;
    }

    const newContent = bookmarked
      ? `<div class="flex">
          <span class="text-xs text-current transition-all duration-100">Removing bookmark</span>
        </div>`
      : `<div class="flex">
          <span class="text-xs text-current transition-all duration-100">Bookmarking</span>
          <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>
         </div>`;

    innerDiv.innerHTML = newContent;

    const copyButton = this.parentElement.querySelector("button:first-child");
    if (copyButton) {
      copyButton.click();
    }

    async function tryReadClipboard(attempt = 1) {
      navigator.clipboard
        .readText()
        .then((clipboardText) => {
          storeBookmark(clipboardText, testId, bookmarked);
        })
        .catch((err) => {
          if (attempt < 3) {
            console.error(`Attempt ${attempt} failed, retrying...`, err);
            setTimeout(() => tryReadClipboard(attempt + 1), 1000);
          } else {
            console.error(
              "Error reading clipboard contents after 3 attempts:",
              err
            );
          }
        });
    }

    setTimeout(async () => {
      await tryReadClipboard().then(() => {
        bookmarked = !bookmarked;
        innerDiv.innerHTML = bookmarked ? UnBookmarkIcon : bookmarkIcon;
      });
    }, 3000);
  });

  return bookmarkButton;
}

function addBookmarkButton(div) {
  if (div.querySelector('img[alt="Generated by DALL·E"]')) {
    return;
  }

  const specificChild = div.querySelector(
    "div > div > div.relative.flex.w-\\[calc\\(100\\%-50px\\)\\].flex-col.gizmo\\:w-full.lg\\:w-\\[calc\\(100\\%-115px\\)\\].agent-turn > div.flex-col.gap-1.md\\:gap-3 > div.flex.justify-between.empty\\:hidden.gizmo\\:justify-start.gizmo\\:gap-3.lg\\:block.gizmo\\:lg\\:flex"
  );
  if (specificChild && !specificChild.querySelector(".bookmark-icon")) {
    specificChild.classList.remove("gizmo:justify-start");
    specificChild.classList.add("gizmo:justify-between");

    const bookmarkButton = createBookmarkButton(div);
    specificChild.appendChild(bookmarkButton);
  }
}

function handleBookmarkButtonMutation(mutations) {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      mutation.addedNodes.forEach((node) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.matches('div[data-testid*="conversation-turn"]')
        ) {
          addBookmarkButton(node);
        }
      });
    }
  });
}

function handleMainButtonMutation() {
  const stickyTop = document.querySelector(
    "#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden > div.relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden > main > div.flex.h-full.flex-col > div.flex-1.overflow-hidden > div > div > div > div.sticky.top-0.flex.items-center.justify-between.z-10.h-14.bg-white\\/95.p-2.font-semibold.dark\\:bg-gray-800\\/90 > div.flex.gap-2.pr-1"
  );

  if (stickyTop) {
    mainButtonContainer(stickyTop);
  }
}

// let mainButtonObserver = new MutationObserver(handleMainButtonMutation);
// mainButtonObserver.observe(document, { childList: true, subtree: true });

const bookmarkButtonObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      mutation.addedNodes.forEach((node) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.matches('div[data-testid*="conversation-turn"]')
        ) {
          addBookmarkButton(node);
        }
      });
    }
  });
});

function addBookmarkButtons() {
  const ancestor = document.querySelector(
    "#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden > div.relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden > main > div.flex.h-full.flex-col > div.flex-1.overflow-hidden > div > div > div"
  );

  if (ancestor) {
    const divs = ancestor.querySelectorAll(
      'div[data-testid*="conversation-turn"]'
    );
    divs.forEach(addBookmarkButton);
    bookmarkButtonObserver.observe(ancestor, {
      childList: true,
      subtree: true,
    });
  }
}

const documentObserver = new MutationObserver(addBookmarkButtons);

documentObserver.observe(document, { childList: true, subtree: true });

function onDocumentReady(callback) {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}

onDocumentReady(function () {
  initializeUserId(function (userId) {});
});

function initializeUserId(callback) {
  chrome.storage.local.get("userId", function (result) {
    let userId = result.userId;
    if (!userId) {
      // Generate a new UUID and store it
      userId = generateUUID();
      chrome.storage.local.set({ userId: userId }, function () {
        if (callback) callback(userId);
      });
    } else {
      if (callback) callback(userId);
    }
  });
}

function getActiveChatName() {
  const chatItems = document.querySelectorAll("li[data-projection-id]");

  for (let item of chatItems) {
    // Check if the button with 'aria-haspopup' exists in the current chat item
    const buttonWithAriaPopup = item.querySelector(
      'button[aria-haspopup="menu"]'
    );
    if (buttonWithAriaPopup) {
      const chatNameElement = item.querySelector("div > a > div");
      if (chatNameElement) {
        return chatNameElement.textContent.trim();
      }
    }
  }

  return null;
}

function getChatId() {
  const url = new URL(window.location.href).href;
  const pathSegments = url.split("/");
  return pathSegments[pathSegments.length - 1];
}

function getSystemTheme() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  } else {
    return "light";
  }
}

function getCurrentTheme() {
  const theme = localStorage.getItem("theme");
  if (theme != "system") {
    return theme;
  } else {
    return getSystemTheme();
  }
}

function scrollToChat(id) {
  const chatItem = document.querySelector(`div[data-testid="${id}"]`);
  if (chatItem) {
    chatItem.scrollIntoView({
      behavior: "smooth",
    });
    chatItem.parentElement.scrollTop -= 50;
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "getChatId") {
    const chatId = getChatId();
    sendResponse({ chatId: chatId });
  } else if (request.message === "getTheme") {
    return Promise.resolve({ theme: getCurrentTheme() });
  } else if (request.message === "scrollToChat") {
    const id = request.id;
    scrollToChat(id);
  }
});

function fetchUserId(callback) {
  chrome.storage.local.get("userId", function (result) {
    const userId = result.userId;
    if (userId) {
      callback(userId);
    } else {
      console.error("No User ID found");
    }
  });
}

function storeBookmark(clipboardText, conversationId, isBookmarking) {
  fetchUserId(function (userId) {
    const chatId = getChatId();

    if (!userId || !chatId) {
      console.error("User ID or Chat ID is missing");
      return;
    }

    chrome.storage.local.get("bookmarks", function (result) {
      const bookmarks = result.bookmarks || {};
      bookmarks[userId] = bookmarks[userId] || {};
      bookmarks[userId].bookmarks = bookmarks[userId].bookmarks || {};
      bookmarks[userId].chatNames = bookmarks[userId].chatNames || {};

      if (!bookmarks[userId].bookmarks[chatId]) {
        bookmarks[userId].bookmarks[chatId] = [];
      }

      const bookmarkIndex = bookmarks[userId].bookmarks[chatId].findIndex(
        (bookmark) => bookmark.id === conversationId
      );

      if (isBookmarking) {
        if (bookmarkIndex === -1) {
          bookmarks[userId].bookmarks[chatId].push({
            id: conversationId,
            content: clipboardText,
            chatName: getActiveChatName(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      } else {
        if (bookmarkIndex !== -1) {
          bookmarks[userId].bookmarks[chatId].splice(bookmarkIndex, 1);
        }
      }

      if (!bookmarks[userId].chatNames[chatId]) {
        bookmarks[userId].chatNames[chatId] = getActiveChatName();
      }

      chrome.storage.local.set({ bookmarks: bookmarks }, function () {
        try {
          chrome.runtime.sendMessage({ type: "bookmarkUpdated" });
        } catch (err) {
          console.error("Error sending message to popup.js", err);
        }
      });
    });
  });
}
