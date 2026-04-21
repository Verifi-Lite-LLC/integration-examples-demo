# Wallet API Integration Guide

The VerifiLite Wallet API provides a SaaS solution for managing crypto deposit addresses, automated on-chain sweeping (forwarding), and withdrawal management on the Binance Smart Chain (BSC).

## 🚀 Key Concepts
- **Deterministic Addresses**: Each user receives a unique, predictable deposit address generated based on their `userId`.
- **On-Chain Sweeping**: Funds sent to a user's deposit address are automatically "swept" to your master merchant wallet via a factory smart contract.
- **Gasless for User**: The system handles the gas fees for forwarding funds.

---

## 🔐 Authentication
VerifiLite uses two types of authentication depending on the endpoint:

1. **Merchant Authentication**:
   - Headers: `x-api-key` and `x-api-secret`.
   - Used for: Wallet management, withdrawals, and merchant stats.

2. **Moralis Stream Authentication**:
   - Header: `x-api-key` (Moralis-specific or legacy USDTWallet API key).
   - Used for: Creating and managing Moralis monitoring streams.

---

## 🛠️ Integration Workflow

### 1. Merchant Setup (Initial Only)
Before you can generate any user addresses, you must deploy your merchant factory contract.

**Endpoint:** `POST /api/merchant/deploy-contract`
- Body: `{"depositAddress": "YOUR_MASTER_EVM_WALLET_ADDRESS"}`

**Response Example:**
```json
{ "success": true, "message": "Contract deployed successfully" }
```

### 2. Generate a User Deposit Address
Create or retrieve a unique deposit address for one of your users.

**Endpoint:** `POST /api/wallet/deposit-address`
- **Body:**
  ```json
  {
    "userId": "user_id_in_your_system"
  }
  ```
- **Response:** Returns a `depositAddress`. Any USDT sent here will be tracked and forwarded to your master wallet.

**Response Example:**
```json
{
  "success": true,
  "data": {
    "userId": "user_id_in_your_system",
    "depositAddress": "0xabc...",
    "token": "USDT",
    "chain": "BSC"
  }
}
```

### 3. Creating a Withdrawal Request
When a user wants to withdraw funds, create a pending request.

**Endpoint:** `POST /api/wallet/withdraw`
- **Body:**
  ```json
  {
    "userId": "user_123",
    "amount": 50.0,
    "toAddress": "0xRecipientWalletAddress..."
  }
  ```

**Response Example:**
```json
{ "success": true, "message": "Withdrawal request created successfully" }
```

### 4. Processing Withdrawals (Merchant)
Merchants can retrieve pending withdrawals formatted for direct use in smart contract batch functions.

**Endpoint:** `GET /api/merchant/withdraw-requests/formatted`

**Response Example:**
```json
{
  "success": true,
  "data": [ ["0xAddress1", "0xAddress2"], ["100000000", "200000000"] ]
}
```

---

## 🔄 Webhooks (Moralis Streams)
To receive real-time notifications of deposits, you must configure a Moralis Stream.

1. **Create Stream**: `POST /api/moralis/streams`
   - Point the `webhookUrl` to your server.
2. **Handling Events**: Your server should listen for `POST` requests at your webhook URL.
   - VerifiLite provides a public endpoint to process these: `POST /api/webhooks/moralis`.

---

## 📊 Merchant Admin Endpoints
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/merchant/stats` | GET | Get total wallets, balance, and active user counts. |
| `/api/merchant/users` | GET | List all generated user wallets and their balances. |
| `/api/merchant/merchant-config` | GET | View your deployed factory contract address. |
