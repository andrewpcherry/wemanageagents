# We Manage Agents: website

Five-page authority site for wemanageagents.com. Built 15 September 2026 from the Codex copy package (`02-website-copy.md`) and Claude Code handoff (`03-claude-code-handoff.md`).

**Status: preview. Not published.** Indexing is blocked and the enquiry form is not connected.

## Structure

Plain static HTML, one shared stylesheet and one deferred script. No build step, no framework, no web fonts, no third-party requests.

| Route | File |
|---|---|
| `/` | `index.html` |
| `/how-it-works` | `how-it-works/index.html` (anchors `#example`, `#setup`, `#about`) |
| `/managed-agents` | `managed-agents/index.html` |
| `/standards` | `standards/index.html` (anchor `#value-review`) |
| `/talk` | `talk/index.html` |
| 404 | `404.html` |

`assets/site.css` holds the design tokens at the top. `assets/site.js` handles the mobile menu, the illustrative handover example, the worksheet print button, the guide contents highlight and the enquiry form. Every page reads completely without JavaScript.

Copy lives directly in the HTML. Edit the text in place. Header and footer are repeated in each page, so a navigation change touches all six files.

Any static host that maps `/how-it-works` to `how-it-works/index.html` works (GitHub Pages, Netlify, Cloudflare Pages, Vercel).

## Enquiry form contract

The form is in preview mode while `data-endpoint` on the `<form>` in `talk/index.html` is empty. In preview mode it validates, keeps the input and says nothing was sent. It makes no network request.

To connect it, set `data-endpoint` to a destination that:

1. Accepts `POST` JSON `{name, email, business, example, website, idempotency_key}` plus an `Idempotency-Key` header. `website` is a honeypot; drop submissions where it is filled.
2. Returns `{"received": true}` with a 2xx status **only after the enquiry is durably stored or delivered**.
3. Returns `{"received": false}` when it knows the enquiry was not stored.
4. Treats a repeated `idempotency_key` as the same enquiry (retries after an unknown result reuse the key).

Anything else (timeout, network error, non-JSON body) shows the "couldn't confirm" message. The success panel only appears on an explicit `received: true`. Once connected, send one clearly labelled test enquiry and confirm it arrives in the real destination before relying on it.

## Before publication

- [ ] Remove `<meta name="robots" content="noindex, nofollow">` from the five pages and replace `robots.txt` with the version in its comment.
- [ ] Connect and end-to-end test the enquiry destination (contract above).
- [ ] Write a privacy notice from the actual processing facts and add it to the footer and the form. No legal link exists yet on purpose.
- [ ] Confirm the legal identity to show on the site.
- [ ] Andrew reviews the founder statement on `/how-it-works#about`, the development-stage wording and the proposed standards.
- [ ] Decide on author/date attribution for the guide; none is shown because no review has happened yet.
- [ ] Point DNS for wemanageagents.com at the chosen host.
- [ ] Measure Core Web Vitals on the deployed site.

## Deliberate departures from the copy file

- Em dashes in body copy and page titles replaced with commas or a vertical bar (house style). Meaning unchanged.
- Small interface labels added where the copy file had none: "Needs attention", "Handover picture", "To: Operations lead", "Save example message", "Cancel", "Handover requirement open/confirmed", "Contents", "From the founder", "A guide for business owners", section index numbers, and a "Review the decision" return button in the held state.
- Home stage one shows a compact handover picture (scope signed, kickoff Thursday, delivery lead not confirmed) so the missing confirmation is visible without opening the sources.
