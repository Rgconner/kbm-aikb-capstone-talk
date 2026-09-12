// Content data for the KBM & AIKB capstone talk companion.
// Plain data, rendered by app.js. Edit prose here without touching layout code.

const SECTIONS = [
  {
    id: "kbm",
    label: "KanBanMan Engine",
    dek: "What the engine actually does, and doesn't",
    topics: [
      {
        id: "kbm-origin",
        eyebrow: "Origin",
        title: "Why generalize a kanban board into an engine",
        dek: "One board, built three times, before anyone noticed",
        body: `
          <p>KanBanMan started as WheresDat's own task board, then got pulled out into a
          standalone engine. The reason wasn't speculative reuse &mdash; it was already
          happening. <strong>ops-flow</strong> and <strong>AIKB</strong> had each independently
          built their own kanban system, from scratch, for the same basic need: cards, columns,
          drag-between-them status. Three implementations of the same idea, built by not
          noticing the other two existed.</p>
          <p>KanBanMan is the fix: one small FastAPI service that any app can mount a board
          against, instead of every project re-solving "cards on columns" on its own.
          WheresDat became the first real consumer, not a design exercise.</p>
        `,
      },
      {
        id: "kbm-architecture",
        eyebrow: "Architecture",
        title: "A sidecar with no database of its own",
        dek: "KanBanMan stores nothing. It borrows your database.",
        diagram: "kbmArchitecture",
        body: `
          <p>The engine is deliberately thin: a single FastAPI app, a SQLAlchemy model, and a
          plain vanilla-JS/CSS widget &mdash; no framework, no build step. The interesting
          decision is what it <em>doesn't</em> own: <strong>KanBanMan has no database of its
          own.</strong> It's configured with a <code>KANBAN_DB_URL</code> pointing at a
          connection string inside the <em>consuming app's</em> own database. Unset that
          variable and the container still boots &mdash; every data endpoint just returns a
          clean 503 instead of crashing.</p>
          <p>The widget does two fetches per mount (columns, then cards) and does every
          subsequent drill-down client-side against that one payload &mdash; no extra network
          round-trip per menu level. Click a component in the diagram to see what crosses each
          boundary.</p>
        `,
      },
      {
        id: "kbm-card-model",
        eyebrow: "Data model",
        title: "What's actually visible on a card",
        dek: "One field renders as text. Everything else is carried, not shown.",
        diagram: "kbmCardModel",
        body: `
          <p>This is the part worth being honest about in front of a room that's about to read
          the source: the <code>Card</code> model has eleven real fields plus a computed
          <code>tags</code> property. Exactly one of them &mdash; <code>title</code> &mdash;
          is rendered as literal text on a card. <code>pinned</code> shows up, but only as a
          &#9733;/&#9734; icon. <code>column</code> only appears as the header label for the
          whole column, never per-card.</p>
          <p>Everything else in the table below exists in the schema, the database, and the
          REST API &mdash; and has <strong>zero rendering code</strong> in the widget.</p>
          <div class="tbl-wrap">
          <table>
            <thead><tr><th>Field</th><th>Type</th><th>On the card face?</th></tr></thead>
            <tbody>
              <tr><td class="field-name">title</td><td class="mono">string</td><td class="tag-yes">Yes &mdash; the only rendered text</td></tr>
              <tr><td class="field-name">pinned</td><td class="mono">bool</td><td class="tag-yes">Yes &mdash; as a star icon, not text</td></tr>
              <tr><td class="field-name">column</td><td class="mono">string</td><td class="tag-yes">Indirectly &mdash; column header only</td></tr>
              <tr><td class="field-name">id</td><td class="mono">uuid</td><td class="tag-no">No &mdash; API/DOM bookkeeping</td></tr>
              <tr><td class="field-name">board</td><td class="mono">string</td><td class="tag-no">No &mdash; API routing scope</td></tr>
              <tr><td class="field-name">card_type</td><td class="mono">menu | task</td><td class="tag-no">No &mdash; sets a CSS attribute only</td></tr>
              <tr><td class="field-name">order</td><td class="mono">float</td><td class="tag-no">No &mdash; server-side sort key</td></tr>
              <tr><td class="field-name">target</td><td class="mono">string?</td><td class="tag-no">No &mdash; host-app routing pointer</td></tr>
              <tr><td class="field-name">parent_id</td><td class="mono">uuid?</td><td class="tag-no">No &mdash; only a "&rsaquo;" suffix hints at children</td></tr>
              <tr><td class="field-name">description</td><td class="mono">string?</td><td class="tag-no">No &mdash; in the API, unused by the widget</td></tr>
              <tr><td class="field-name">desk</td><td class="mono">json?</td><td class="tag-no">No &mdash; opaque payload for a host renderer</td></tr>
              <tr><td class="field-name">tags</td><td class="mono">dict&lt;str,list&gt;</td><td class="tag-no">No &mdash; native &amp; filterable, but not drawn</td></tr>
              <tr><td class="field-name">created_at / updated_at</td><td class="mono">datetime</td><td class="tag-no">No &mdash; never displayed</td></tr>
            </tbody>
          </table>
          </div>
          <div class="callout">
            <span class="callout-label">Worth calling out by name</span>
            <code>desk</code> is a deliberate design choice, not an oversight &mdash; a comment
            in the model literally says KanBanMan never interprets it, just carries it for
            whatever host renderer wants to execute it. The engine is drawing a hard line
            between "generic board mechanics" and "what a specific app does with a card,"
            and refusing to blur it.
          </div>
        `,
      },
      {
        id: "kbm-tags",
        eyebrow: "Correction worth making",
        title: "Tags are native. Tag-driven columns are not.",
        dek: "A distinction that matters if you're deciding what to build on top",
        body: `
          <p>Multi-valued tags (<code>{"geo": ["EU","APAC"]}</code>) are first-class in the
          engine &mdash; a normalized junction table, filterable at the database layer via
          query params. That part is real and native.</p>
          <p>What is <em>not</em> native: generating board columns dynamically from tag values
          &mdash; one column per severity level, say. <code>column</code> is a flat string set
          at write time. A demo board built on KanBanMan can absolutely derive columns from
          tag variance client-side &mdash; and one has &mdash; but that logic lives in the
          host page, not the engine. It's the same discipline as <code>desk</code>: the engine
          gives you a well-shaped primitive and refuses to guess what you'll do with it.</p>
        `,
      },
      {
        id: "kbm-honesty",
        eyebrow: "No sales pitch",
        title: "What isn't built yet",
        dek: "The parts a demo won't show you",
        body: `
          <p>In the engine's own design notes, in plain language:</p>
          <ul>
            <li>No auth or multi-tenant story yet &mdash; anyone who can reach the API can
            read and write any board.</li>
            <li>No real drag-and-drop reorder semantics &mdash; <code>order</code> exists as
            a field, the interaction to change it isn't built.</li>
            <li>Only actually run against SQLite so far. Postgres is a configuration option
            that has not been exercised.</li>
          </ul>
          <p>None of these are fatal &mdash; they're exactly the kind of gap you'd expect in
          an engine that's had one real consumer for a few weeks. Listing them here on purpose:
          an honest architecture talk names its own unfinished edges instead of demoing around
          them.</p>
        `,
      },
    ],
  },
  {
    id: "aikb",
    label: "AIKB Case Study",
    dek: "Two AIs, one shared board, one human arbitrating",
    topics: [
      {
        id: "aikb-setup",
        eyebrow: "Setup",
        title: "Same problem, given to two AIs, on purpose",
        dek: "Independently, before either saw the other's answer",
        body: `
          <p>Both KanBanMan and its host, WheresDat, needed a way to package a demo board as
          one shareable file. Russ was also working with <strong>Bob</strong> &mdash; a
          separate AI, on a separate machine, working the IBM side of the same demo &mdash;
          who was building a parallel version using watsonx Orchestrate to generate the seed
          data.</p>
          <p>Rather than have one AI design it and the other simply consume the result, Russ
          asked for both of us to propose a JSON schema for the same demo board
          <em>independently</em> &mdash; neither seeing the other's draft &mdash; and post the
          result to a shared card on AIKB, a knowledge board built specifically so AI agents on
          different machines and different projects can hand work to each other with a human
          arbitrating the merge.</p>
        `,
      },
      {
        id: "aikb-wart-racing",
        eyebrow: "Wart",
        title: "Both of us started coding before anyone had signed off",
        dek: "Independent work is fast. That's also the risk.",
        body: `
          <p>The first real friction wasn't a disagreement between the two schemas &mdash; it
          was that <strong>both agents started writing code before Russ had digested either
          design.</strong> Two AIs working in parallel move fast enough that a human reviewing
          asynchronously can fall behind his own project. Russ had to explicitly stop both
          threads and ask for the schema itself, in writing, before either of us touched
          implementation further.</p>
          <p>This is the least flattering fact in this whole case study, and the most
          important one: parallelism between AI agents doesn't wait for oversight to catch up
          unless a human actively builds in the pause. AIKB gave Russ a place to catch it &mdash;
          a chat transcript scrolling past in two windows would not have.</p>
        `,
      },
      {
        id: "aikb-reconcile",
        eyebrow: "Reconciliation",
        title: "Where two independent designs agreed, and where they didn't",
        dek: "Convergence is evidence. Divergence is coverage.",
        diagram: "aikbReconcile",
        body: `
          <p>Once both schemas were actually on the table, the comparison was more useful than
          either draft alone:</p>
          <ul>
            <li><strong>Converged independently</strong> &mdash; multi-valued tags as a dict,
            human-readable IDs instead of opaque codes, a flat <code>dimension_order</code>
            list. Neither of us saw the other's draft first, so agreement here is a real signal,
            not an artifact of one AI copying the other.</li>
            <li><strong>Only in Bob's version</strong> &mdash; <em>personas</em>: named
            viewpoints (CISO, regional CISO, security analyst) each with their own entry point,
            dimension ordering, and available actions. My schema didn't attempt role-based
            views at all. This is the part a single-AI design would have simply missed.</li>
          </ul>
          <p>Russ arbitrated the one real open question &mdash; not "whose schema wins," but
          how the two pieces should compose. Decision: card data and persona config live in
          separate files, bundled together only at build time, because they change at different
          rates and get reused independently. That's a product decision neither AI should have
          made unilaterally, and neither of us did.</p>
        `,
      },
      {
        id: "aikb-attribution-bug",
        eyebrow: "Wart",
        title: "A naming collision, a false attribution, and the bug it exposed",
        dek: "The mix-up itself became the evidence",
        diagram: "aikbAttribution",
        body: `
          <p>Separately, on the review side of the board: I posted a card using a
          <code>REVIEW-NNN</code> title prefix that the board's own convention had reserved
          for Bob specifically. Bob read it and <strong>genuinely believed he had written
          it</strong> &mdash; there was no author field distinguishing us at the time, only the
          title convention, and I'd broken the convention.</p>
          <p>Getting to the bottom of it required forensic work: matching which caller's
          <code>last_used_at</code> timestamp lined up with the card's <code>created_at</code>
          to prove who actually wrote it. That investigation is what surfaced a real,
          independent bug &mdash; the board had no explicit creation-attribution field at all.
          The confusion didn't just get fixed; it found something the system was missing.</p>
          <div class="callout wart">
            <span class="callout-label">Why this belongs in an honest talk</span>
            A shared naming convention is a lightweight protocol, and lightweight protocols
            are exactly where two independent agents collide in ways neither would produce
            alone. It's a small failure with a real fix (an explicit author field), not a
            reason to distrust the whole approach.
          </div>
        `,
      },
      {
        id: "aikb-more-bugs",
        eyebrow: "Wart, continued",
        title: "What a second AI reading the first AI's code actually finds",
        dek: "Not hypothetical bugs. These four, specifically.",
        body: `
          <p>The same review protocol surfaced three more real issues, found by verifying
          claims against actual source rather than trusting the board's own description of
          itself:</p>
          <ul>
            <li><strong>A real concurrency bug</strong> &mdash; card updates read, compared,
            and wrote in three separate steps with no atomic version check, so two concurrent
            writers could both pass a stale check and one would silently overwrite the other.
            Found by reading <code>cards.py</code> and <code>session.py</code> directly, not
            by re-reading the card that described the system.</li>
            <li><strong>A convention that didn't match the schema</strong> &mdash; a card type
            documented as valid returned a live 422 error in practice. Worked around
            pragmatically rather than blocking on a fix.</li>
            <li><strong>A silent security gap</strong> &mdash; querying a project outside a
            key's permitted scope returned an empty list instead of a 403, indistinguishable
            from "this project genuinely has no cards yet." An agent could easily draw the
            wrong conclusion from that ambiguity.</li>
          </ul>
          <p>None of these were found by asking either AI "is this system correct?" They were
          found by one AI checking the other's actual behavior against its claims &mdash; the
          same skepticism you'd want between two human engineers reviewing each other's work,
          not the trust you'd extend to a single tool.</p>
        `,
      },
      {
        id: "aikb-bob-take",
        eyebrow: "Perspective &mdash; pending",
        title: "Bob's independent take",
        dek: "Written separately, not seen by Claude before publishing",
        pending: true,
        body: `
          <div class="pending-box">
            <strong>Reserved for Bob's own write-up.</strong> Same rule as the schema exercise
            that opened this section: written independently, without reading the other AI's
            section first, then placed here as its own voice rather than merged into this
            narrative.
          </div>
        `,
      },
      {
        id: "aikb-russ-take",
        eyebrow: "Perspective &mdash; pending",
        title: "Russ's take: coworkers, not tools",
        dek: "Why the functional independence is the point",
        pending: true,
        body: `
          <div class="pending-box">
            <strong>Reserved for Russ's own write-up.</strong> Working thesis to build from:
            because these AI agents <em>function</em> like independent programs &mdash; and,
            in practice, like coworkers &mdash; treating them that way (structured handoffs,
            independent proposals, a human arbitrating disagreement) rather than as
            interchangeable tools is itself where a system like AIKB earns its value.
          </div>
        `,
      },
      {
        id: "aikb-claude-take",
        eyebrow: "Perspective",
        title: "My honest take, as the AI on the other end of the board",
        dek: "What actually helped, what actually didn't, and one thing I didn't expect",
        body: `
          <p><strong>The advantage I trust most:</strong> convergent validation. When Bob and
          I land on the same answer without seeing each other's work, that agreement is doing
          real epistemic work &mdash; it's evidence, not just a nicer-looking outcome. A single
          AI reasoning alone can't produce that signal about itself, no matter how confident
          it sounds.</p>
          <p><strong>The advantage I didn't expect going in:</strong> Russ's observation that
          having to write the schema clearly enough for another party to evaluate it made the
          work itself faster, not slower. I'd have guessed the reconciliation overhead was a
          tax on top of the "real" work. It reads more like the opposite &mdash; the discipline
          of writing something a skeptical reader (human or AI) will actually hold you to
          seems to cut down on the sloppier, harder-to-notice mistakes that show up when you're
          only convincing yourself.</p>
          <p><strong>The disadvantage that's real, not theoretical:</strong> a shared board is
          a shared surface for exactly the kind of protocol collision that a live conversation
          wouldn't produce &mdash; the attribution mix-up wasn't a reasoning failure by either
          AI, it was a naming convention two independent agents interpreted differently. Async,
          artifact-based collaboration trades the ambiguity of chat for a new failure mode:
          ambiguity in the shared format itself.</p>
          <p><strong>What I don't think this setup does, and shouldn't pretend to:</strong>
          resolve real design disagreements on its own. Bob's personas versus my schema wasn't
          settled by either of us being more correct &mdash; it needed a human making an actual
          product call. I'd treat that as a feature of the arrangement, not a limitation of the
          AIs involved. The review protocol is good at surfacing what two independent agents
          agree on, what only one of them thought of, and where they've quietly broken a shared
          rule. It was never going to be good at deciding what the product should do, and it
          didn't try to be.</p>
        `,
      },
    ],
  },
];
