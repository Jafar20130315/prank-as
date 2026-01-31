(() => {
  // Sahifa identifikatori:
  // 1) <meta name="prank-name" content="..."> bo'lsa shuni oladi
  // 2) bo'lmasa URL path'dan oladi (masalan /login.html -> login)
  // 3) bo'lmasa index
  function getPageName() {
    const meta = document.querySelector('meta[name="prank-name"]');
    if (meta?.content?.trim()) return meta.content.trim();

    let p = (location.pathname || "/").trim();
    if (p === "/" || p === "") return "index";

    // /folder/page.html -> folder/page
    p = p.replace(/^\/+/, "").replace(/\/+$/, "");
    p = p.replace(/index\.html?$/i, "index");
    p = p.replace(/\.html?$/i, "");
    return p || "index";
  }

  const pageName = getPageName();
  const payload = {
    prank_name: pageName,
    page: pageName,
    title: document.title || "",
    ref: document.referrer || "",
    ts: Date.now()
  };

  // SENING WORKER MANZILING:
  // agar /visit prank-as.site da bo'lsa, shu qoladi.
  const VISIT_URL = "/visit";

  async function send() {
    try {
      // Avval POST (JSON) qilib ko'ramiz
      let r = await fetch(VISIT_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true
      });

      // Agar Worker faqat GET kutsa, fallback:
      if (!r.ok) {
        const qs = new URLSearchParams({
          prank_name: payload.prank_name,
          page: payload.page,
          title: payload.title
        });
        await fetch(`${VISIT_URL}?${qs.toString()}`, { method: "GET", keepalive: true });
      }
    } catch (e) {
      // jim turamiz, sayt ishlashiga xalaqit bermasin
      console.log("tracker send failed:", e?.message || e);
    }
  }

  // Sahifa ochilganda yuboradi
  send();
})();
