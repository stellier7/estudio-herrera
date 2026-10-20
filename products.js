// Shared product helpers for index.html and productos.html (no modules).
(function (global) {
  "use strict";

  const CART_KEY = "estudio-herrera-cart-v1";

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[ch]
    );
  }

  function getConfig() {
    // Classic <script> shares lexical CONFIG from config.js; it is not on window.
    if (typeof CONFIG !== "undefined") return CONFIG;
    return global.CONFIG || {};
  }

  function getProducts() {
    const c = getConfig();
    return Array.isArray(c.products) ? c.products : [];
  }

  function getProductById(id) {
    return getProducts().find((p) => p.id === id) || null;
  }

  function getCategories() {
    const c = getConfig();
    const configured = Array.isArray(c.productCategories)
      ? c.productCategories
      : [];
    if (configured.length) return configured.slice();
    const seen = new Set();
    getProducts().forEach((p) => {
      if (p.category) seen.add(p.category);
    });
    return Array.from(seen);
  }

  function getWhatsAppNumber() {
    const c = getConfig();
    if (c.whatsappNumber) return String(c.whatsappNumber).replace(/\D/g, "");
    const first = Array.isArray(c.locations) && c.locations[0];
    if (first && first.whatsappNumber) {
      return String(first.whatsappNumber).replace(/\D/g, "");
    }
    return "";
  }

  function productWhatsAppUrl(product) {
    const number = getWhatsAppNumber();
    const name = (product && product.name) || "este producto";
    const message = `Hola, me interesa ${name}`;
    if (!number) return `https://wa.me/?text=${encodeURIComponent(message)}`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Apply crop percentages to an <img> inside an overflow-hidden wrapper.
   * crop: { x, y, w, h } in 0–100 of the source photo.
   */
  function applyProductCrop(img, crop) {
    if (!img) return;
    img.classList.remove("is-cropped");
    img.style.removeProperty("width");
    img.style.removeProperty("height");
    img.style.removeProperty("left");
    img.style.removeProperty("top");
    img.style.removeProperty("right");
    img.style.removeProperty("bottom");
    img.style.removeProperty("object-fit");
    img.style.removeProperty("max-width");

    if (!crop || crop.w <= 0 || crop.h <= 0) return;

    const x = Number(crop.x) || 0;
    const y = Number(crop.y) || 0;
    const w = Number(crop.w);
    const h = Number(crop.h);

    img.classList.add("is-cropped");
    img.style.maxWidth = "none";
    img.style.width = `${(100 / w) * 100}%`;
    img.style.height = `${(100 / h) * 100}%`;
    img.style.left = `${-(x / w) * 100}%`;
    img.style.top = `${-(y / h) * 100}%`;
    img.style.objectFit = "fill";
  }

  function formatPrice(price) {
    if (price == null || price === "") return "";
    if (typeof price === "number") {
      return `L ${price.toLocaleString("es-HN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`;
    }
    return String(price);
  }

  /* ---------- Cart ---------- */

  function readCart() {
    try {
      const raw = global.localStorage.getItem(CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((item) => ({
          id: String(item.id || ""),
          qty: Math.max(1, Math.min(99, parseInt(item.qty, 10) || 1)),
        }))
        .filter((item) => item.id);
    } catch (err) {
      return [];
    }
  }

  function writeCart(items) {
    try {
      global.localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (err) {
      /* private mode / quota */
    }
    syncCartBadge();
    global.dispatchEvent(new CustomEvent("estudio-herrera:cart-change"));
  }

  function cartCount() {
    return readCart().reduce((sum, item) => sum + item.qty, 0);
  }

  function addToCart(productId, qty) {
    const id = String(productId || "");
    if (!id || !getProductById(id)) return;
    const amount = Math.max(1, Math.min(99, parseInt(qty, 10) || 1));
    const items = readCart();
    const existing = items.find((item) => item.id === id);
    if (existing) {
      existing.qty = Math.min(99, existing.qty + amount);
    } else {
      items.push({ id, qty: amount });
    }
    writeCart(items);
  }

  function setCartQty(productId, qty) {
    const id = String(productId || "");
    const next = Math.max(0, Math.min(99, parseInt(qty, 10) || 0));
    let items = readCart();
    if (next <= 0) {
      items = items.filter((item) => item.id !== id);
    } else {
      const existing = items.find((item) => item.id === id);
      if (existing) existing.qty = next;
      else items.push({ id, qty: next });
    }
    writeCart(items);
  }

  function clearCart() {
    writeCart([]);
  }

  function cartLines() {
    return readCart()
      .map((item) => {
        const product = getProductById(item.id);
        if (!product) return null;
        return { product, qty: item.qty };
      })
      .filter(Boolean);
  }

  function cartWhatsAppMessage() {
    const ui = getConfig().ui || {};
    const intro = ui.cartWhatsAppIntro || "Hola, me interesa este pedido:";
    const outro = ui.cartWhatsAppOutro || "¡Gracias!";
    const lines = cartLines().map((line) => {
      const template = ui.cartItemLine || "{qty}× {name}";
      return template
        .replace("{qty}", String(line.qty))
        .replace("{name}", line.product.name || line.product.id);
    });
    if (!lines.length) return intro;
    return `${intro}\n\n${lines.map((line) => `- ${line}`).join("\n")}\n\n${outro}`;
  }

  function cartWhatsAppUrl() {
    const number = getWhatsAppNumber();
    const message = cartWhatsAppMessage();
    if (!number) return `https://wa.me/?text=${encodeURIComponent(message)}`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function syncCartBadge() {
    const count = cartCount();
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = count > 0 ? String(count) : "";
      el.hidden = count <= 0;
    });
    document.querySelectorAll("[data-cart-toggle]").forEach((el) => {
      const ui = getConfig().ui || {};
      const label = ui.cartLabel || "Carrito";
      el.setAttribute(
        "aria-label",
        count > 0 ? `${label} (${count})` : label
      );
    });
  }

  function ensureCartDom() {
    if (document.getElementById("cart-drawer")) return;

    const ui = getConfig().ui || {};
    const drawer = document.createElement("div");
    drawer.className = "cart-drawer";
    drawer.id = "cart-drawer";
    drawer.hidden = true;
    drawer.setAttribute("aria-hidden", "true");
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-labelledby", "cart-drawer-title");
    drawer.innerHTML = `
      <button type="button" class="cart-drawer-backdrop" data-cart-close tabindex="-1" aria-label="${esc(
        ui.cartClose || "Cerrar carrito"
      )}"></button>
      <div class="cart-drawer-panel">
        <div class="cart-drawer-head">
          <h2 id="cart-drawer-title">${esc(ui.cartTitle || "Tu carrito")}</h2>
          <button type="button" class="cart-drawer-close" data-cart-close aria-label="${esc(
            ui.cartClose || "Cerrar carrito"
          )}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="cart-drawer-body" data-cart-body></div>
        <div class="cart-drawer-foot" data-cart-foot hidden>
          <a class="btn btn-primary" data-cart-checkout href="#" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7C17.18 3.03 14.7 2 12.04 2Zm0 18.14h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.37c0-4.55 3.7-8.25 8.26-8.25 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.84c0 4.55-3.71 8.22-8.25 8.22Z"/></svg>
            <span data-cart-checkout-label>${esc(
              ui.cartCheckout || "Pedir por WhatsApp"
            )}</span>
          </a>
          <button type="button" class="cart-clear" data-cart-clear>${esc(
            ui.cartClear || "Vaciar carrito"
          )}</button>
        </div>
      </div>`;
    document.body.appendChild(drawer);
  }

  function ensureNavCartButton() {
    if (document.querySelector("[data-cart-toggle]")) return;
    const nav = document.getElementById("nav");
    if (!nav) return;
    const ui = getConfig().ui || {};
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nav-cart";
    btn.setAttribute("data-cart-toggle", "");
    btn.setAttribute("aria-label", ui.cartLabel || "Carrito");
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
        <path d="M6 6h15l-1.5 9h-12z" stroke-linejoin="round"/>
        <path d="M6 6l-1-3H2" stroke-linecap="round"/>
        <circle cx="9" cy="20" r="1.2" fill="currentColor" stroke="none"/>
        <circle cx="18" cy="20" r="1.2" fill="currentColor" stroke="none"/>
      </svg>
      <span class="nav-cart-count" data-cart-count hidden></span>`;
    const cta =
      nav.querySelector("#nav-whatsapp") ||
      nav.querySelector("#nav-whatsapp-link") ||
      nav.querySelector(".nav-cta");
    if (cta) nav.insertBefore(btn, cta);
    else nav.appendChild(btn);
  }

  function renderCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (!drawer) return;
    const ui = getConfig().ui || {};
    const body = drawer.querySelector("[data-cart-body]");
    const foot = drawer.querySelector("[data-cart-foot]");
    const checkout = drawer.querySelector("[data-cart-checkout]");
    const lines = cartLines();

    if (!body) return;

    if (!lines.length) {
      body.innerHTML = `<p class="cart-empty">${esc(
        ui.cartEmpty || "Tu carrito está vacío."
      )}</p>`;
      if (foot) foot.hidden = true;
      return;
    }

    body.innerHTML = lines
      .map(({ product, qty }) => {
        return `
        <article class="cart-line" data-cart-line="${esc(product.id)}">
          <div class="cart-line-media">
            <img src="${esc(product.image || "")}" alt="${esc(
          product.name || ""
        )}" loading="lazy" decoding="async" data-cart-img>
          </div>
          <div class="cart-line-info">
            <p class="cart-line-cat">${esc(product.category || "")}</p>
            <h3 class="cart-line-name">${esc(product.name || "")}</h3>
            <div class="cart-line-controls">
              <button type="button" class="cart-qty-btn" data-cart-dec aria-label="-">−</button>
              <span class="cart-qty" aria-label="${esc(
                ui.cartQty || "Cantidad"
              )}">${qty}</span>
              <button type="button" class="cart-qty-btn" data-cart-inc aria-label="+">+</button>
              <button type="button" class="cart-line-remove" data-cart-remove>${esc(
                ui.cartRemove || "Quitar"
              )}</button>
            </div>
          </div>
        </article>`;
      })
      .join("");

    body.querySelectorAll("[data-cart-line]").forEach((row) => {
      const id = row.getAttribute("data-cart-line");
      const product = getProductById(id);
      const img = row.querySelector("[data-cart-img]");
      if (product && img) applyProductCrop(img, product.crop);
    });

    if (foot) foot.hidden = false;
    if (checkout) checkout.href = cartWhatsAppUrl();
  }

  function openCart() {
    ensureCartDom();
    renderCartDrawer();
    const drawer = document.getElementById("cart-drawer");
    if (!drawer) return;
    drawer.hidden = false;
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-open");
    const closeBtn = drawer.querySelector(".cart-drawer-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeCart() {
    const drawer = document.getElementById("cart-drawer");
    if (!drawer || drawer.hidden) return;
    drawer.hidden = true;
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");
  }

  function initCartUI() {
    ensureNavCartButton();
    ensureCartDom();
    syncCartBadge();

    document.addEventListener("click", (event) => {
      const toggle = event.target.closest("[data-cart-toggle]");
      if (toggle) {
        event.preventDefault();
        openCart();
        return;
      }
      if (event.target.closest("[data-cart-close]")) {
        closeCart();
        return;
      }
      const clearBtn = event.target.closest("[data-cart-clear]");
      if (clearBtn) {
        clearCart();
        renderCartDrawer();
        return;
      }
      const line = event.target.closest("[data-cart-line]");
      if (!line) return;
      const id = line.getAttribute("data-cart-line");
      const current = readCart().find((item) => item.id === id);
      if (!current) return;
      if (event.target.closest("[data-cart-inc]")) {
        setCartQty(id, current.qty + 1);
        renderCartDrawer();
        return;
      }
      if (event.target.closest("[data-cart-dec]")) {
        setCartQty(id, current.qty - 1);
        renderCartDrawer();
        return;
      }
      if (event.target.closest("[data-cart-remove]")) {
        setCartQty(id, 0);
        renderCartDrawer();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const drawer = document.getElementById("cart-drawer");
      if (drawer && !drawer.hidden) {
        closeCart();
        event.stopPropagation();
      }
    });

    global.addEventListener("estudio-herrera:cart-change", () => {
      const drawer = document.getElementById("cart-drawer");
      if (drawer && !drawer.hidden) renderCartDrawer();
    });
  }

  function createProductCard(product, options) {
    const opts = options || {};
    const interactive = opts.interactive !== false;
    const showAdd = Boolean(opts.showAdd);
    // Use <article> when the card has nested controls (add button).
    const useArticle = showAdd || !interactive;
    const card = document.createElement(useArticle ? "article" : "button");
    card.className = "product-card";
    if (!useArticle) card.type = "button";
    card.dataset.productId = product.id || "";

    const media = document.createElement("div");
    media.className = "product-media";

    const img = document.createElement("img");
    img.src = product.image || "";
    img.alt = product.name || "";
    img.loading = opts.eager ? "eager" : "lazy";
    img.decoding = "async";
    img.draggable = false;
    if (opts.eager) img.fetchPriority = "high";
    media.appendChild(img);
    applyProductCrop(img, product.crop);

    const body = document.createElement("div");
    body.className = "product-card-body";

    if (product.category) {
      const tag = document.createElement("span");
      tag.className = "product-tag";
      tag.textContent = product.category;
      body.appendChild(tag);
    }

    const title = document.createElement("h3");
    title.className = "product-name";
    title.textContent = product.name || "";
    body.appendChild(title);

    const priceText = formatPrice(product.price);
    if (priceText) {
      const price = document.createElement("p");
      price.className = "product-price";
      price.textContent = priceText;
      body.appendChild(price);
    }

    if (showAdd) {
      const actions = document.createElement("div");
      actions.className = "product-card-actions";
      const addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "product-card-add";
      addBtn.textContent =
        (getConfig().ui || {}).catalogAddToCart || "Agregar al carrito";
      addBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        addToCart(product.id, 1);
        const ui = getConfig().ui || {};
        addBtn.textContent = ui.cartAdded || "Agregado";
        addBtn.classList.add("is-added");
        setTimeout(() => {
          addBtn.textContent = ui.catalogAddToCart || "Agregar al carrito";
          addBtn.classList.remove("is-added");
        }, 1200);
      });
      actions.appendChild(addBtn);
      body.appendChild(actions);
    }

    card.appendChild(media);
    card.appendChild(body);

    if (interactive && typeof opts.onSelect === "function") {
      if (useArticle) {
        card.classList.add("is-clickable");
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        const open = () => opts.onSelect(product);
        card.addEventListener("click", (event) => {
          if (event.target.closest(".product-card-add")) return;
          open();
        });
        card.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          if (event.target.closest(".product-card-add")) return;
          event.preventDefault();
          open();
        });
      } else {
        card.addEventListener("click", () => opts.onSelect(product));
      }
    }

    return card;
  }

  function initFeaturedMarquee(root) {
    if (!root) return;
    const products = getProducts().filter((p) => p.featured);
    const track = root.querySelector("[data-marquee-track]");
    const section = root.closest("section") || root.parentElement;
    const cta = section
      ? section.querySelector("[data-products-cta]")
      : null;
    const ui = getConfig().ui || {};

    if (cta) {
      cta.textContent = ui.productsViewAll || "Ver todos los productos";
      cta.href = "productos.html";
    }

    if (!track || !products.length) {
      root.hidden = true;
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.innerHTML = "";

    const appendSet = () => {
      products.forEach((product) => {
        track.appendChild(
          createProductCard(product, {
            interactive: false,
            showAdd: true,
            // Eager load so the duplicated loop half never flashes empty.
            eager: !reduced,
          })
        );
      });
    };

    appendSet();
    if (!reduced) appendSet();

    root.classList.toggle("is-reduced", reduced);
    if (reduced) return;

    // JS-driven loop: 1:1 drag + flick momentum, then cruise (from 0101barbershop).
    let offset = 0;
    let loopWidth = 0;
    let rafId = 0;
    let lastTs = 0;
    let dragging = false;
    let dragMoved = false;
    let axis = "";
    let pointerId = null;
    let lastX = 0;
    let lastMoveTs = 0;
    let startX = 0;
    let startY = 0;
    const autoplaySpeed = 0.048; // ~48px/s cruise
    const friction = 0.00135; // coast half-life ~500ms
    const maxFlick = 3.5; // px/ms
    let velocity = autoplaySpeed;
    let coasting = false;
    let measureTimer = 0;
    let moveSamples = [];

    function measure() {
      const half = track.scrollWidth / 2;
      const next = half > 0 ? half : 0;
      if (Math.abs(next - loopWidth) < 0.5) return;
      loopWidth = next;
      if (loopWidth > 0) {
        offset = ((offset % loopWidth) + loopWidth) % loopWidth;
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
    }

    function scheduleMeasure() {
      if (measureTimer) return;
      measureTimer = requestAnimationFrame(() => {
        measureTimer = 0;
        measure();
      });
    }

    function wrapOffset(value) {
      if (loopWidth <= 0) return 0;
      let next = value % loopWidth;
      if (next < 0) next += loopWidth;
      return next;
    }

    function applyOffset() {
      offset = wrapOffset(offset);
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    }

    function pushSample(dx, time) {
      moveSamples.push({ t: time, dx: dx });
      const cutoff = time - 120;
      while (moveSamples.length && moveSamples[0].t < cutoff) moveSamples.shift();
    }

    function flickVelocityFromSamples() {
      if (moveSamples.length < 1) return velocity;
      let totalDx = 0;
      const start = moveSamples[0].t;
      const end = moveSamples[moveSamples.length - 1].t;
      for (let i = 0; i < moveSamples.length; i += 1) totalDx += moveSamples[i].dx;
      const span = Math.max(16, end - start);
      return -totalDx / span;
    }

    function tick(ts) {
      rafId = requestAnimationFrame(tick);
      if (!loopWidth) return;
      if (!lastTs) lastTs = ts;
      const dt = Math.min(32, Math.max(0, ts - lastTs));
      lastTs = ts;
      if (!dt) return;

      if (dragging && axis === "x") return;

      if (coasting) {
        velocity *= Math.exp(-friction * dt);
        if (Math.abs(velocity) <= autoplaySpeed * 1.15) {
          velocity = autoplaySpeed;
          coasting = false;
        }
      } else {
        velocity = autoplaySpeed;
      }

      offset += velocity * dt;
      applyOffset();
    }

    function onPointerDown(event) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (event.target.closest(".product-card-add")) return;
      dragging = true;
      dragMoved = false;
      coasting = false;
      axis = "";
      pointerId = event.pointerId;
      startX = lastX = event.clientX;
      startY = event.clientY;
      lastMoveTs = event.timeStamp || performance.now();
      moveSamples = [];
      velocity = 0;
    }

    function onPointerMove(event) {
      if (!dragging || event.pointerId !== pointerId) return;
      const dxTotal = event.clientX - startX;
      const dyTotal = event.clientY - startY;
      if (!axis) {
        if (Math.abs(dxTotal) < 4 && Math.abs(dyTotal) < 4) return;
        axis = Math.abs(dxTotal) > Math.abs(dyTotal) ? "x" : "y";
        if (axis === "x") {
          root.classList.add("is-dragging");
          try {
            root.setPointerCapture(event.pointerId);
          } catch (_) {
            /* ignore */
          }
        } else {
          dragging = false;
          pointerId = null;
          velocity = autoplaySpeed;
          return;
        }
      }
      if (axis !== "x") return;

      const coalesced =
        typeof event.getCoalescedEvents === "function" &&
        event.getCoalescedEvents().length
          ? event.getCoalescedEvents()
          : [event];

      for (let i = 0; i < coalesced.length; i += 1) {
        const point = coalesced[i];
        const now = point.timeStamp || event.timeStamp || performance.now();
        const dx = point.clientX - lastX;
        if (dx === 0 && i < coalesced.length - 1) continue;
        offset -= dx;
        pushSample(dx, now);
        lastX = point.clientX;
        lastMoveTs = now;
        dragMoved = true;
      }

      if (moveSamples.length) {
        velocity = flickVelocityFromSamples();
      }
      applyOffset();
      if (event.cancelable) event.preventDefault();
    }

    function endDrag(event) {
      if (
        pointerId != null &&
        event &&
        event.pointerId !== pointerId &&
        event.type !== "lostpointercapture"
      ) {
        return;
      }
      if (!dragging && !root.classList.contains("is-dragging")) {
        pointerId = null;
        return;
      }
      const didMove = dragMoved;
      dragging = false;
      pointerId = null;
      axis = "";
      root.classList.remove("is-dragging");

      if (didMove) {
        let flick = flickVelocityFromSamples();
        const idle =
          (event && event.timeStamp ? event.timeStamp : performance.now()) -
          lastMoveTs;
        if (idle > 80) flick *= Math.max(0, 1 - (idle - 80) / 140);
        velocity = Math.max(-maxFlick, Math.min(maxFlick, flick));
        coasting = Math.abs(velocity) > autoplaySpeed * 1.5;
        if (!coasting) velocity = autoplaySpeed;
        root.dataset.suppressClick = "1";
      } else {
        velocity = autoplaySpeed;
        coasting = false;
      }
      moveSamples = [];
      dragMoved = false;
    }

    root.classList.add("is-js-marquee");
    measure();
    requestAnimationFrame(measure);
    window.addEventListener("resize", scheduleMeasure);
    if (typeof ResizeObserver === "function") {
      const ro = new ResizeObserver(scheduleMeasure);
      ro.observe(track);
      ro.observe(root);
    }

    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove, { passive: false });
    root.addEventListener("pointerup", endDrag);
    root.addEventListener("pointercancel", endDrag);
    root.addEventListener("lostpointercapture", endDrag);

    root.addEventListener(
      "click",
      (event) => {
        if (!root.dataset.suppressClick) return;
        event.preventDefault();
        event.stopPropagation();
        delete root.dataset.suppressClick;
      },
      true
    );

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") lastTs = 0;
    });

    rafId = requestAnimationFrame(tick);
  }

  function initCatalogPage() {
    const grid = document.getElementById("catalog-grid");
    if (!grid) return;

    const c = getConfig();
    const ui = c.ui || {};
    const products = getProducts();
    const categories = getCategories();

    const chipsEl = document.getElementById("catalog-chips");
    const searchEl = document.getElementById("catalog-search");
    const emptyEl = document.getElementById("catalog-empty");
    const modal = document.getElementById("product-modal");
    const modalImg = document.getElementById("product-modal-img");
    const modalMedia = document.getElementById("product-modal-media");
    const modalName = document.getElementById("product-modal-name");
    const modalCategory = document.getElementById("product-modal-category");
    const modalPrice = document.getElementById("product-modal-price");
    const modalWa = document.getElementById("product-modal-whatsapp");
    const modalAdd = document.getElementById("product-modal-add");
    const modalClose = document.getElementById("product-modal-close");
    const modalBackdrop = document.getElementById("product-modal-backdrop");

    let activeCategory = "";
    let query = "";
    let lastFocus = null;
    let activeProduct = null;

    document.getElementById("catalog-title").textContent =
      ui.catalogTitle || "Catálogo";
    document.getElementById("catalog-subtitle").textContent =
      ui.catalogSubtitle || "";
    if (searchEl) {
      searchEl.placeholder = ui.catalogSearchPlaceholder || "Buscar…";
      searchEl.setAttribute(
        "aria-label",
        ui.catalogSearchPlaceholder || "Buscar producto"
      );
    }
    if (emptyEl) emptyEl.textContent = ui.catalogEmpty || "";
    if (modalAdd) {
      modalAdd.textContent = ui.catalogAddToCart || "Agregar al carrito";
    }
    if (modalWa) {
      modalWa.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7C17.18 3.03 14.7 2 12.04 2Zm0 18.14h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.37c0-4.55 3.7-8.25 8.26-8.25 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.84c0 4.55-3.71 8.22-8.25 8.22Z"/></svg>
        <span>${esc(ui.catalogWhatsApp || "Consultar por WhatsApp")}</span>`;
    }
    if (modalClose) {
      modalClose.setAttribute("aria-label", ui.catalogClose || "Cerrar");
    }
    if (modalBackdrop) {
      modalBackdrop.setAttribute("aria-label", ui.catalogClose || "Cerrar");
    }

    if (chipsEl) {
      const allLabel = ui.catalogFilterAll || "Todos";
      const chipHtml = [
        `<button type="button" class="catalog-chip is-active" data-category="" aria-pressed="true">${esc(
          allLabel
        )}</button>`,
      ]
        .concat(
          categories.map(
            (cat) =>
              `<button type="button" class="catalog-chip" data-category="${esc(
                cat
              )}" aria-pressed="false">${esc(cat)}</button>`
          )
        )
        .join("");
      chipsEl.innerHTML = chipHtml;

      chipsEl.addEventListener("click", (event) => {
        const btn = event.target.closest(".catalog-chip");
        if (!btn || !chipsEl.contains(btn)) return;
        activeCategory = btn.dataset.category || "";
        chipsEl.querySelectorAll(".catalog-chip").forEach((chip) => {
          const on = chip === btn;
          chip.classList.toggle("is-active", on);
          chip.setAttribute("aria-pressed", on ? "true" : "false");
        });
        render();
      });
    }

    if (searchEl) {
      searchEl.addEventListener("input", () => {
        query = searchEl.value.trim().toLowerCase();
        render();
      });
    }

    function matches(product) {
      if (activeCategory && product.category !== activeCategory) return false;
      if (!query) return true;
      const hay = `${product.name || ""} ${product.category || ""}`.toLowerCase();
      return hay.includes(query);
    }

    function closeModal() {
      if (!modal || modal.hidden) return;
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("product-modal-open");
      activeProduct = null;
      if (modalImg) {
        modalImg.removeAttribute("src");
        applyProductCrop(modalImg, null);
      }
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    function openModal(product, trigger) {
      if (!modal || !product) return;
      activeProduct = product;
      lastFocus = trigger || document.activeElement;
      if (modalName) modalName.textContent = product.name || "";
      if (modalCategory) {
        modalCategory.textContent = product.category || "";
        modalCategory.hidden = !product.category;
      }
      const priceText = formatPrice(product.price);
      if (modalPrice) {
        modalPrice.textContent = priceText;
        modalPrice.hidden = !priceText;
      }
      if (modalImg) {
        modalImg.src = product.image || "";
        modalImg.alt = product.name || "";
        applyProductCrop(modalImg, product.crop);
      }
      if (modalMedia) {
        modalMedia.classList.toggle("has-crop", Boolean(product.crop));
      }
      if (modalWa) {
        modalWa.href = productWhatsAppUrl(product);
      }
      if (modalAdd) {
        modalAdd.textContent = ui.catalogAddToCart || "Agregar al carrito";
        modalAdd.classList.remove("is-added");
      }
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("product-modal-open");
      if (modalAdd) modalAdd.focus();
      else if (modalClose) modalClose.focus();
    }

    function render() {
      const filtered = products.filter(matches);
      grid.innerHTML = "";
      filtered.forEach((product) => {
        const card = createProductCard(product, {
          interactive: true,
          showAdd: true,
          onSelect: (p) => openModal(p, card),
        });
        grid.appendChild(card);
      });
      if (emptyEl) emptyEl.hidden = filtered.length > 0;
    }

    if (modalAdd) {
      modalAdd.addEventListener("click", () => {
        if (!activeProduct) return;
        addToCart(activeProduct.id, 1);
        modalAdd.textContent = ui.cartAdded || "Agregado";
        modalAdd.classList.add("is-added");
        setTimeout(() => {
          if (!activeProduct) return;
          modalAdd.textContent = ui.catalogAddToCart || "Agregar al carrito";
          modalAdd.classList.remove("is-added");
        }, 1200);
      });
    }

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const drawer = document.getElementById("cart-drawer");
      if (drawer && !drawer.hidden) return;
      closeModal();
    });

    render();
  }

  function applyBrandChrome() {
    const c = getConfig();
    if (!c || !c.brandName) return;
    const ui = c.ui || {};

    document.documentElement.lang = c.lang || "es";

    const colorMap = {
      cream: "--cream",
      cream2: "--cream-2",
      ink: "--ink",
      inkSoft: "--ink-soft",
      inkFaint: "--ink-faint",
      accent: "--accent",
      accentInv: "--accent-inv",
      accentHover: "--accent-hover",
      gray: "--gray",
      grayLight: "--gray-light",
      line: "--line",
      lineStrong: "--line-strong",
    };
    const rootStyle = document.documentElement.style;
    Object.entries(colorMap).forEach(([key, cssVar]) => {
      if (c.colors && c.colors[key]) rootStyle.setProperty(cssVar, c.colors[key]);
    });

    const navName = document.getElementById("nav-name");
    const navSubtitle = document.getElementById("nav-subtitle");
    const navLogo = document.getElementById("nav-logo");
    if (navName) navName.textContent = c.brandName;
    if (navSubtitle) navSubtitle.textContent = c.brandSubtitle || c.tagline || "";
    if (navLogo) {
      const logoSrc = c.logoImage || c.logoMark || c.logo;
      if (logoSrc) {
        navLogo.src = logoSrc;
        navLogo.alt = `${c.brandName} — ${c.brandSubtitle || c.tagline || ""}`;
        navLogo.hidden = false;
      }
    }

    const navProducts = document.getElementById("nav-products");
    if (navProducts) navProducts.textContent = ui.navProducts || "Productos";

    const navCta = document.getElementById("nav-cta-label");
    if (navCta) navCta.textContent = ui.navBook || "Reservar";

    const footerBrand = document.getElementById("footer-brand");
    const footerMeta = document.getElementById("footer-meta");
    const footerInsta = document.getElementById("footer-insta");
    if (footerBrand) {
      footerBrand.textContent = c.legalName || `${c.brandName}${c.brandSubtitle || c.tagline ? ` — ${c.brandSubtitle || c.tagline}` : ""}`;
    }
    if (footerMeta) {
      const locations = Array.isArray(c.locations) ? c.locations : [];
      const address = c.address && (c.address.full || c.address);
      footerMeta.textContent =
        locations.map((loc) => loc.name).join(" · ") || address || c.tagline || "";
    }
    if (footerInsta) {
      footerInsta.href = c.instagramUrl || "#";
      footerInsta.textContent = c.instagramHandle || "Instagram";
      footerInsta.setAttribute(
        "aria-label",
        c.instagramHandle || "Instagram"
      );
    }
  }

  global.ProductsUI = {
    esc,
    getProducts,
    getCategories,
    getWhatsAppNumber,
    productWhatsAppUrl,
    applyProductCrop,
    formatPrice,
    createProductCard,
    initFeaturedMarquee,
    initCatalogPage,
    applyBrandChrome,
    initCartUI,
    addToCart,
    cartCount,
    cartWhatsAppUrl,
    openCart,
    closeCart,
  };
})(window);
