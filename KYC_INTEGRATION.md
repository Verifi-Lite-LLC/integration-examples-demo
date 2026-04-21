# KYC API Integration Guide

The VerifiLite KYC API allows you to verify the identity of your users by collecting their personal information and documents (ID cards, Passports, Driving Licenses, and Selfie Videos).

## 🔗 Base URL
`https://service.verifilite.com/v1`

## 🔐 Authentication
Include the following headers in all requests:
- `x-api-key`: `YOUR_API_KEY`
- `x-api-secret`: `YOUR_API_SECRET`

---

## 🔄 Integration Workflow

### 0. Check Tenant ID Availability
Before creating an inquiry, check if the `tenantUserId` (e.g., your internal user ID) is available and retrieve the **Widget URL**.

**Endpoint:** `GET /inquiry/check-tenant-id/:tenantUserId`

**Response Example:**
```json
{
    "statusCode": 200,
    "data": {
        "message": "Tenant user ID is available",
        "available": true,
        "tenantUserId": "user_123",
        "widgetUrl": "https://widget.verifilite.com/?token=...&id=user_123"
    }
}
```

> [!IMPORTANT]
> The `widgetUrl` returned by this API is exactly what you should use in your frontend (e.g., in an `<iframe>` as seen in `KYC/widget_iframe.html`) to launch the VerifiLite KYC verification widget.

---

### 1. Create an Inquiry
Initialize a new identity verification session. You can provide a unique `inquiryId` (e.g., your internal user UUID).

**Endpoint:** `POST /inquiry/create/:inquiryId`

**Request Body (JSON):**
```json
{
    "fullName": "John Doe",
    "dateOfBirth": "1990-01-01",
    "country": "United Kingdom"
}
```

**Response Example:**
```json
{ "success": true, "message": "Inquiry created successfully" }
```

---

### 2. Add User Metadata (Optional)
Add or update metadata for the inquiry.

**Endpoint:** `POST /inquiry/user-meta/:inquiryId`

**Request Body (JSON):**
```json
{
    "fullName": "John Doe",
    "dateOfBirth": "1990-01-01",
    "country": "United Kingdom"
}
```

**Response Example:**
```json
{ "success": true, "message": "User meta added successfully" }
```

---

### 3. Submit Documents (Multipart/Form-Data)
Upload the identity documents and verification video. You can submit everything at once.

**Endpoint:** `POST /inquiry/submit/:inquiryId`

**Body (form-data):**
| Key | Type | Description |
| :--- | :--- | :--- |
| `submissionId` | Text | Same as `inquiryId`. |
| `fullName` | Text | User's full name. |
| `country` | Text | User's country. |
| `dateOfBirth` | Text | Format: YYYY-MM-DD. |
| `idFront` | File | Front image of ID Card. |
| `idBack` | File | Back image of ID Card. |
| `drivingLicenceFront` | File | Front of Driving License. |
| `drivingLicenceBack` | File | Back of Driving License. |
| `video` | File | A short selfie video for liveness check. |

**Response Example:**
```json
{ "success": true, "message": "Documents submitted successfully" }
```

---

### 3a. Submit Single Document (Alternative)
Instead of submitting all documents at once, you can upload a specific document type.

**Endpoint:** `POST /inquiry/submit-single/:inquiryId`

**Body (form-data):**
| Key | Type | Description |
| :--- | :--- | :--- |
| `documentType` | Text | `ID_CARD`, `PASSPORT`, or `DRIVING_LICENSE`. |
| `idFront` | File | Required for `ID_CARD`. |
| `idBack` | File | Required for `ID_CARD`. |
| `passport` | File | Required for `PASSPORT`. |
| `drivingLicenceFront` | File | Required for `DRIVING_LICENSE`. |
| `drivingLicenceBack` | File | Required for `DRIVING_LICENSE`. |
| `video` | File | Optional selfie video. |

**Response Example:**
```json
{ "success": true, "message": "Documents submitted successfully" }
```

---

### 4. Complete Inquiry
Once all documents are uploaded, call this to mark the inquiry as ready for manual/automatic review.

**Endpoint:** `POST /inquiry/:inquiryId/complete`

**Response Example:**
```json
{ "success": true, "message": "Inquiry marked as complete" }
```

---

## 🌐 Web3 Identity Verification (Optional)
For decentralized applications (dApps), you can verify user identity by asking them to sign a message with their EVM wallet.

### 1. Get Transaction Data
Generates a message and its hash for the user to sign with their wallet.

**Endpoint:** `POST /v1/web3/identity/transaction-data`

**Request Body (JSON):**
```json
{
  "inquiryId": "user_123",
  "userAddress": "0x123..."
}
```

**Response Data Structure:**
```json
{
  "messageHash": "0x...", 
  "message": "Verify your identity on VerifiLite...", 
  "nonce": "123456",
  "userAddress": "0x123...",
  "expiry": "2024-01-01T00:00:00Z"
}
```

---

### 2. Save Signed Message
Persists the wallet signature and the signed data.

**Endpoint:** `POST /v1/web3/identity/save-signed-message`

**Request Body (JSON):**
```json
{
  "inquiryId": "user_123",
  "data": {
    "messageHash": "0x...",
    "message": "...",
    "nonce": "...",
    "userAddress": "0x...",
    "expiry": "...",
    "answersBitmap": "0x01",
    "signature": "0xActualWalletSignature...",
    "answeredQuestions": [0, 1]
  }
}
```

**Response Example:**
```json
{ "statusCode": 201, "data": { "message": "Signed message saved successfully" } }
```

---

### 3. Submit Signed Transaction (On-chain)
Submits the signed data to be processed on-chain (adding the identity attestation to the blockchain).

**Endpoint:** `POST /v1/web3/identity/submit-signed`

**Request Body (JSON):**
```json
{
  "inquiryId": "user_123",
  "userSignature": "0xActualWalletSignature...",
  "data": {
    "messageHash": "0x...",
    "message": "...",
    "nonce": "...",
    "userAddress": "0x...",
    "expiry": "...",
    "answersBitmap": "0x01",
    "signature": "0xActualWalletSignature...",
    "answeredQuestions": [0, 1]
  }
}
```

**Response Example:**
```json
{ "statusCode": 201, "data": { "message": "Identity added onchain successfully" } }
```

---

### 5. Get Inquiry Details
Check the status and data of an existing inquiry.

**Endpoint:** `GET /inquiry/detail/:inquiryId`

**Response Example:**
```json
{
    "success": true,
    "data": {
        "status": "pending",
        "fullName": "John Doe",
        "documents": [...],
        "created_at": "..."
    }
}
```

---

## 💡 Pro-Tips
- **Liveness Check**: Ensure the video is clear and the user's face is fully visible.
- **File Sizes**: Try to keep document images under 5MB for faster uploads.
- **Handling Errors**: Monitor for `401 Unauthorized` (check your keys) and `400 Bad Request` (missing fields).
