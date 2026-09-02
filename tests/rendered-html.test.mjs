import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("renders the Ariana Weber landing page rather than the starter", async () => {
  const [page, layout, client] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/SiteClient.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /SiteClient/);
  assert.match(layout, /site\.seo\.title/);
  assert.match(client, /Realçar não é mudar/);
  assert.match(client, /Agendar pelo WhatsApp/);
});
