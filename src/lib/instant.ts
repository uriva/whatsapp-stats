import { init, id, InstaQLEntity } from "@instantdb/react";
import schema, { AppSchema } from "../../instant.schema";

export const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID || "f8c4ea32-9cd1-4ba1-a878-5512ec3d062c";

export const db = init({
  appId: APP_ID,
  schema,
});

export type Snapshot = InstaQLEntity<AppSchema, "snapshots">;
export type Reaction = InstaQLEntity<AppSchema, "reactions">;
export { id };

/**
 * Ensures the user is logged in as a guest (no email required)
 */
export async function ensureGuestSession(): Promise<void> {
  try {
    if (typeof window === 'undefined') return;
    const authState = db.auth;
    if (authState && typeof authState.signInAsGuest === 'function') {
      await authState.signInAsGuest();
    }
  } catch (err) {
    // Already signed in or guest session active
    console.debug('Guest session established or existing', err);
  }
}

/**
 * Generate a clean, readable short invite code
 */
export function generateShareCode(title: string): string {
  const cleanPrefix = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 8) || 'chat';
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${cleanPrefix}-${randomSuffix}`;
}
