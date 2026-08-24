"use client";

import * as React from "react";

/** מי מחובר עכשיו, לפי הסשן בשרת */
export function useSession() {
  const [email, setEmail] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => alive && setEmail(d.email ?? null))
      .catch(() => {})
      .finally(() => alive && setReady(true));
    return () => { alive = false; };
  }, []);

  return { email, ready, signedIn: !!email };
}
