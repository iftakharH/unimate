import DOMPurify from "dompurify";

/**
 * Sanitize untrusted rich-text HTML (listing descriptions come from the
 * Quill editor) before rendering it with dangerouslySetInnerHTML.
 *
 * Quill's HTML export has an unpatched XSS advisory (CVE-2025-15056, quill
 * 2.0.3, no fixed release), so the render boundary is sanitized as defense
 * in depth. The html profile keeps normal formatting (p, strong, lists,
 * links, inline styles) while stripping scripts, event handlers and
 * javascript: URLs.
 */
export const sanitizeHtml = (html) =>
    DOMPurify.sanitize(html || "", { USE_PROFILES: { html: true } });
