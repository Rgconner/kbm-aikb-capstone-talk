// Inline SVG diagrams, keyed by id, injected into topic detail panes.
// Each diagram exposes clickable hotspots (class="diag-hot") with a
// data-detail-key used to look up the caption shown below the figure.

const DIAGRAMS = {
  kbmArchitecture: {
    caption: "KanBanMan owns no data of its own — it borrows the host app's database. Click a piece.",
    svg: `
<svg viewBox="0 0 720 260" role="img" aria-label="KanBanMan sits between a host page and the host app's own database, storing nothing itself">
  <defs>
    <marker id="arrK" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <polygon points="0,0 7,3 0,6" fill="currentColor"/>
    </marker>
  </defs>
  <g class="diag-hot" data-detail-key="host">
    <rect x="20" y="90" width="160" height="80" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <text x="100" y="124" text-anchor="middle" font-size="13" fill="currentColor">Host page</text>
    <text x="100" y="142" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">widget.js</text>
  </g>
  <g class="diag-hot" data-detail-key="api">
    <rect x="280" y="90" width="160" height="80" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <text x="360" y="118" text-anchor="middle" font-size="13" fill="currentColor">KanBanMan</text>
    <text x="360" y="136" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">FastAPI, no DB</text>
    <text x="360" y="152" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">of its own</text>
  </g>
  <g class="diag-hot" data-detail-key="db">
    <rect x="540" y="90" width="160" height="80" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <text x="620" y="124" text-anchor="middle" font-size="13" fill="currentColor">Host app's DB</text>
    <text x="620" y="142" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">KANBAN_DB_URL</text>
  </g>
  <line x1="180" y1="120" x2="278" y2="120" stroke="currentColor" stroke-width="1.5" marker-end="url(#arrK)"/>
  <text x="229" y="108" text-anchor="middle" font-size="11" fill="currentColor">GET columns, cards</text>
  <line x1="278" y1="140" x2="180" y2="140" stroke="currentColor" stroke-width="1.5" marker-end="url(#arrK)"/>
  <text x="229" y="158" text-anchor="middle" font-size="11" fill="currentColor">PATCH on pin/move</text>
  <line x1="440" y1="130" x2="538" y2="130" stroke="currentColor" stroke-width="1.5" marker-end="url(#arrK)"/>
  <text x="489" y="118" text-anchor="middle" font-size="11" fill="currentColor">reads/writes</text>
  <text x="360" y="40" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.75">Unset KANBAN_DB_URL &rarr; every data endpoint returns a clean 503, container still boots</text>
  <g class="diag-hot" data-detail-key="drilldown">
    <rect x="20" y="200" width="420" height="40" rx="4" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3"/>
    <text x="230" y="224" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.85">Drill-down / menu tree walk happens entirely inside the host page, client-side</text>
  </g>
</svg>`,
    details: {
      host: "The host page mounts the widget with KanBanMan.mount({menuEl, workEl, apiBase, board, onNavigate}). All rendering and the entire drill-down tree-walk happen here, client-side, against data already fetched.",
      api: "A single FastAPI app (~250 lines). Validates requests (e.g. rejects parent_id on a task card with a 422), but persists nothing locally &mdash; every read and write passes through to whichever database the host configured.",
      db: "This is the host application's own database &mdash; the same one WheresDat (or any other consumer) already uses for its own tables. KanBanMan's tables just live alongside them.",
      drilldown: "The widget fetches the full card set once per mount, then walks the parent_id tree and re-renders locally as the user drills into menu cards &mdash; no additional API round-trip per level.",
    },
  },

  kbmCardModel: {
    caption: "The Card model has 11 fields plus tags. Click one to see if — and how — it actually reaches the screen.",
    svg: `
<svg viewBox="0 0 760 300" role="img" aria-label="Card fields split between what renders on the card face and what is carried but never shown">
  <text x="190" y="30" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">Rendered on the card</text>
  <text x="570" y="30" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor" opacity="0.7">Carried, never rendered</text>
  <line x1="380" y1="10" x2="380" y2="290" stroke="currentColor" stroke-width="1" stroke-dasharray="2 4" opacity="0.4"/>

  <g class="diag-hot" data-detail-key="title"><rect x="60" y="50" width="260" height="42" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="190" y="76" text-anchor="middle" font-size="13" fill="currentColor">title &rarr; literal text</text></g>
  <g class="diag-hot" data-detail-key="pinned"><rect x="60" y="104" width="260" height="42" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="190" y="130" text-anchor="middle" font-size="13" fill="currentColor">pinned &rarr; &#9733; icon</text></g>
  <g class="diag-hot" data-detail-key="column"><rect x="60" y="158" width="260" height="42" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="190" y="184" text-anchor="middle" font-size="13" fill="currentColor">column &rarr; header only</text></g>

  <g class="diag-hot" data-detail-key="id"><rect x="410" y="46" width="150" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1" opacity="0.75"/><text x="485" y="66" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.85">id</text></g>
  <g class="diag-hot" data-detail-key="board"><rect x="570" y="46" width="150" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1" opacity="0.75"/><text x="645" y="66" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.85">board</text></g>
  <g class="diag-hot" data-detail-key="card_type"><rect x="410" y="82" width="150" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1" opacity="0.75"/><text x="485" y="102" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.85">card_type</text></g>
  <g class="diag-hot" data-detail-key="order"><rect x="570" y="82" width="150" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1" opacity="0.75"/><text x="645" y="102" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.85">order</text></g>
  <g class="diag-hot" data-detail-key="target"><rect x="410" y="118" width="150" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1" opacity="0.75"/><text x="485" y="138" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.85">target</text></g>
  <g class="diag-hot" data-detail-key="parent_id"><rect x="570" y="118" width="150" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1" opacity="0.75"/><text x="645" y="138" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.85">parent_id</text></g>
  <g class="diag-hot" data-detail-key="description"><rect x="410" y="154" width="150" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1" opacity="0.75"/><text x="485" y="174" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.85">description</text></g>
  <g class="diag-hot" data-detail-key="desk"><rect x="570" y="154" width="150" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1" opacity="0.75"/><text x="645" y="174" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.85">desk</text></g>
  <g class="diag-hot" data-detail-key="tags"><rect x="410" y="190" width="150" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1" opacity="0.75"/><text x="485" y="210" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.85">tags</text></g>
  <g class="diag-hot" data-detail-key="timestamps"><rect x="570" y="190" width="150" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1" opacity="0.75"/><text x="645" y="210" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.85">created/updated_at</text></g>

  <text x="190" y="250" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">3 of 12 fields</text>
  <text x="570" y="250" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">9 of 12 fields</text>
</svg>`,
    details: {
      title: "The only field rendered as literal, readable text inside a card, in both the menu and task renderers.",
      pinned: "Rendered, but as a toggle-able &#9733;/&#9734; icon &mdash; never printed as the word 'pinned'.",
      column: "Appears only as the shared header label for the whole column a card sits in, never repeated per-card.",
      id: "Internal UUID primary key. Used for API calls and DOM bookkeeping only.",
      board: "Scopes which board a card belongs to, used for API routing/filtering &mdash; never shown.",
      card_type: "menu or task. Drives which render function runs and sets a data-card-type CSS attribute (a subtle left-border color) &mdash; never printed as text.",
      order: "A float sort key used server-side. No UI currently lets a user see or directly manipulate it.",
      target: "A routing pointer for the host app's own onNavigate callback. Never shown to the end user.",
      parent_id: "Drives the menu drill-down tree. Its only visible trace is a '&rsaquo;' suffix appended to a menu card's title when it has children.",
      description: "Present in the schema and full CRUD API. The widget's rendering code never reads it.",
      desk: "An opaque JSON blob for a 'Decision Desk' the host page is expected to render. KanBanMan stores and returns it without ever interpreting it.",
      tags: "Multi-valued, filterable at the database layer via query params. Native to the engine &mdash; but the widget itself never draws a tag chip.",
      timestamps: "Standard audit timestamps. Never surfaced in the UI.",
    },
  },

  aikbReconcile: {
    caption: "Two independent schemas, reconciled by a human, not by either AI unilaterally.",
    svg: `
<svg viewBox="0 0 700 260" role="img" aria-label="Claude and Bob design schemas independently, then a human arbitrates the merge">
  <defs><marker id="arrR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><polygon points="0,0 7,3 0,6" fill="currentColor"/></marker></defs>
  <g class="diag-hot" data-detail-key="claude">
    <rect x="20" y="30" width="200" height="70" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <text x="120" y="58" text-anchor="middle" font-size="13" fill="currentColor">Claude's schema</text>
    <text x="120" y="76" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">tags, flat dimension_order</text>
  </g>
  <g class="diag-hot" data-detail-key="bob">
    <rect x="20" y="150" width="200" height="70" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <text x="120" y="178" text-anchor="middle" font-size="13" fill="currentColor">Bob's schema</text>
    <text x="120" y="196" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">+ personas, entry paths</text>
  </g>
  <line x1="220" y1="65" x2="330" y2="120" stroke="currentColor" stroke-width="1.5" marker-end="url(#arrR)"/>
  <line x1="220" y1="185" x2="330" y2="130" stroke="currentColor" stroke-width="1.5" marker-end="url(#arrR)"/>
  <g class="diag-hot" data-detail-key="board">
    <rect x="335" y="95" width="180" height="60" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <text x="425" y="120" text-anchor="middle" font-size="13" fill="currentColor">AIKB board</text>
    <text x="425" y="138" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">both posted, neither merged</text>
  </g>
  <line x1="515" y1="125" x2="600" y2="125" stroke="currentColor" stroke-width="1.5" marker-end="url(#arrR)"/>
  <g class="diag-hot" data-detail-key="russ">
    <rect x="600" y="95" width="90" height="60" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
    <text x="645" y="120" text-anchor="middle" font-size="13" fill="currentColor">Russ</text>
    <text x="645" y="138" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.7">arbitrates</text>
  </g>
</svg>`,
    details: {
      claude: "Minimal, general shape: multi-valued tag dict, human-readable IDs, a single flat dimension_order. No concept of role-based views.",
      bob: "Everything Claude's had, plus personas &mdash; named viewpoints (CISO, regional CISO, analyst) each with their own entry_path, dimension_order override, and action set.",
      board: "Both schemas posted to the same card as data, side by side, before either was implemented further &mdash; the comparison itself became the artifact.",
      russ: "Resolved the one real open question: not whose schema wins, but how the pieces compose &mdash; separate files for card data vs. persona config, bundled only at build time.",
    },
  },

  aikbAttribution: {
    caption: "A reserved title prefix, used by the wrong agent, produced a false belief — and exposed a real gap.",
    svg: `
<svg viewBox="0 0 700 220" role="img" aria-label="Claude uses Bob's reserved naming prefix, Bob believes he wrote the card, forensic timestamp matching finds the truth and a missing attribution field">
  <defs><marker id="arrA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><polygon points="0,0 7,3 0,6" fill="currentColor"/></marker></defs>
  <g class="diag-hot" data-detail-key="post">
    <rect x="10" y="20" width="170" height="60" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <text x="95" y="45" text-anchor="middle" font-size="12.5" fill="currentColor">Claude posts card</text>
    <text x="95" y="63" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">titled REVIEW-NNN...</text>
  </g>
  <line x1="180" y1="50" x2="255" y2="50" stroke="currentColor" stroke-width="1.5" marker-end="url(#arrA)"/>
  <g class="diag-hot" data-detail-key="collision">
    <rect x="260" y="20" width="180" height="60" rx="4" fill="var(--wart-wash)" stroke="var(--wart)" stroke-width="1.5"/>
    <text x="350" y="45" text-anchor="middle" font-size="12.5" fill="currentColor">Prefix reserved for Bob</text>
    <text x="350" y="63" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.75">no author field yet</text>
  </g>
  <line x1="440" y1="50" x2="515" y2="50" stroke="currentColor" stroke-width="1.5" marker-end="url(#arrA)"/>
  <g class="diag-hot" data-detail-key="belief">
    <rect x="520" y="20" width="170" height="60" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <text x="605" y="45" text-anchor="middle" font-size="12.5" fill="currentColor">Bob reads card</text>
    <text x="605" y="63" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">believes he wrote it</text>
  </g>
  <line x1="350" y1="80" x2="350" y2="130" stroke="currentColor" stroke-width="1.5" marker-end="url(#arrA)"/>
  <g class="diag-hot" data-detail-key="forensics">
    <rect x="185" y="135" width="330" height="60" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <text x="350" y="160" text-anchor="middle" font-size="12.5" fill="currentColor">Forensic trace: caller last_used_at vs. card created_at</text>
    <text x="350" y="178" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">surfaces a real missing-attribution bug</text>
  </g>
</svg>`,
    details: {
      post: "Author: Claude. Title used the REVIEW-NNN prefix that the aikb-review convention card had already reserved for Bob's use.",
      collision: "At the time, cards carried no explicit author field distinguishing who actually wrote them &mdash; only the title convention signaled authorship.",
      belief: "With the convention broken and no author field to fall back on, Bob had no way to tell the card wasn't his &mdash; a completely reasonable inference from the information available to him.",
      forensics: "Resolving it required matching which caller's session activity lined up with the card's creation timestamp. That investigation is what proved the board needed an explicit author field &mdash; which shipped shortly after as card mutation attribution.",
    },
  },
};
