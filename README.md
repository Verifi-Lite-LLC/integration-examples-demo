# VerifiLite API Integration & Demos

Welcome to the official repository for **VerifiLite API Integration**. This repository is designed to help developers quickly understand and implement VerifiLite's core services through comprehensive documentation, executable demo code, and an easy-to-use SDK.

---

## 📖 What's Inside?

This repository serves as a central hub for integrating VerifiLite into your platform. It includes:

- **Integration Guides**: Detailed walk-throughs for KYC and Wallet services.
- **Executable Demos**: Real-world Node.js and HTML examples to see the APIs in action.
- **Official SDK**: A type-safe TypeScript/JavaScript SDK for rapid development.
- **Postman Collections**: Pre-configured collections for testing endpoints.

---

## 🚀 Services Overview

| Service | Description | Quick Links |
| :--- | :--- | :--- |
| **KYC API** | Identity verification, document submission, and liveness checks. | [Guide](./KYC_INTEGRATION.md) • [Demo](./KYC) |
| **Wallet API** | On-chain deposit handling, gasless forwarding, and withdrawals. | [Guide](./WALLET_INTEGRATION.md) • [Demo](./Wallet) |
| **Node.js SDK** | The fastest way to integrate VerifiLite KYC into your backend. | [SDK Details](./sdk) • [Examples](./sdk/examples) |

---

## 🛠️ Demo Code & Examples

We believe in "learning by doing." Explore the following executable examples to get started:

### 🆔 KYC (Identity Verification)
- **[KYC Node.js Demo](./KYC/demo.js)**: Full workflow from inquiry creation to document submission.
- **[Widget Iframe HTML](./KYC/widget_iframe.html)**: Learn how to embed the VerifiLite verification widget in your frontend.

### 💰 Wallet (Asset Management)
- **[User Wallet Demo](./Wallet/demo.js)**: Generating deposit addresses and tracking balances.
- **[Merchant Admin Demo](./Wallet/merchant_demo.js)**: Managing sweeping (forwarding) and withdrawals.

### 📦 VerifiLite SDK
- **[SDK Usage Example](./sdk/examples/usage.ts)**: See how to use our official TypeScript SDK for a cleaner integration.

---

## 🔐 Getting Started

1. **Obtain Credentials**: You will need an `API Key` and `API Secret` provided by the VerifiLite team.
2. **Set Environment**: Most demos use a `Base URL` (usually `https://service.verifilite.com/v1`).
3. **Run Demos**:
   ```bash
   # Example: Running the KYC demo
   cd KYC
   node demo.js
   ```

> [!TIP]
> Always check the **Authentication** section in the individual integration guides for specific header requirements.

---

## 📩 Support & Resources

- **Website**: [verifilite.com](https://verifilite.com)
- **Support**: [support@verifilite.com](mailto:support@verifilite.com)
- **Postman**: Collections are available in the `/KYC` and `/Wallet` directories for direct import.

---

*Proudly built for developers by the VerifiLite Team.*
