/* We Manage Agents: progressive enhancement.
   Every page is complete without this file. Nothing here sends a message
   or contacts a business system. The enquiry form only submits when a
   real endpoint is configured on the form element (see README). */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------------- Mobile navigation ---------------- */
  function initMenu() {
    var toggle = $('[data-menu-toggle]');
    var nav = $('#site-nav');
    if (!toggle || !nav) return;

    function setOpen(open, returnFocus) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close menu' : 'Menu';
      if (!open && returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      setOpen(open, false);
      if (open) { var first = $('a', nav); if (first) first.focus(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false, true);
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false, false);
    });

    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false, false); });
    });

    var mq = window.matchMedia('(min-width: 52.01rem)');
    var onChange = function () { if (mq.matches) setOpen(false, false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------------- Illustrative handover example ---------------- */
  function initCase() {
    var root = $('[data-case]');
    if (!root) return;

    var ORIGINAL = 'Can you confirm who is leading Thursday’s kickoff and add them to the handover record? The scope is signed; the lead assignment is the remaining item to confirm.';
    var FEEDBACK = {
      approved: 'Example action approved. No message has been sent.',
      edited: 'Example message updated. No message has been sent.',
      held: 'Example action held. The handover requirement remains open.'
    };

    var tabs = $$('[role="tab"]', root);
    var stages = $$('[data-stage]', root);
    var sourcesToggle = $('[data-sources-toggle]', root);
    var sources = $('[data-sources]', root);
    var msgText = $('[data-message-text]', root);
    var editor = $('[data-message-editor]', root);
    var input = $('[data-message-input]', root);
    var controls = $('[data-decision-controls]', root);
    var feedback = $('[data-decision-feedback]', root);
    var afterApprove = $('[data-after-approve]', root);
    var heldNote = $('[data-held-note]', root);
    var branchButtons = $$('[data-branch]', root);
    var branchPanels = $$('[data-branch-panel]', root);
    var stateWrap = $('[data-case-state]', root);
    var stateDot = $('[data-case-state-dot]', root);
    var stateText = $('[data-case-state-text]', root);
    var branchControls = $('.branch-controls', root);

    var state;
    function reset() {
      state = { stage: 1, sourcesOpen: false, decision: null, feedback: null, message: ORIGINAL, editing: false, branch: null };
    }
    reset();

    // Enhance the static document into an interactive walkthrough.
    root.classList.remove('no-js-case');
    $('[data-case-tabs]', root).hidden = false;
    stateWrap.hidden = false;
    sourcesToggle.hidden = false;
    $$('[data-js-only]', root).forEach(function (el) { el.hidden = false; });
    $$('[data-case-restart]', root).forEach(function (el) { el.hidden = false; });
    var fallback = $('[data-fallback-link]', root);
    stages.forEach(function (s, i) {
      s.setAttribute('role', 'tabpanel');
      s.setAttribute('aria-labelledby', tabs[i].id);
      var h = $('h3', s);
      if (h) h.setAttribute('tabindex', '-1');
    });

    function render() {
      tabs.forEach(function (t, i) {
        var on = i + 1 === state.stage;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      stages.forEach(function (s, i) { s.hidden = i + 1 !== state.stage; });

      sources.hidden = !state.sourcesOpen;
      sourcesToggle.setAttribute('aria-expanded', String(state.sourcesOpen));
      sourcesToggle.textContent = state.sourcesOpen ? 'Hide example sources' : 'View example sources';

      msgText.textContent = '“' + state.message + '”';
      editor.hidden = !state.editing;
      msgText.hidden = state.editing;
      controls.hidden = state.editing;

      var approved = state.decision === 'approved';
      $$('[data-decision]', root).forEach(function (b) { b.disabled = approved; });

      feedback.innerHTML = '';
      if (state.feedback) {
        var dot = document.createElement('span');
        dot.className = 'status-dot' + (state.feedback === 'held' ? '' : ' status-dot--wait');
        dot.setAttribute('aria-hidden', 'true');
        var txt = document.createElement('span');
        txt.textContent = FEEDBACK[state.feedback];
        feedback.appendChild(dot);
        feedback.appendChild(txt);
      }
      afterApprove.hidden = !approved;

      var held = state.decision === 'held';
      heldNote.hidden = !held;
      branchControls.hidden = held;
      branchButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-branch') === state.branch)); });
      branchPanels.forEach(function (p) { p.hidden = held || p.getAttribute('data-branch-panel') !== state.branch; });

      var resolved = state.branch === 'resolved' && !held;
      stateDot.className = 'status-dot' + (resolved ? ' status-dot--ok' : '');
      stateText.textContent = resolved ? 'Handover requirement confirmed' : 'Handover requirement open';
    }

    function goStage(n, focusTarget) {
      state.stage = n;
      render();
      if (focusTarget === 'tab') tabs[n - 1].focus();
      else if (focusTarget === 'heading') {
        var h = $('h3', stages[n - 1]);
        if (h) h.focus({ preventScroll: true });
        var top = root.getBoundingClientRect().top;
        if (top < 0) root.scrollIntoView({ block: 'start' });
      }
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { goStage(i + 1); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = i + 2 > tabs.length ? 1 : i + 2;
        if (e.key === 'ArrowLeft') n = i < 1 ? tabs.length : i;
        if (e.key === 'Home') n = 1;
        if (e.key === 'End') n = tabs.length;
        if (n) { e.preventDefault(); goStage(n, 'tab'); }
      });
    });

    $$('[data-go-stage]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.hasAttribute('data-open-sources')) state.sourcesOpen = true;
        goStage(parseInt(b.getAttribute('data-go-stage'), 10), 'heading');
      });
    });

    sourcesToggle.addEventListener('click', function () {
      state.sourcesOpen = !state.sourcesOpen;
      render();
    });

    $$('[data-decision]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var d = b.getAttribute('data-decision');
        if (d === 'approve') { state.decision = 'approved'; state.feedback = 'approved'; }
        if (d === 'hold') { state.decision = 'held'; state.feedback = 'held'; state.branch = null; }
        if (d === 'edit') {
          state.editing = true;
          render();
          input.value = state.message;
          input.focus();
          return;
        }
        render();
      });
    });

    $('[data-message-save]', root).addEventListener('click', function () {
      var v = input.value.replace(/\s+/g, ' ').trim().replace(/^[“"]|[”"]$/g, '');
      state.message = v || ORIGINAL;
      state.editing = false;
      state.feedback = 'edited';
      render();
      $('[data-decision="edit"]', root).focus();
    });

    $('[data-message-cancel]', root).addEventListener('click', function () {
      state.editing = false;
      render();
      $('[data-decision="edit"]', root).focus();
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); $('[data-message-cancel]', root).click(); }
    });

    branchButtons.forEach(function (b) {
      b.addEventListener('click', function () {
        state.branch = b.getAttribute('data-branch');
        render();
      });
    });

    $$('[data-case-restart]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        reset();
        goStage(1, 'tab');
      });
    });

    if (fallback) fallback.textContent = 'Read the complete example';
    render();
  }

  /* ---------------- Printable worksheet ---------------- */
  function initPrint() {
    $$('[data-print-worksheet]').forEach(function (btn) {
      btn.hidden = false;
      btn.addEventListener('click', function () {
        var html = document.documentElement;
        html.classList.add('print-worksheet');
        var done = function () { html.classList.remove('print-worksheet'); };
        window.addEventListener('afterprint', done, { once: true });
        window.print();
      });
    });
  }

  /* ---------------- Guide contents highlighting ---------------- */
  function initToc() {
    var links = $$('[data-toc] a');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var heads = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-current'); a.removeAttribute('aria-current'); });
        var a = map[en.target.id];
        if (a) { a.classList.add('is-current'); a.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    heads.forEach(function (h) { io.observe(h); });
  }

  /* ---------------- Enquiry form ---------------- */
  function initForm() {
    var form = $('[data-enquiry-form]');
    if (!form) return;

    var MESSAGES = {
      name: { missing: 'Please enter your name.' },
      email: { missing: 'Please enter your email address.', invalid: 'Please check your email address.' },
      business: { missing: 'Please enter your business name.' },
      example: { missing: 'Please share a short example of the work you are chasing.' }
    };
    var TEXT = {
      sending: 'Sending your enquiry…',
      failed: 'We couldn’t send your enquiry. Your details are still here. Please try again.',
      unknown: 'We couldn’t confirm whether your enquiry was received. Your details are still here. Please try again; we’ll check for duplicates.',
      preview: 'This is a website preview. The enquiry form is not connected. Nothing was sent.'
    };

    var endpoint = (form.getAttribute('data-endpoint') || '').trim();
    var previewMode = !endpoint;
    var status = $('[data-form-status]', form);
    var submit = $('[type="submit"]', form);
    var submitLabel = submit.textContent;
    var success = $('[data-form-success]');
    var attempted = false;
    var idempotencyKey = null;

    form.setAttribute('novalidate', '');
    if (!previewMode) { var notice = $('.preview-notice', form); if (notice) notice.hidden = true; }
    submit.disabled = false;

    function fieldEl(name) { return form.elements[name]; }

    function validateField(name) {
      var el = fieldEl(name);
      var v = (el.value || '').trim();
      var msg = '';
      if (!v) msg = MESSAGES[name].missing;
      else if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = MESSAGES.email.invalid;
      var err = document.getElementById(name + '-error');
      if (msg) {
        el.setAttribute('aria-invalid', 'true');
        err.innerHTML = '';
        err.appendChild(document.createTextNode(msg));
        err.hidden = false;
      } else {
        el.removeAttribute('aria-invalid');
        err.hidden = true;
        err.textContent = '';
      }
      return !msg;
    }

    Object.keys(MESSAGES).forEach(function (name) {
      var el = fieldEl(name);
      el.addEventListener('blur', function () { if (attempted) validateField(name); });
      el.addEventListener('input', function () {
        idempotencyKey = null; // content changed: a new enquiry, not a retry
        if (attempted && el.getAttribute('aria-invalid') === 'true') validateField(name);
      });
    });

    function setStatus(text, kind) {
      status.textContent = text || '';
      status.className = 'form-status' + (kind ? ' form-status--' + kind : '');
    }

    function setBusy(busy) {
      submit.disabled = busy;
      submit.textContent = busy ? TEXT.sending : submitLabel;
      form.setAttribute('aria-busy', String(busy));
    }

    function newKey() {
      if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
      return 'k' + Date.now().toString(36) + Math.random().toString(36).slice(2);
    }

    function showSuccess() {
      form.hidden = true;
      success.hidden = false;
      var h = $('h2', success);
      h.setAttribute('tabindex', '-1');
      h.focus();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      attempted = true;
      setStatus('');

      var names = Object.keys(MESSAGES);
      var firstInvalid = null;
      names.forEach(function (n) { if (!validateField(n) && !firstInvalid) firstInvalid = fieldEl(n); });
      if (firstInvalid) { firstInvalid.focus(); return; }

      if (previewMode) { setStatus(TEXT.preview, 'preview'); return; }

      if (!idempotencyKey) idempotencyKey = newKey();
      var payload = {
        name: fieldEl('name').value.trim(),
        email: fieldEl('email').value.trim(),
        business: fieldEl('business').value.trim(),
        example: fieldEl('example').value.trim(),
        website: fieldEl('website') ? fieldEl('website').value : '',
        idempotency_key: idempotencyKey
      };

      setBusy(true);
      var controller = 'AbortController' in window ? new AbortController() : null;
      var timer = setTimeout(function () { if (controller) controller.abort(); }, 20000);

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined
      }).then(function (res) {
        return res.json().catch(function () { return null; }).then(function (body) { return { res: res, body: body }; });
      }).then(function (r) {
        clearTimeout(timer);
        setBusy(false);
        // Only an explicit acknowledgment counts as receipt. See README for the contract.
        if (r.res.ok && r.body && r.body.received === true) { showSuccess(); return; }
        if (r.body && r.body.received === false) { setStatus(TEXT.failed, 'error'); return; }
        setStatus(TEXT.unknown, 'error');
      }).catch(function () {
        clearTimeout(timer);
        setBusy(false);
        setStatus(TEXT.unknown, 'error');
      });
    });
  }

  function start() {
    initMenu();
    initCase();
    initPrint();
    initToc();
    initForm();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
