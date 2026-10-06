# Positioning rewrite: review notes (6 October 2026)

Branch `positioning-rewrite`. Not merged and not published: GitHub Pages builds only from `main`.

## Major positioning changes

1. **From product to diagnosis.** The old site sold a "managed AI operating partner". The new site sells making the business less dependent on the owner. Agents are one possible outcome, not the offer. The core line on every page is "We audit the business for leverage, not for AI."
2. **Homepage restructured** around the approved draft: hero, problem, approach, the six questions, the four stage process, the handover example, where agents fit, FAQ and the final CTA. Removed: the operating partner responsibility table, the "measure is what comes off your plate" ledger, the fit list and the guide panel. Their content now lives on How It Works, Standards and the guide.
3. **One CTA everywhere.** "Discuss a workflow" is used on every page button and on the Talk form title. The nav item stays "Let’s talk" to keep the existing navigation unchanged.
4. **How It Works** now covers the four stages (understand, redesign, implement, check), the decision guide (eliminate, simplify, standardize, delegate, automate, agents) and a ladder that separates the first conversation from the assessment, the pilot and ongoing management. The example gains a seventh step, "Choosing the fix". The responsibility table separates diagnosis, decision, implementation and management.
5. **Managed agents guide reordered.** The handover example now comes first and the Anthropic/hosting distinction has moved down to section 5. Two sections are new: "When is an agent the right choice?" (which includes when a simpler approach wins) and "Is it worth it?" (value after oversight, corrections and running costs).
6. **Standards** gained three principles: "Choose the simplest approach that works", "Plan for exceptions and failures" and "Monitor the running workflow". There are now 9. All existing safeguards are kept, and so is the "not a guarantee of error-free operation" banner.
7. **Talk** explains what the first discussion covers and says plainly that it is not an audit or a commitment to a solution. The form fields are unchanged (name, email, business, example), and the hint now asks for the trigger, the people involved and where the workflow stalls.
8. **Interactive example** is unchanged apart from two lines. The completion check is now "whoever owns the check, a person, an automation or an agent" instead of "the agent".
9. Footer tagline on all six pages: "We help owners make their business less dependent on them." / "We audit the business for leverage, not for AI."

## Removed on review (6 October 2026)

- All design-partner language.
- All real estate references (homepage section, FAQ, guide).
- The founder section and the footer link to it. The owner's name appears nowhere on the site.
- The "who implements" row in the responsibility table.

## Still to confirm

- Commercial terms: pricing and the structure of the assessment, pilot and management are deliberately left out. Nothing was invented.

## Launch dependencies (unchanged from README)

- The enquiry form is demonstration-only, with an empty `data-endpoint`. Nothing is sent.
- A privacy notice is needed before the form is connected.
- `noindex` and robots.txt still block indexing. Keep them until launch.
- The legal identity shown on the site is still to be confirmed.
- DNS for wemanageagents.com is not pointed.
- **Visibility.** The repo is public and the current `main` is already live at andrewpcherry.github.io/wemanageagents/.

## Not present

- There is no workshop page or section on the site, so no workshop copy was added.
