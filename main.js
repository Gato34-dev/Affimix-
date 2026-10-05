// AffiMix — shared behavior. No localStorage/sessionStorage is used;
// the feedback form composes an email via mailto: since this is a
// static site with no backend. Swap FEEDBACK_ENDPOINT below for a
// form service (e.g. Formspree) if you'd rather not use mailto.

const FEEDBACK_EMAIL = "borriscollins227@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  /* Mobile nav toggle */
  const toggle = document.querySelector(".mobile-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* Tech / Health tabs on the picks section */
  const tabButtons = document.querySelectorAll(".tab-btn");
  const selectTab = (targetId) => {
    tabButtons.forEach((b) => {
      const isMatch = b.getAttribute("data-tab") === targetId;
      b.setAttribute("aria-selected", String(isMatch));
    });
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.hidden = panel.id !== targetId;
    });
  };
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectTab(btn.getAttribute("data-tab")));
  });

  /* Category banner cards -> jump to Picks, pre-select matching tab */
  document.querySelectorAll(".category-card[data-tab-target]").forEach((card) => {
    card.addEventListener("click", () => {
      const target = card.getAttribute("data-tab-target");
      selectTab(target);
      document.getElementById("picks").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* Feedback widget: floating tab opens the on-page feedback section */
  const fab = document.querySelector(".feedback-fab");
  const feedbackSection = document.getElementById("feedback");
  if (fab && feedbackSection) {
    fab.addEventListener("click", () => {
      feedbackSection.scrollIntoView({ behavior: "smooth", block: "start" });
      const first = feedbackSection.querySelector("button, input, textarea");
      if (first) first.focus({ preventScroll: true });
    });
  }

  /* Star / rating selector */
  let selectedRating = null;
  const ratingButtons = document.querySelectorAll(".rating-row button");
  ratingButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      ratingButtons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      selectedRating = btn.getAttribute("data-value");
    });
  });

  /* Feedback form submit -> opens the visitor's email client, prefilled */
  const form = document.getElementById("feedback-form");
  const status = document.getElementById("feedback-status");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("#fb-name").value.trim() || "Anonymous visitor";
      const email = form.querySelector("#fb-email").value.trim();
      const message = form.querySelector("#fb-message").value.trim();

      if (!email || !form.querySelector("#fb-email").checkValidity()) {
        status.textContent = "Add a valid email so we know where to reply.";
        form.querySelector("#fb-email").focus();
        return;
      }
      if (!message) {
        status.textContent = "Add a quick note before sending — even one line helps.";
        return;
      }

      const subject = encodeURIComponent(`AffiMix feedback — rating ${selectedRating || "n/a"}/5`);
      const body = encodeURIComponent(
        `Rating: ${selectedRating || "not given"}/5\nFrom: ${name}\nReply to: ${email}\n\n${message}`
      );
      // "Reply to" is also passed as the mailto reply-to header where the
      // visitor's email client supports it, so hitting Reply on our end
      // goes straight back to the address they gave us.
      window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}&reply-to=${encodeURIComponent(email)}`;
      status.textContent = "Thanks — your email app should open with the note prefilled. Send it to submit, and we'll reply to the email you entered.";
      form.reset();
      ratingButtons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      selectedRating = null;
    });
  }
});
