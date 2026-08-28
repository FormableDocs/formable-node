# formable-node

Official Node.js SDK for the [Formable API](https://api.formabledocs.com) (v1). Covers templates, signature requests, redlining, and billing.

- Zero runtime dependencies (uses native `fetch`)
- Full TypeScript types for every request and response
- Node.js 18+

## Installation

```bash
npm install formable-node
# or
bun add formable-node
```

## Usage

```ts
import Formable from "formable-node";

const formable = new Formable({ apiKey: process.env.FORMABLE_API_KEY! });
```

### Templates

```ts
import { readFile } from "node:fs/promises";

const file = await readFile("./nda.docx");

const { templateId, editTemplateAccess } = await formable.templates.create({
  file,
  filename: "nda.docx",
  signerRoles: [
    { name: "Client", order: 0 },
    { name: "Witness", order: 1 },
  ],
});

// Mint a fresh edit URL later (expires after 1 day)
const { editUrl, expiresAt } = await formable.templates.createEditUrl(templateId);
```

### Signature requests

```ts
// Formable emails each signer a signing link
const request = await formable.signatureRequests.create({
  templateId,
  signers: [
    { email: "jane@example.com", name: "Jane Doe", role: "Client" },
    { email: "bob@example.com", name: "Bob Smith", role: "Witness" },
  ],
});

// Embedded flow: mint signing URLs to embed in an iframe yourself
const embedded = await formable.signatureRequests.createEmbedded({
  templateId,
  signers: [{ email: "jane@example.com", name: "Jane Doe", role: "Client" }],
  testMode: true,
});

const [signer] = embedded.signers;
const { signingUrl } = await formable.signatureRequests.createSigningUrl(
  signer.recipientSignatureId
);

// Track progress
const current = await formable.signatureRequests.get(embedded.signatureRequestId);
const all = await formable.signatureRequests.list({ updatedSince: new Date("2026-01-01") });
const { signatureRequestEvents } = await formable.signatureRequests.getEvents(
  embedded.signatureRequestId
);

// Download the signed document once completed
const { signedEnvelopePresignedUrl } =
  await formable.signatureRequests.getSignedEnvelope(embedded.signatureRequestId);
```

### Redline requests

```ts
const { redlineRequestId } = await formable.redlineRequests.create({
  templateId,
  members: [
    { email: "us@example.com", displayName: "John Doe", role: "DisclosingParty" },
    { email: "them@example.com", displayName: "Jane Smith", role: "ReceivingParty" },
  ],
  metadata: { subject: "Mutual NDA" },
});

// Mint a redline URL for a member (embed in an iframe)
const { redlineUrl } = await formable.redlineRequests.createUrl(
  redlineRequestId,
  "them@example.com"
);

// Manage members and track progress
await formable.redlineRequests.updateMembers(redlineRequestId, [
  { email: "counsel@example.com", displayName: "Counsel", role: "ReceivingCounsel" },
]);
const redline = await formable.redlineRequests.get(redlineRequestId);
const { redlineRequestEvents } = await formable.redlineRequests.getEvents(redlineRequestId);
```

### Billing and health

```ts
const { numberOfRedliningSessions } = await formable.billing();
const health = await formable.health();
```

## Error handling

All non-2xx responses throw a `FormableError` with the server's error message, HTTP status, and parsed response body.

```ts
import { FormableError } from "formable-node";

try {
  await formable.signatureRequests.get("missing-id");
} catch (error) {
  if (error instanceof FormableError) {
    console.error(error.status, error.message);
  }
}
```

## Configuration

| Option    | Description                                              | Default                              |
| --------- | -------------------------------------------------------- | ------------------------------------ |
| `apiKey`  | Your Formable API key (sent as a bearer token). Required. | -                                    |
| `baseUrl` | Override the API base URL.                                | `https://api.formabledocs.com/v1`    |
| `fetch`   | Custom `fetch` implementation.                            | `globalThis.fetch`                   |

## Development

```bash
bun install
bun run typecheck
bun run build
```

To publish a new version, see [RELEASING.md](RELEASING.md).
