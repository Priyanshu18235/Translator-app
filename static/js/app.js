(() => {
  const $ = (id) => document.getElementById(id);
  const input = $("input"), output = $("output"), status = $("status");
  const src = $("src"), dst = $("dst"), go = $("go");
  const PLACEHOLDER = "Translation appears here";
  let lastTranslation = "";

  const setOutput = (text, isPlaceholder = false) => {
    output.textContent = text;
    output.classList.toggle("placeholder", isPlaceholder);
  };
  setOutput(PLACEHOLDER, true);

  const updateCount = () => { $("count").textContent = `${input.value.length} / ${window.MAX_CHARS}`; };
  input.addEventListener("input", updateCount);

  async function translate() {
    const q = input.value.trim();
    if (!q) { status.textContent = "Enter some text first."; return; }
    go.disabled = true;
    status.textContent = "Translating...";
    try {
      const params = new URLSearchParams({ q, src: src.value, dst: dst.value });
      const res = await fetch(`/api/translate/?${params}`);
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Translation failed.");
      lastTranslation = data.translation;
      setOutput(lastTranslation);
      status.textContent = "";
    } catch (err) {
      status.textContent = err.message;
    } finally {
      go.disabled = false;
    }
  }

  go.addEventListener("click", translate);
  input.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") translate();
  });

  $("swap").addEventListener("click", () => {
    if (src.value === "auto") { status.textContent = "Pick a source language to swap."; return; }
    [src.value, dst.value] = [dst.value, src.value];
    if (lastTranslation) { input.value = lastTranslation; updateCount(); setOutput(PLACEHOLDER, true); lastTranslation = ""; }
  });

  $("clear").addEventListener("click", () => {
    input.value = ""; updateCount(); lastTranslation = "";
    setOutput(PLACEHOLDER, true); status.textContent = ""; input.focus();
  });

  $("copy").addEventListener("click", async () => {
    if (!lastTranslation) return;
    try { await navigator.clipboard.writeText(lastTranslation); status.textContent = "Copied!"; }
    catch { status.textContent = "Copy not available here."; }
  });

  $("speak").addEventListener("click", () => {
    if (!lastTranslation || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(lastTranslation);
    u.lang = dst.value;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  });
})();
