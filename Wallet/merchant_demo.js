const axios = require('axios');

/**
 * VerifiLite Wallet API - Merchant Admin Demo
 * 
 * Demonstrates:
 * 1. Fetching merchant statistics
 * 2. Deploying a merchant factory contract (on BSC)
 * 3. Getting merchant configuration
 * 4. Listing all merchant users/wallets
 * 5. Managing withdrawal requests
 */

// Configuration
const BASE_URL = 'https://wallet.verifilite.com'; // Adjust to your actual Wallet API endpoint
const MERCHANT_API_KEY = 'YOUR_MERCHANT_KEY';
const MERCHANT_API_SECRET = 'YOUR_MERCHANT_SECRET';

const headers = {
    'x-api-key': MERCHANT_API_KEY,
    'x-api-secret': MERCHANT_API_SECRET,
    'Content-Type': 'application/json'
};

async function merchantAdminDemo() {
    try {
        console.log("--- VerifiLite Merchant Admin Integration Demo ---\n");

        // 1. Get Merchant Stats
        console.log("[1/5] Fetching Merchant Stats...");
        const statsRes = await axios.get(`${BASE_URL}/api/merchant/stats`, { headers });
        /* Response:
        { "success": true, "data": { "totalWallets": 10, "totalBalance": "5000.00" } }
        */
        if (statsRes.data.success) {
            console.log(`Total Wallets: ${statsRes.data.data.totalWallets}`);
            console.log(`Total Merchant Balance: ${statsRes.data.data.totalBalance} USDT`);
        }

        // 2. Get Merchant Config
        console.log("\n[2/5] Fetching Merchant Configuration...");
        const configRes = await axios.get(`${BASE_URL}/api/merchant/merchant-config`, { headers });
        /* Response:
        { "success": true, "data": { "meta": { "factoryAddress": "0x..." } } }
        */
        if (configRes.data.success) {
            console.log(`Factory Address: ${configRes.data.data.meta.factoryAddress || 'Not Deployed'}`);
        }

        // 3. List Merchant Users (Wallets)
        console.log("\n[3/5] Listing Merchant User Wallets...");
        const usersRes = await axios.get(`${BASE_URL}/api/merchant/users?limit=5&offset=0`, { headers });
        /* Response:
        {
          "success": true,
          "data": {
            "wallets": [ { "externalUserId": "...", "depositAddress": "...", "balance": "..." } ],
            "total": 10
          }
        }
        */
        if (usersRes.data.success) {
            console.log(`Found ${usersRes.data.data.total} total wallets.`);
            usersRes.data.data.wallets.forEach(wallet => {
                console.log(` - User ${wallet.externalUserId}: ${wallet.depositAddress} (Balance: ${wallet.balance})`);
            });
        }

        // 4. Get Withdrawal Requests
        console.log("\n[4/5] Fetching Withdrawal Requests...");
        const withdrawRes = await axios.get(`${BASE_URL}/api/merchant/withdraw-requests`, { headers });
        /* Response:
        { "success": true, "data": [ { "id": 1, "userId": "...", "amount": "50", "status": "pending" } ] }
        */
        if (withdrawRes.data.success) {
            console.log(`Found ${withdrawRes.data.data.length} withdrawal requests.`);
        }

        // 5. Deploy Merchant Contract
        // NOTE: This usually only needs to be done once per merchant.
        console.log("\n[5/5] Deploy Contract Example (Commented out)...");
        /*
        const deployRes = await axios.post(`${BASE_URL}/api/merchant/deploy-contract`, {
            depositAddress: "0xYourMerchantMasterWalletAddress"
        }, { headers });
        console.log(deployRes.data.message);
        */
        console.log("Contract deployment is a one-time operation per merchant.");

        console.log("\n--- Demo Complete ---");

    } catch (error) {
        console.error('\n❌ Admin API Error:');
        if (error.response) {
            console.error(error.response.status, error.response.data.message || error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

merchantAdminDemo();
