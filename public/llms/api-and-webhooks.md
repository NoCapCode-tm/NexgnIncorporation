# Nexgn REST API, Embedded Signing & HMAC Webhooks

## Overview
Nexgn provides a modern, JSON-native REST API, embedded signing flows, and HMAC-SHA256 webhooks engineered for SaaS teams and enterprise automation. Unlike legacy providers that charge $2,500+/year minimums or enforce XML/SOAP wrappers, Nexgn includes API & Webhook access directly in the Business plan ($19/mo) alongside a free developer Sandbox.

- **Production Base URL:** `https://api.nexgn.cloud/v1`
- **Postman Public Workspace:** `https://postman.com/nexgn-public`

---

## 1. Authentication
Every API request requires a Bearer API key passed in the HTTP `Authorization` header over TLS 1.3:

```http
Authorization: Bearer sk_live_YOUR_NEXGN_API_KEY
Content-Type: application/json
```

Test environment keys use the `sk_test_` prefix and execute inside an isolated sandbox without consuming production envelope allowances.

---

## 2. Core Agreement Endpoints

| Operation | Method & Endpoint | Description |
| :--- | :--- | :--- |
| **Create & Send Envelope** | `POST /v1/envelopes` | Uploads or references a template/PDF, attaches signers, places coordinates/fields, and dispatches signing links. |
| **Get Envelope Status** | `GET /v1/envelopes/:id` | Returns real-time status (`draft`, `sent`, `viewed`, `signed`, `completed`, `voided`) and signer states. |
| **Generate Embedded Signing URL** | `POST /v1/envelopes/:id/signing-session` | Returns a short-lived, single-use embedded signing URL suitable for secure `<iframe>` rendering inside your SaaS app. |
| **Download Sealed PDF + Certificate** | `GET /v1/envelopes/:id/certificate` | Streams the SHA-256 sealed PDF and forensic audit certificate (UTC timestamps, IPv4/IPv6, User-Agent). |
| **List / Instantiate Templates** | `GET /v1/templates` / `POST /v1/templates/:id/send` | Automates recurring NDAs, offer letters, and MSAs with pre-mapped fields. |

---

## 3. Event-Driven Webhooks (Zero-Polling Architecture)
Polling an API every 30 seconds wastes server CPU and triggers rate limits. Nexgn pushes instant JSON webhook payloads on every lifecycle event:

- `envelope.sent`
- `envelope.viewed`
- `signer.completed`
- `envelope.completed` (includes SHA-256 checksum & storage sync status)
- `envelope.declined` / `envelope.expired`

### Verifying Webhook Authenticity (HMAC-SHA256)
Every webhook POST request includes an `X-Nexgn-Signature` header computed with your endpoint signing secret:

```javascript
import crypto from 'node:crypto';

export function verifyNexgnWebhook(rawBody, signatureHeader, webhookSecret) {
  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody, 'utf8')
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signatureHeader, 'hex'),
    Buffer.from(expected, 'hex')
  );
}
```

---

## 4. Security & Rate Limits
- All payloads travel over **TLS 1.3** with Perfect Forward Secrecy.
- Completed PDF binaries and metadata are encrypted at rest with **AES-256-GCM**.
- Rate limits are enforced per API key with standard `X-RateLimit-Remaining` and `Retry-After` headers.