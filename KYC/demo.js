const axios = require("axios");
const FormData = require("form-data");

/**
 * VerifiLite KYC API Demo
 *
 * 1. Check Tenant ID Availability
 * 2. Create Inquiry
 * 3. Add User Meta
 * 4. Submit Documents
 * 5. Complete Inquiry
 * 6. Get Inquiry Details
 */

// Configuration
const BASE_URL = "https://service.verifilite.com/v1";
const API_KEY = "YOUR_API_KEY";
const API_SECRET = "YOUR_API_SECRET";

const headers = {
  "x-api-key": API_KEY,
  "x-api-secret": API_SECRET,
};

async function kycIntegrationDemo() {
  const inquiryId = `demo_user_${Date.now()}`;

  try {
    console.log(`--- Starting KYC Integration for Inquiry: ${inquiryId} ---`);

    // 0. Check Tenant ID Availability
    console.log("\n[0/5] Checking Tenant ID Availability...");
    const checkRes = await axios.get(
      `${BASE_URL}/inquiry/check-tenant-id/${inquiryId}`,
      { headers }
    );
    /* Response:
    {
        "statusCode": 200,
        "data": {
            "message": "Tenant user ID is available",
            "available": true,
            "tenantUserId": "...",
            "widgetUrl": "..."
        }
    }
    */
    if (!checkRes.data.data.available) {
      console.log("Tenant ID already taken. Skipping...");
      return;
    }
    console.log(`Tenant ID is available. Widget URL: ${checkRes.data.data.widgetUrl}`);

    // 1. Create Inquiry
    console.log("\n[1/4] Creating Inquiry...");
    await axios.post(`${BASE_URL}/inquiry/create/${inquiryId}`, { headers });
    /* Response:
    { "success": true, "message": "Inquiry created successfully" }
    */
    console.log("Inquiry Created Successfully.");

    // 2. Add User Meta
    console.log("\n[2/4] Adding User Meta...");
    await axios.post(
      `${BASE_URL}/inquiry/user-meta/${inquiryId}`,
      {
        fullName: "John Doe",
        dateOfBirth: "1990-01-01",
        country: "United Kingdom",
      },
      { headers }
    );
    /* Response:
    { "success": true, "message": "User meta added successfully" }
    */
    console.log("Metadata Added.");

    // 3. Submit Documents (Multipart/Form-Data)
    console.log("\n[3/5] Submitting Documents...");
    const form = new FormData();
    form.append("submissionId", inquiryId);
    form.append("fullName", "John Doe");
    form.append("country", "United Kingdom");
    form.append("dateOfBirth", "1990-01-01");
    // Adding dummy buffers for demo purposes
    form.append("idFront", Buffer.from("dummy-id-front"), {
      filename: "id_front.jpg",
    });
    form.append("idBack", Buffer.from("dummy-id-back"), {
      filename: "id_back.jpg",
    });
    form.append("video", Buffer.from("dummy-video"), { filename: "video.mp4" });

    try {
      await axios.post(`${BASE_URL}/inquiry/submit/${inquiryId}`, form, {
        headers: { ...headers, ...form.getHeaders() },
      });
      /* 
      // ALTERNATIVE: Submit Single Document
      const singleDocForm = new FormData();
      singleDocForm.append("documentType", "ID_CARD");
      singleDocForm.append("idFront", Buffer.from("..."), { filename: "id_front.jpg" });
      singleDocForm.append("idBack", Buffer.from("..."), { filename: "id_back.jpg" });
      
      await axios.post(`${BASE_URL}/inquiry/submit-single/${inquiryId}`, singleDocForm, {
        headers: { ...headers, ...singleDocForm.getHeaders() },
      });
      */
      /* Response:
      { "success": true, "message": "Documents submitted successfully" }
      */
      console.log("Documents Submitted Successfully.");
    } catch (e) {
      console.log(
        "Document submission failed (likely dummy data rejected). Proceeding..."
      );
    }

    // 4. Web3 Identity Verification (Optional)
    console.log("\n[4/5] Starting Web3 Identity Verification...");
    const userAddress = "0x1234567890123456789012345678901234567890";

    console.log("Fetching transaction data for signing...");
    const txDataRes = await axios.post(
      `${BASE_URL}/web3/identity/transaction-data`,
      {
        inquiryId: inquiryId,
        userAddress: userAddress,
      },
      { headers }
    );
    /* Response:
    {
      "statusCode": 200,
      "data": {
        "message": "Transaction data retrieved successfully",
        "data": {
          "messageHash": "0x...",
          "message": "...",
          "nonce": "...",
          "userAddress": "0x...",
          "expiry": "..."
        }
      }
    }
    */

    if (txDataRes.data.data) {
      const { messageHash, message, nonce, expiry } = txDataRes.data.data.data;
      console.log(`Message to sign: "${message}"`);

      // In a real app, you would sign this with ethers/wagmi/web3.js
      const mockSignature = "0xabc123mocksignature...";

      console.log("Saving signed message...");
      await axios.post(
        `${BASE_URL}/web3/identity/save-signed-message`,
        {
          inquiryId: inquiryId,
          data: {
            messageHash,
            message,
            nonce,
            userAddress,
            expiry,
          },
        },
        { headers }
      );
      /* Response:
      { "statusCode": 201, "data": { "message": "Signed message saved successfully" } }
      */
      console.log("Web3 Signature Saved.");

      console.log("Submitting Signed Transaction (On-chain)...");
      await axios.post(
        `${BASE_URL}/web3/identity/submit-signed`,
        {
          inquiryId: inquiryId,
          userSignature: mockSignature,
          data: {
            messageHash,
            message,
            nonce,
            userAddress,
            expiry,
          },
        },
        { headers }
      );
      /* Response:
      { "statusCode": 201, "data": { "message": "Identity added onchain successfully" } }
      */
      console.log("Identity Added On-chain.");
    }

    // 5. Complete Inquiry
    console.log("\n[5/5] Finalizing Inquiry...");
    await axios.post(
      `${BASE_URL}/inquiry/${inquiryId}/complete`,
      {},
      { headers }
    );
    /* Response:
    { "success": true, "message": "Inquiry marked as complete" }
    */
    console.log("Inquiry Marked as Complete.");

    // Check Status
    console.log("\n--- Final Inquiry Details ---");
    const detailRes = await axios.get(
      `${BASE_URL}/inquiry/detail/${inquiryId}`,
      { headers }
    );
    /* Response:
    {
      "success": true,
      "data": {
        "id": 1,
        "status": "pending",
        "fullName": "John Doe",
        "created_at": "..."
      }
    }
    */
    console.log(JSON.stringify(detailRes.data, null, 2));
  } catch (error) {
    console.error("\n❌ API Error:");
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

kycIntegrationDemo();
