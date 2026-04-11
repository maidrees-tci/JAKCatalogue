// ─── Constants ────────────────────────────────────────────────────────────
(function () {

    "use strict";

    // ─── Constants ────────────────────────────────────────────────────────────
    // Default: open our existing login page in "SDK mode" (triggered by `jak=1`).
    const WIDGET_URL = "https://app.jakdelivery.com/SignIn/SignIn";
    const ALLOWED_ORIGIN = "https://app.jakdelivery.com";

    // ─── Smart Field Detection Patterns ──────────────────────────────────────
    const FIELD_PATTERNS = {
        name: [
            /\bfull.?name\b/i, /\bfullname\b/i, /\bname\b/i,
            /\bbilling.?name\b/i, /\bshipping.?name\b/i,
            /\bfirst.?name\b/i, /\bcontact.?name\b/i,
        ],
        email: [
            /\bemail\b/i, /\be.?mail\b/i,
            /\buser.?email\b/i, /\bbilling.?email\b/i,
        ],
        phone: [
            /\bphone\b/i, /\bmobile\b/i, /\btel\b/i, /\bcell\b/i,
            /\bcontact.?no\b/i, /\bphone.?no\b/i,
            /\bphonenumber\b/i, /\bmobilenumber\b/i, /\bbilling.?phone\b/i,
        ],
        /** Second line / delivery / suite number (distinct from account mobile). */
        addressPhone: [
            /\baddress.?mobile\b/i, /\bsuite.?phone\b/i, /\bsuite.?mobile\b/i,
            /\balternate.?phone\b/i, /\balternate.?mobile\b/i,
            /\bdelivery.?phone\b/i, /\bdelivery.?mobile\b/i,
            /\bshipping.?phone\b/i, /\bsecond.?phone\b/i, /\bphone.?2\b/i, /\bmobile.?2\b/i,
        ],
        address: [
            /\baddress\b/i, /\bstreet\b/i, /\baddr\b/i,
            /\bbilling.?address\b/i, /\bshipping.?address\b/i,
            /\baddress.?line\b/i, /\baddr1\b/i, /\baddress1\b/i,
        ],
        address2: [
            /\baddress2\b/i, /\baddr2\b/i, /\baddress.?line.?2\b/i,
            /\bapt\b/i, /\bapartment\b/i, /\bunit\b/i, /\bfloor\b/i, /\bsuite\b/i
        ],
        city: [
            /\bcity\b/i, /\btown\b/i, /\bmunicipality\b/i
        ],
        state: [
            /\bstate\b/i, /\bprovince\b/i, /\bregion\b/i
        ],
        postal: [
            /\bzip\b/i, /\bzipcode\b/i, /\bzip.?code\b/i,
            /\bpostal\b/i, /\bpostal.?code\b/i, /\bpincode\b/i
        ],
        fullAddress: [
            /\bfull.?address\b/i, /\bfulladdress\b/i,
            /\bcomplete.?address\b/i, /\baddress.?full\b/i,
            /\bdelivery.?address\b/i, /\bformatted.?address\b/i
        ],
    };

    const AUTOCOMPLETE_MAP = {
        name: ["name", "given-name", "family-name", "billing name", "shipping name"],
        email: ["email", "billing email", "shipping email"],
        phone: ["tel", "tel-national", "mobile"],
        address: ["address-line1", "street-address", "billing address-line1", "shipping address-line1"],
        address2: ["address-line2", "billing address-line2", "shipping address-line2"],
        city: ["address-level2"],
        state: ["address-level1"],
        postal: ["postal-code"],
    };

    // ─── State ────────────────────────────────────────────────────────────────
    let _popup = null;   // reference to the popup window
    let _userData = null;
    let _pollTimer = null;
    let _retailerCountryId = "";
    let _retailerAppKey = "";

    // ─── Country Code (from SDK script URL) ───────────────────────────────────
    function getCountryCode() {
        const scripts = document.querySelectorAll("script[src]");
        for (let i = 0; i < scripts.length; i++) {
            const match = scripts[i].src.match(/\/sdk\/([a-z]{2})\//i);
            if (match) return match[1].toLowerCase();
        }
        return null;
    }

    // ─── Styles ───────────────────────────────────────────────────────────────
    function injectStyles() {
        if (document.getElementById("jak-sdk-styles")) return;
        const s = document.createElement("style");
        s.id = "jak-sdk-styles";
        s.textContent = `
      /* Trigger button — keep valid CSS (no stray braces) or the whole block may be ignored */
      #jakdelivery-login-btn { display: inline-block; min-height: 1px; }
      .jak-trigger-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        background: #007bff;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        letter-spacing: 0.2px;
        transition: background 0.15s, transform 0.1s;
        font-family: inherit;
        box-sizing: border-box;
        line-height: 1.2;
        visibility: visible;
        opacity: 1;
      }
      .jak-trigger-btn:hover { background: #0069d9; }
      .jak-trigger-btn:active { transform: scale(0.98); }
      .jak-trigger-btn svg { width: 16px; height: 16px; flex-shrink: 0; }
      /* greenBtn is on the container: <div id="jakdelivery-login-btn" class="greenBtn"> */
      #jakdelivery-login-btn.greenBtn .jak-trigger-btn {
        background: #C3F401;
        color: #000;
      }
      #jakdelivery-login-btn.greenBtn .jak-trigger-btn:hover {
        background: #a5d600;
      }
    `;
        document.head.appendChild(s);
    }

    // ─── Button ───────────────────────────────────────────────────────────────
    function attachButton() {
        const container = document.getElementById("jakdelivery-login-btn");
        if (!container) {
            console.warn("JAK SDK: <div id='jakdelivery-login-btn'> not found in page.");
            return;
        }
        if (container.querySelector(".jak-trigger-btn")) {
            return;
        }
        _retailerCountryId = container.getAttribute("country-id") || "";
        _retailerAppKey = container.getAttribute("app-key") || container.getAttribute("AppKey") || "";

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "jak-trigger-btn";
        btn.setAttribute("aria-label", "JAK Login/Registration");
        btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
      JAK Login/Registration
    `;
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            openPopup();
        });

        container.appendChild(btn);
        console.log("JAK SDK: button ready.");
    }

    // ─── Popup Window ─────────────────────────────────────────────────────────
    function openPopup() {
        // If already open, bring it to focus
        if (_popup && !_popup.closed) {
            _popup.focus();
            return;
        }

        const country = getCountryCode();
        const params = new URLSearchParams();
        params.set("jak", "1");
        if (_retailerCountryId) {
            // Explicit name for your retailer country id (if you need to map to a hub later).
            params.set("jak_country_id", _retailerCountryId);
        }
        if (_retailerAppKey) {
            // AppKey is passed as-is (numeric expected by backend validation).
            params.set("AppKey", _retailerAppKey);
        }
        if (country) params.set("country", country);

        const url = WIDGET_URL + "?" + params.toString();

        const width = 500;
        const height = 650;
        const left = Math.round((screen.width - width) / 2);
        const top = Math.round((screen.height - height) / 2);

        _popup = window.open(
            url,
            "JAKDeliveryWidget",
            "width=" + width +
            ",height=" + height +
            ",left=" + left +
            ",top=" + top +
            ",resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,status=no"
        );

        if (!_popup) {
            console.error("JAK SDK: popup was blocked by the browser. Please allow popups for this site.");
            alert("Please allow popups for this site to JAK Login/Registration.");
            return;
        }

        // Poll to detect if user manually closes the popup
        _pollTimer = setInterval(function () {
            if (_popup && _popup.closed) {
                clearInterval(_pollTimer);
                _popup = null;
                console.log("JAK SDK: popup closed by user.");
            }
        }, 500);

        console.log("JAK SDK: popup opened →", url);
    }

    function closePopup() {
        if (_pollTimer) clearInterval(_pollTimer);
        if (_popup && !_popup.closed) _popup.close();
        _popup = null;
        console.log("JAK SDK: popup closed.");
    }

    // Single-line address for retailers (built on the retailer page from flat payload + optional nested internationalAddress).
    function mergeFullAddress(userData) {
        if (!userData || typeof userData !== "object") {
            return "";
        }
        const iaRaw = userData.internationalAddress || userData.internationaladdress || {};
        const ia = Array.isArray(iaRaw) ? (iaRaw[0] || {}) : iaRaw;
        const parts = [
            userData.street_address || userData.address1 || userData.street || ia.address1,
            userData.address2 || ia.address2,
            userData.district || ia.district,
            userData.city || userData.town || ia.city,
            userData.state || ia.state,
            userData.postal_code || userData.postal || userData.postalcode || userData.zip || userData.zipcode || ia.postalcode,
            userData.countryname_en || userData.country || ia.countryname_en || ia.country
        ];
        return parts
            .map(function (x) {
                return (x != null && String(x).trim() !== "") ? String(x).trim() : null;
            })
            .filter(function (x) {
                return x;
            })
            .join(", ");
    }

    // ─── postMessage Listener ─────────────────────────────────────────────────
    window.addEventListener("message", function (event) {
        if (event.origin !== ALLOWED_ORIGIN) return;
        const msg = event.data;
        if (!msg || msg.type !== "JAK_AUTH_SUCCESS") return;

        const raw = msg.payload && typeof msg.payload === "object" ? msg.payload : {};
        const fullAddress = (raw.fullAddress || raw.full_address || raw.fulladdress || "").trim() || mergeFullAddress(raw);
        const enriched = Object.assign({}, raw, { fullAddress: fullAddress });

        console.log("JAK SDK: auth success →", enriched);
        _userData = enriched;
        window.jakdeliveryUser = enriched;

        closePopup();
        prefillForm(enriched);
        dispatchUserEvent(enriched);
    });

    // ─── Smart Field Detection ────────────────────────────────────────────────
    function getInputAttrs(el) {
        return [
            el.id || "",
            el.name || "",
            el.className || "",
            el.placeholder || "",
            el.getAttribute("autocomplete") || "",
            el.getAttribute("aria-label") || "",
            el.getAttribute("data-field") || "",
        ];
    }

    function findField(key) {
        const inputs = Array.from(document.querySelectorAll(
            "input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]):not([type=file]), select, textarea"
        ));

        // 1st pass — autocomplete attribute (most reliable)
        const acValues = AUTOCOMPLETE_MAP[key] || [];
        const acMatch = inputs.find(function (el) {
            return acValues.indexOf((el.getAttribute("autocomplete") || "").toLowerCase()) !== -1;
        });
        if (acMatch) return acMatch;

        // 2nd pass — regex on id / name / class / placeholder / aria-label
        const patterns = FIELD_PATTERNS[key] || [];
        return inputs.find(function (el) {
            const attrs = getInputAttrs(el);
            return patterns.some(function (rx) {
                return attrs.some(function (a) { return rx.test(a); });
            });
        }) || null;
    }

    function fillField(el, value) {
        if (!el || !value) return false;
        // Handle <select> values by exact value/text match
        if (el.tagName === "SELECT") {
            let matched = false;
            const strVal = String(value).trim().toLowerCase();
            const opts = Array.from(el.options || []);
            for (let i = 0; i < opts.length; i++) {
                const v = String(opts[i].value || "").trim().toLowerCase();
                const t = String(opts[i].text || "").trim().toLowerCase();
                if (v === strVal || t === strVal) {
                    el.selectedIndex = i;
                    matched = true;
                    break;
                }
            }
            if (!matched) return false;
        } else {
            el.value = value;
        }
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.dispatchEvent(new Event("blur", { bubbles: true }));
        return true;
    }

    // ─── Prefill ──────────────────────────────────────────────────────────────
    function prefillForm(userData) {
        // console.log("[JAK SDK] Raw payload received from popup:", userData);

        const iaRaw = (userData && (userData.internationalAddress || userData.internationaladdress)) ? (userData.internationalAddress || userData.internationaladdress) : {};
        const ia = Array.isArray(iaRaw) ? (iaRaw[0] || {}) : iaRaw;
        const addrMobileVal =
            (userData.international_address_mobile || userData.address_mobile || ia.mobile || "").trim();
        const fullAddressVal = (userData.fullAddress || userData.full_address || userData.fulladdress || "").trim() || mergeFullAddress(userData);
        const dataMap = {
            name: userData.name || userData.full_name || "",
            email: userData.email || "",
            phone: userData.customer_mobile || userData.mobile || userData.phone || userData.phone_number || "",
            addressPhone: addrMobileVal,
            address: userData.street_address || userData.address1 || userData.street || ia.address1 || "",
            address2: userData.address2 || ia.address2 || "",
            city: userData.city || userData.town || ia.city || "",
            state: userData.state || ia.state || "",
            postal: userData.postal_code || userData.postalcode || userData.zip || userData.zipcode || ia.postalcode || "",
            fullAddress: fullAddressVal,
        };

        // console.log("[JAK SDK] Normalized map used for prefill:", dataMap);

        let filled = 0;
        const missed = [];

        Object.keys(dataMap).forEach(function (key) {
            const el = findField(key);
            if (el && fillField(el, dataMap[key])) {
                console.log("JAK SDK: ✓ filled [" + key + "] →", el.id || el.name || "(unnamed)");
                filled++;
            } else {
                if (dataMap[key]) missed.push(key);
            }
        });

        if (missed.length) {
            console.warn("JAK SDK: could not auto-detect fields for → [" + missed.join(", ") + "]. Full data available via jakdeliveryLoggedIn event.");
        }
        console.log("JAK SDK: prefilled " + filled + "/" + Object.keys(dataMap).length + " field(s).");
    }

    // ─── Event Dispatch ───────────────────────────────────────────────────────
    function dispatchUserEvent(userData) {
        window.dispatchEvent(new CustomEvent("jakdeliveryLoggedIn", {
            detail: userData,
            bubbles: true,
        }));
        console.log("JAK SDK: ✓ jakdeliveryLoggedIn dispatched.");
    }

    // ─── Boot ─────────────────────────────────────────────────────────────────
    function init() {
        injectStyles();
        attachButton();
        console.log("JAK SDK: ready. Country →", getCountryCode() || "not set");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    // If the container is added later (React/Vue/SPA), call jakdelivery.reinit() after it exists, or rely on this observer once.
    if (typeof MutationObserver !== "undefined" && document.documentElement) {
        var _jakObserver = new MutationObserver(function () {
            if (document.getElementById("jakdelivery-login-btn") && !document.getElementById("jakdelivery-login-btn").querySelector(".jak-trigger-btn")) {
                injectStyles();
                attachButton();
            }
        });
        _jakObserver.observe(document.documentElement, { childList: true, subtree: true });
    }

    // ─── Public API ───────────────────────────────────────────────────────────
    window.jakdelivery = {
        open: openPopup,
        close: closePopup,
        getUser: function () { return _userData; },
        reinit: init,
    };

})();