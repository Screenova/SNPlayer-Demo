(function () {
  var LOGO_URL = "https://screenova.cloud/logo.png";

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function hideLegacyLogos(topbar) {
    Array.from(document.querySelectorAll('body img[src*="screenova.cloud/logo.png"]')).forEach(function (img) {
      if (!topbar.contains(img)) {
        img.classList.add("screenova-legacy-logo");
      }
    });
  }

  function isHiddenElement(element) {
    return element.hidden || window.getComputedStyle(element).display === "none";
  }

  function getTopLevelHeading() {
    var children = Array.from(document.body.children);
    for (var i = 0; i < children.length; i += 1) {
      var child = children[i];
      if (child.classList.contains("screenova-topbar")) continue;
      if (["SCRIPT", "STYLE", "LINK"].indexOf(child.tagName) !== -1) continue;
      if (isHiddenElement(child)) continue;
      if (/^H[1-3]$/.test(child.tagName)) return child;
      return null;
    }
    return null;
  }

  function moveHeadingsIntoTopbar(copy) {
    var legacyHeader = document.getElementById("header");
    var headings = [];

    if (legacyHeader) {
      headings = Array.from(legacyHeader.querySelectorAll("h1, h2, h3"));
    } else {
      var topLevelHeading = getTopLevelHeading();
      if (topLevelHeading) headings = [topLevelHeading];
    }

    headings.forEach(function (heading) {
      heading.classList.add(heading.tagName === "H1" ? "screenova-topbar__title" : "screenova-topbar__subtitle");
      copy.appendChild(heading);
    });
  }

  function hasMeaningfulContent(node) {
    return Array.from(node.childNodes).some(function (child) {
      if (child.nodeType === Node.TEXT_NODE) return child.textContent.trim().length > 0;
      if (child.nodeType !== Node.ELEMENT_NODE) return false;
      if (["SCRIPT", "STYLE", "LINK"].indexOf(child.tagName) !== -1) return false;
      if (child.classList.contains("screenova-legacy-logo")) return false;
      if (isHiddenElement(child)) return false;
      if (["BUTTON", "CANVAS", "IFRAME", "IMG", "INPUT", "OBJECT", "SELECT", "SVG", "TEXTAREA", "VIDEO"].indexOf(child.tagName) !== -1) return true;
      return child.textContent.trim().length > 0 || Array.from(child.children).some(hasMeaningfulContent);
    });
  }

  function hideEmptyLegacyHeaders() {
    Array.from(document.querySelectorAll("#header")).forEach(function (header) {
      if (!hasMeaningfulContent(header)) {
        header.classList.add("screenova-empty-header");
      }
    });
  }

  onReady(function () {
    if (!document.body) return;

    document.body.classList.add("screenova-doc");

    if (!document.querySelector(".screenova-topbar")) {
      var topbar = document.createElement("header");
      var inner = document.createElement("div");
      var logo = document.createElement("img");
      var copy = document.createElement("div");

      topbar.className = "screenova-topbar";
      inner.className = "screenova-topbar__inner";
      logo.className = "screenova-topbar__logo";
      copy.className = "screenova-topbar__copy";
      logo.src = LOGO_URL;
      logo.alt = "Screenova";

      inner.appendChild(logo);
      inner.appendChild(copy);
      topbar.appendChild(inner);
      document.body.insertBefore(topbar, document.body.firstChild);
      moveHeadingsIntoTopbar(copy);
      hideLegacyLogos(topbar);
      hideEmptyLegacyHeaders();
      return;
    }

    var existingTopbar = document.querySelector(".screenova-topbar");
    hideLegacyLogos(existingTopbar);
    hideEmptyLegacyHeaders();
  });
})();
