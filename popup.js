var globalUserId;
var globalChatId;
var theme;

function getUserID(callback) {
  chrome.storage.local.get("userId", function (result) {
    if (result.userId) {
      globalUserId = result.userId;
      callback(result.userId);
    } else {
      console.error("No User ID found");
    }
  });
}

function requestChatId() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: "getChatId" },
      function (response) {
        if (response && response.chatId) {
          populateBookmarks(response.chatId);
          globalChatId = response.chatId;
        }
      }
    );
  });
}

function requestTheme() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: "getTheme" },
      function (response) {
        if (response) {
          theme = response.theme;
        }
      }
    );
  });
}

function removeBookmark(id) {
  if (!globalUserId || !globalChatId) {
    console.error("User ID or Chat ID is missing");
    return;
  }

  chrome.storage.local.get("bookmarks", function (result) {
    const bookmarks = result.bookmarks || {};
    if (bookmarks[globalUserId] && bookmarks[globalUserId]?.bookmarks) {
      bookmarks[globalUserId]?.bookmarks[globalChatId]?.forEach(
        (bookmark, i) => {
          if (bookmark.id === id) {
            bookmarks[globalUserId].bookmarks[globalChatId].splice(i, 1);
          }
        }
      );
    }
    chrome.storage.local.set({ bookmarks: bookmarks }, function () {
      chrome.runtime.sendMessage({ type: "bookmarkUpdated" });
    });
  });
}

function promptRemoveBookmark(id) {
  const confirmation = confirm(
    "Are you sure you want to remove this bookmark?" +
      "\n\nPress OK to confirm." +
      "\nPress Cancel to cancel.",
    "OK",
    "Cancel"
  );
  if (confirmation) {
    removeBookmark(id);
  }
}

function registerEventListeners(div) {
  div.querySelectorAll(".scroll-to-chat-button").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const originalText = this.textContent;
      this.textContent = "Scrolling...";
      this.disabled = true;
      scrollToChat(id);
      setTimeout(() => {
        this.textContent = originalText;
        this.disabled = false;
      }, 1000);
    });
  });

  div.querySelectorAll(".remove-bookmark-button").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const originalContent = this.innerHTML;
      this.innerHTML = `
      <svg
      stroke="currentColor"
      fill="none"
      stroke-width="2"
      viewBox="0 0 24 24"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="animate-spin text-center text-gray-400 dark:text-gray-500"
      width="16"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="12" y1="2" x2="12" y2="6"></line>
      <line x1="12" y1="18" x2="12" y2="22"></line>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
      <line x1="2" y1="12" x2="6" y2="12"></line>
      <line x1="18" y1="12" x2="22" y2="12"></line>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    </svg>
      `;
      promptRemoveBookmark(id);
      setTimeout(() => {
        this.innerHTML = originalContent;
      }, 1000);
    });
  });

  div.querySelectorAll(".copy-code-button").forEach((button) => {
    button.addEventListener("click", function () {
      const originalContent = button.innerHTML;

      button.innerHTML = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>Copied!`;

      setTimeout(() => {
        button.innerHTML = originalContent;
      }, 3000);
    });
  });
}

function populateBookmarks(chatId) {
  getUserID(function (userId) {
    chrome.storage.local.get("bookmarks", function (result) {
      const bookmarks = result.bookmarks || {};
      const bookmarksDiv = document.getElementById("bookmarks");
      bookmarksDiv.innerHTML = "";
      if (
        bookmarks[userId]?.chatNames &&
        bookmarks[userId]?.chatNames[chatId]
      ) {
        const chatName = document.getElementById("chat-name");
        chatName.innerHTML = bookmarks[userId].chatNames[chatId];
      }
      if (
        bookmarks[userId] &&
        bookmarks[userId]?.bookmarks &&
        bookmarks[userId]?.bookmarks[chatId]
      ) {
        bookmarks[userId].bookmarks[chatId].forEach((bookmark) => {
          const div = displayFormattedText(bookmark.content, bookmark.id);
          registerEventListeners(div, bookmark.id);
          bookmarksDiv.appendChild(div);
        });
      } else {
        const messageInput = document.getElementById("message");
        messageInput.innerHTML = "No bookmarks found";
      }
    });
  });
  document.getElementById("loading").style.display = "none";
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "bookmarkUpdated") {
    requestChatId();
  } else if (message.action === "openPopup") {
    chrome.runtime.openOptionsPage();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  requestChatId();
  requestTheme();
});

function applyNavStyles(theme) {
  const nav = document.getElementById("nav");

  if (theme == "dark") {
    nav.style.backgroundColor = "rgba(255,255,255)";
  } else {
    nav.style.backgroundColor = "rgba(52, 53, 65)";
  }
}

window.addEventListener("scroll", function () {
  const nav = document.getElementById("nav");

  if (window.scrollY > 50) {
    nav.style.opacity = "1";
  } else {
    nav.style.opacity = "0";
  }
});

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addEventListener("change", (e) => {
  if (e.matches) {
    applyNavStyles("dark");
  } else {
    applyNavStyles("light");
  }
});

function scrollToChat(id) {
  console.log("Scrolling to chat", id);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: "scrollToChat", id: id },
      function (response) {
        if (response) {
          console.log("Scrolled to chat");
        }
      }
    );
  });
}
