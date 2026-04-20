/**
 * @fileoverview Allow-list filtering for incoming create/update/upsert data.
 *
 * Payload's admin UI (and some internal flows) can forward fields to the
 * database adapter that are NOT declared on the collection's field schema.
 * The most notorious example is the "confirm-password" input on the user
 * create / first-user form: Payload's `registerLocalStrategy` explicitly
 * deletes `password` from the data before writing, but never strips
 * `confirm-password`. With SQL-backed adapters (Postgres) the stray column
 * is silently dropped; Mongoose filters against its schema; but Convex is
 * schemaless (for the adapter-managed tables, `schemaValidation: false`),
 * so whatever we `ctx.db.insert()` lands on disk verbatim - including
 * plaintext passwords.
 *
 * This module filters incoming top-level keys to:
 *   1. The collection's sanitized, flattened fields (`config.flattenedFields`)
 *   2. A small set of well-known Payload system fields
 * Anything else is dropped (with a warning) so that secrets can't leak
 * through UI-only form inputs or ad-hoc request bodies.
 *
 * Nested values (e.g. rich text, arrays of blocks) are *not* walked -
 * Payload owns the shape of nested content via its own field hooks, and
 * deep traversal would also rebuild the data unnecessarily.
 *
 * @module tools/sanitize-incoming-data
 */

import type { AdapterService } from "../adapter/service";

/**
 * Top-level keys that are always allowed regardless of collection schema.
 * These are Payload-internal system / auth fields that may be attached
 * to a document by core operations (login, session tracking, draft
 * workflows, verification, etc.) but are not always present in
 * `flattenedFields`.
 */
const SYSTEM_ALLOW_LIST = new Set<string>([
  // Identity / timestamps
  "id",
  "_id",
  "createdAt",
  "updatedAt",
  "_creationTime",
  // Draft/publish workflow
  "_status",
  // Verification workflow
  "_verified",
  "_verificationToken",
  // Auth runtime state
  "_strategy",
  "collection",
  "loginAttempts",
  "lockUntil",
  "sessions",
  "hash",
  "salt",
  "resetPasswordToken",
  "resetPasswordExpiration",
  "apiKey",
  "apiKeyIndex",
]);

/**
 * Top-level keys we actively refuse to persist even if something upstream
 * would otherwise allow them. These are UI-only form inputs from Payload's
 * admin that occasionally ride along in request bodies.
 */
const NEVER_ALLOWED = new Set<string>([
  "confirm-password",
  "current-password",
  "new-password",
]);

/**
 * Props for `sanitizeIncomingData`.
 */
export type SanitizeIncomingDataProps = {
  /** The adapter service (used for collection lookup and logging). */
  service: AdapterService;
  /**
   * The Payload collection slug (unprefixed). Typically passed straight
   * from the Payload-facing binding (`users`, `pages`, `payload-preferences`).
   */
  collection: string;
  /** The incoming data blob Payload handed to the adapter. */
  data: Record<string, unknown> | null | undefined;
  /** Which binding triggered the sanitize (for log attribution). */
  operation: "create" | "update" | "upsert";
};

/**
 * Filters incoming data against the collection's declared field schema
 * and a known set of system fields. Unknown top-level keys are dropped
 * and a warning is emitted so drift surfaces immediately.
 *
 * Falls back to a best-effort blocklist when the collection config can't
 * be resolved (e.g. version tables, ad-hoc collections). In that case we
 * only strip the keys in `NEVER_ALLOWED`.
 *
 * Always returns a plain object. Nullish or non-object input is coerced
 * to `{}` so downstream insert/patch typings stay narrow.
 */
export function sanitizeIncomingData(
  props: SanitizeIncomingDataProps
): Record<string, unknown> {
  const { service, collection, data, operation } = props;

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {};
  }

  const payload = service.payload as unknown as {
    collections?: Record<string, { config?: { flattenedFields?: Array<{ name?: string }> } }>;
  };

  const config = payload?.collections?.[collection]?.config;
  const flattened = config && Array.isArray(config.flattenedFields)
    ? config.flattenedFields
    : null;

  // When we don't have a schema to check against, fall back to a narrow
  // blocklist so we still scrub the worst offenders without breaking
  // callers that write to tables we don't track (versions, globals, etc.).
  if (!flattened) {
    const fallback: Record<string, unknown> = {};
    const dropped: string[] = [];
    for (const [key, value] of Object.entries(data)) {
      if (NEVER_ALLOWED.has(key)) {
        dropped.push(key);
        continue;
      }
      fallback[key] = value;
    }
    if (dropped.length > 0) {
      service.system
        .logger({
          fn: "sanitizeIncomingData",
          reason: "virtual_form_field_blocklist",
          operation,
          collection,
          droppedKeys: dropped,
        })
        .warn();
    }
    return fallback;
  }

  const allowed = new Set<string>(SYSTEM_ALLOW_LIST);
  for (const field of flattened) {
    if (field?.name) allowed.add(field.name);
  }

  const result: Record<string, unknown> = {};
  const dropped: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (NEVER_ALLOWED.has(key)) {
      dropped.push(key);
      continue;
    }
    if (allowed.has(key)) {
      result[key] = value;
      continue;
    }
    dropped.push(key);
  }

  if (dropped.length > 0) {
    service.system
      .logger({
        fn: "sanitizeIncomingData",
        reason: "unknown_top_level_key",
        operation,
        collection,
        droppedKeys: dropped,
      })
      .warn();
  }

  return result;
}
