document.querySelectorAll("[data-mailer-form]").forEach((formEl) => {
  if (!(formEl instanceof HTMLFormElement)) return;

  const submitUrl = String(formEl.dataset.submitUrl ?? "").trim();
  const envName = String(formEl.dataset.envName ?? "PUBLIC_*_SUBMIT_URL").trim();
  const successWrap = formEl.querySelector("[data-form-success]");
  const errorWrap = formEl.querySelector("[data-form-error]");
  const successP = successWrap?.querySelector("p");
  const errorP = errorWrap?.querySelector("p");
  const submit = formEl.querySelector('button[type="submit"]');

  function showSuccess(msg) {
    successWrap?.classList.remove("hidden");
    errorWrap?.classList.add("hidden");
    if (successP) successP.textContent = msg;
  }

  function showError(msg) {
    errorWrap?.classList.remove("hidden");
    successWrap?.classList.add("hidden");
    if (errorP) errorP.textContent = msg;
  }

  function hideBanners() {
    successWrap?.classList.add("hidden");
    errorWrap?.classList.add("hidden");
    if (successP) successP.textContent = "";
    if (errorP) errorP.textContent = "";
  }

  function applyStatusBanner(el, ui) {
    if (!(el instanceof HTMLElement)) return;
    el.style.color = "";
    el.style.backgroundColor = "";
    if (ui?.textColor?.trim()) el.style.color = ui.textColor.trim();
    if (ui?.backgroundColor?.trim()) el.style.backgroundColor = ui.backgroundColor.trim();
  }

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }

    hideBanners();

    if (!submitUrl) {
      showError(`Form is not configured. Set ${envName} in .env (full Mailer embed POST URL).`);
      return;
    }

    const defaultSubmitLabel =
      submit instanceof HTMLButtonElement && submit.textContent.trim()
        ? submit.textContent.trim()
        : "Send";

    if (submit instanceof HTMLButtonElement) {
      submit.disabled = true;
      submit.textContent = "Sending…";
    }

    const fd = new FormData(formEl);
    try {
      const res = await fetch(submitUrl, {
        method: "POST",
        body: fd,
        mode: "cors",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.ok) {
        const msg =
          typeof data?.successUi?.message === "string"
            ? data.successUi.message
            : typeof data?.message === "string"
              ? data.message
              : "Thanks — your message was sent.";
        showSuccess(msg);
        applyStatusBanner(successWrap, data.successUi ?? {});
        formEl.reset();
      } else {
        const msg =
          typeof data?.displayMessage === "string"
            ? data.displayMessage
            : typeof data?.errorUi?.message === "string"
              ? data.errorUi.message
              : typeof data?.error === "string"
                ? data.error
                : "Something went wrong. Try again later.";
        showError(msg);
        applyStatusBanner(errorWrap, data.errorUi ?? {});
      }
    } catch {
      showError("Network error. Check your connection and try again.");
    } finally {
      if (submit instanceof HTMLButtonElement) {
        submit.disabled = false;
        submit.textContent = defaultSubmitLabel;
      }
    }
  });
});
