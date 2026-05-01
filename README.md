# Global Phone Validator

A lightweight, zero-dependency JavaScript library for validating, formatting, detecting, and searching phone numbers across **160+ countries**. ~3KB. No build step. No npm.

---

## What This Library Does

Global Phone Validator provides frontend-only phone number validation. It does **not** include any UI components — you build your own interface and call the library functions where needed. The library handles:

- Phone number validation by country-specific length rules
- Auto-detection of country from dial code
- Country search with initials, partial names, and dial codes
- Visual formatting of raw number strings
- Alphabetically sorted country lists

---

## Install

```html
<script src="https://cdn.jsdelivr.net/gh/art-tech-fuzion/global-phone-validator@v1.0.0/phone-core.js"></script>
```

Place this tag before the closing `</body>` tag. After loading, `PhoneCore` is available globally on `window`.

---

## How It Works

This library is a **validation engine only**. You create the UI (input fields, dropdowns, error messages) and connect them to the library's methods. The validation flow is:

1. User types a phone number in your input field
2. You call `PhoneCore.validate(number, country)` with the value and a selected country object
3. The library strips all non-digit characters, checks the digit count against the country's `min` and `max` rules, and returns a result object
4. You display the result in your UI

---

## Complete UI Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Phone Validator</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 480px; margin: 2rem auto; padding: 0 1rem; }
    label { display: block; margin-bottom: 0.25rem; font-weight: 500; }
    select, input { width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
    input.valid { border-color: #16a34a; }
    input.invalid { border-color: #dc2626; }
    #error { font-size: 0.875rem; min-height: 1.25rem; }
    #error.valid { color: #16a34a; }
    #error.invalid { color: #dc2626; }
  </style>
</head>
<body>
  <h2>Phone Number Validator</h2>

  <label for="countrySearch">Search Country</label>
  <input type="text" id="countrySearch" placeholder="Type country name, initials, or code...">

  <label for="countrySelect">Select Country</label>
  <select id="countrySelect"></select>

  <label for="phoneInput">Phone Number</label>
  <input type="tel" id="phoneInput" placeholder="Enter phone number">

  <p id="error"></p>

  <script src="https://cdn.jsdelivr.net/gh/art-tech-fuzion/global-phone-validator@v1.0.0/phone-core.js"></script>
  <script>
    const searchInput = document.getElementById("countrySearch");
    const select = document.getElementById("countrySelect");
    const phoneInput = document.getElementById("phoneInput");
    const errorEl = document.getElementById("error");

    // Populate dropdown with sorted countries
    function populateDropdown(countries) {
      select.innerHTML = "";
      countries.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.code;
        opt.textContent = `${c.flag} ${c.name} (${c.code})`;
        select.appendChild(opt);
      });
    }

    // Initial load
    populateDropdown(PhoneCore.getCountriesSorted());

    // Search on input
    searchInput.addEventListener("input", function () {
      const results = PhoneCore.searchCountries(this.value);
      populateDropdown(results);
    });

    // Validate on every keystroke
    phoneInput.addEventListener("input", function () {
      const selectedCode = select.value;
      const country = PhoneCore.findCountry(selectedCode);
      const result = PhoneCore.validate(this.value, country);

      if (result.valid) {
        this.classList.remove("invalid");
        this.classList.add("valid");
        errorEl.textContent = `Valid — ${PhoneCore.format(this.value)}`;
        errorEl.className = "valid";
      } else {
        this.classList.remove("valid");
        this.classList.add("invalid");
        errorEl.textContent = result.error;
        errorEl.className = "invalid";
      }
    });

    // Auto-detect country when user pastes a full number
    phoneInput.addEventListener("paste", function () {
      setTimeout(() => {
        const detected = PhoneCore.detectCountry(this.value);
        if (detected) {
          select.value = detected.code;
          searchInput.value = detected.name;
          populateDropdown(PhoneCore.getCountriesSorted());
          select.value = detected.code;
          phoneInput.dispatchEvent(new Event("input"));
        }
      }, 0);
    });
  </script>
</body>
</html>
```

---

## API Reference

### `PhoneCore.getCountries()`

Returns the raw array of all 160+ country objects in the order they are defined in the source file.

```js
const all = PhoneCore.getCountries();
// [{ name: "India", code: "+91", flag: "🇮🇳", min: 10, max: 10 }, ...]
```

### `PhoneCore.getCountriesSorted()`

Returns a new array of all countries sorted alphabetically by name. The original array is not mutated.

```js
const sorted = PhoneCore.getCountriesSorted();
// [{ name: "Afghanistan", ... }, { name: "Albania", ... }, ...]
```

### `PhoneCore.searchCountries(query)`

Filters countries based on a search string. Supports:

- **Name match** — `"india"` matches India
- **Dial code match** — `"+91"` matches India
- **Initials match** — `"us"` matches United States, `"sa"` matches South Africa
- **Multi-word partial match** — `"unit sta"` matches United States

Returns a sorted array of matching countries. Returns all sorted countries if query is empty.

```js
PhoneCore.searchCountries("us");
// [{ name: "United States", code: "+1", ... }, { name: "Uganda", code: "+256", ... }, ...]

PhoneCore.searchCountries("+44");
// [{ name: "United Kingdom", code: "+44", ... }]

PhoneCore.searchCountries("");
// Returns all countries sorted alphabetically
```

### `PhoneCore.findCountry(code)`

Finds a country by its exact dial code. Returns the country object or `undefined`.

```js
const india = PhoneCore.findCountry("+91");
// { name: "India", code: "+91", flag: "🇮🇳", min: 10, max: 10 }

const missing = PhoneCore.findCountry("+000");
// undefined
```

### `PhoneCore.detectCountry(number)`

Auto-detects the country by reading the dial code prefix from a full phone number. Strips non-digits internally, then matches against the country list from longest dial code to shortest.

```js
PhoneCore.detectCountry("+919876543210");
// { name: "India", code: "+91", flag: "🇮🇳", min: 10, max: 10 }

PhoneCore.detectCountry("1234567890");
// undefined (no matching dial code prefix)
```

### `PhoneCore.validate(number, country)`

Validates a phone number against a country's length rules. Strips all non-digit characters before checking.

```js
const india = PhoneCore.findCountry("+91");

PhoneCore.validate("9876543210", india);
// { valid: true, error: null }

PhoneCore.validate("98765", india);
// { valid: false, error: "Too short" }

PhoneCore.validate("98765432101234", india);
// { valid: false, error: "Too long" }

PhoneCore.validate("9876543210", null);
// { valid: false, error: "No country selected" }
```

**Return object:**

| Field | Type | Description |
|-------|------|-------------|
| `valid` | `boolean` | `true` if the number passes all checks |
| `error` | `string \| null` | Error message when invalid, `null` when valid |

**Possible errors:**
- `"No country selected"` — country argument is `null` or `undefined`
- `"Too short"` — digit count is below the country's `min`
- `"Too long"` — digit count exceeds the country's `max`

### `PhoneCore.format(number)`

Formats a raw number string into grouped digits separated by spaces. Strips all non-digits first.

```js
PhoneCore.format("9876543210");
// "987 654 3210"

PhoneCore.format("+91-987-654-3210");
// "987 654 3210"

PhoneCore.format("12345");
// "123 45"
```

---

## Country Object Structure

Each country in the library is represented as:

```js
{
  name: "India",
  code: "+91",
  flag: "🇮🇳",
  min: 10,
  max: 10
}
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Full country name |
| `code` | `string` | International dial code with `+` prefix |
| `flag` | `string` | Emoji flag |
| `min` | `number` | Minimum valid digit count (excluding dial code) |
| `max` | `number` | Maximum valid digit count (excluding dial code) |

---

## Country Not Listed?

### Option 1: Request a Country

Email **arttechfussion@gmail.com** with:
- Country name
- Dial code
- Valid number length range

The team will include it in the next release.

### Option 2: Add It Yourself

Download `phone-core.js` directly from the repository and use it locally:

1. Download the file
2. Open it and find the `countries` array
3. Add your country object following the structure above
4. Reference the local file instead of the CDN:

```html
<script src="./phone-core.js"></script>
```

All `PhoneCore` methods work identically. No build step or configuration needed.

---

## Advantages

- Zero dependencies — no npm, no bundler, no build tools
- ~3KB total — loads instantly
- 160+ countries across all regions out of the box
- Search by name, initials, dial code, or partial match
- Auto-detect country from pasted numbers
- Drop-in validation — just call `PhoneCore.validate()`
- Easy to extend — add countries by editing one array

---

## Disadvantages

- No UI included — you must build your own interface
- CDN depends on this repository remaining public
- Length-only validation — no regex or carrier-level checks
- Format method uses fixed grouping (3-3-remaining) — not country-specific
- Frontend only — server-side validation is still required for security
- Global `window.PhoneCore` — potential namespace collision if another library uses the same name

---

## Versioning

This library follows **Semantic Versioning** (`MAJOR.MINOR.PATCH`):

```
v1.0.0
│ │ │
│ │ └── PATCH — Bug fixes only. Safe to upgrade.
│ └──── MINOR — New countries, methods, or features. No breaking changes. Safe to upgrade.
└────── MAJOR — Breaking API changes. Method names, signatures, or return types may change.
```

| Version Change | What Changed | Action Required |
|----------------|-------------|-----------------|
| `v1.0.0` → `v1.0.1` | Bug fix | None — drop-in replacement |
| `v1.0.0` → `v1.1.0` | New countries or methods added | None — existing code works unchanged |
| `v1.0.0` → `v2.0.0` | Breaking changes | Read changelog and update your code before upgrading |

Always pin to a specific version in production (`@v1.0.0`). Using `@main` or `@latest` may load untested changes that break your validation.

---

## License

See [LICENSE](LICENSE).
