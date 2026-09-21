// Renders the Agent Harness Runtime overview + full feature list from
// GET /api/features, and wires each feature's "Ask AI" / "Generate Icon"
// buttons to pre-fill (not auto-submit) the AI panels below.

async function renderFeatures() {
  const container = document.getElementById("features");
  try {
    const res = await fetch("/api/features");
    const { overview, features } = await res.json();

    document.getElementById("ov-icon").textContent = overview.icon;
    document.getElementById("ov-tagline").textContent = overview.tagline;
    document.getElementById("ov-summary").textContent = overview.summary;

    features.forEach((feature) => {
      const card = document.createElement("div");
      card.className = "feature-card";

      const icon = document.createElement("div");
      icon.className = "feature-icon";
      icon.textContent = feature.icon;
      card.appendChild(icon);

      const body = document.createElement("div");
      body.className = "feature-body";
      body.innerHTML =
        `<div class="feature-name">${feature.name}</div>` +
        `<p class="feature-desc">${feature.desc}</p>` +
        `<p class="feature-detail">${feature.detail}</p>`;

      const demoBlock = document.createElement("pre");
      demoBlock.className = "feature-demo";
      demoBlock.hidden = true;
      const demoCode = document.createElement("code");
      demoCode.textContent = feature.demo;
      demoBlock.appendChild(demoCode);
      body.appendChild(demoBlock);

      const actions = document.createElement("div");
      actions.className = "feature-actions";

      const demoBtn = document.createElement("button");
      demoBtn.textContent = "View Demo";
      demoBtn.addEventListener("click", () => {
        const opening = demoBlock.hidden;
        demoBlock.hidden = !opening;
        demoBtn.textContent = opening ? "Hide Demo" : "View Demo";
        if (opening) demoBlock.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });

      const iconBtn = document.createElement("button");
      iconBtn.textContent = "Generate Icon";
      iconBtn.addEventListener("click", () => {
        document.getElementById("image-prompt").value =
          `A clean, modern flat icon representing "${feature.name}" (${feature.desc}), ocean-blue and rust-orange color palette, minimalist, on a white background`;
        document.getElementById("image-prompt").scrollIntoView({ behavior: "smooth", block: "center" });
      });

      actions.appendChild(demoBtn);
      actions.appendChild(iconBtn);
      body.appendChild(actions);
      card.appendChild(body);

      container.appendChild(card);
    });
  } catch (err) {
    container.textContent = "Could not load feature list.";
  }
}

renderFeatures();
