const axios = require('axios');

/**
 * VerifiLite Wallet API Demo
 * 
 * 1. Generate / Get Deposit Address
 * 2. Fetch User Wallet Status
 * 3. Request a Withdrawal
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

async function walletIntegrationDemo() {
    const userId = 'external_user_1212';

    try {
        console.log(`--- VerifiLite Wallet Demo ---`);

        // 1. (Admin) Deploy Merchant Contract
        // This is usually done once per merchant.
        console.log('\n[1/6] Deploying Merchant Contract (Mocked)...');
        // await axios.post(`${BASE_URL}/api/merchant/deploy-contract`, { depositAddress: '0xMerchantWallet...' }, { headers });
        console.log('Skipping deployment in demo (one-time setup).');

        // 2. Generate / Get Deposit Address for a User
        console.log(`\n[2/6] Generating/Fetching Deposit Address for user: ${userId}...`);
        const depositRes = await axios.post(`${BASE_URL}/api/wallet/deposit-address`, {
            userId: userId
        }, { headers });
        /* Response:
        {
          "success": true,
          "message": "Deposit address retrieved successfully",
          "data": {
            "userId": "1212",
            "depositAddress": "0xabc...",
            "token": "USDT",
            "chain": "BSC"
          }
        }
        */

        if (depositRes.data.success) {
            console.log(`✅ Address: ${depositRes.data.data.depositAddress}`);
        }

        // 3. Fetch User Wallet Status
        console.log('\n[3/6] Fetching Wallet Balance...');
        const userRes = await axios.get(`${BASE_URL}/api/wallet/user/${userId}`, { headers });
        /* Response:
        {
          "success": true,
          "data": {
            "wallet": { "balance": "100.00", "depositAddress": "0x..." },
            "transactions": [ { "type": "deposit", "amount": "50", "status": "completed" } ]
          }
        }
        */
        if (userRes.data.success) {
            console.log(`Current Balance: ${userRes.data.data.balance || '0.00'} USDT`);
        }

        // 4. Get Merchant Stats
        console.log('\n[4/6] Fetching Overall Merchant Stats...');
        const statsRes = await axios.get(`${BASE_URL}/api/merchant/stats`, { headers });
        /* Response:
        { "success": true, "data": { "totalWallets": 10, "totalBalance": "5000.00" } }
        */
        if (statsRes.data.success) {
            console.log(`Total Wallets: ${statsRes.data.data.totalWallets}`);
            console.log(`Total Merchant Balance: ${statsRes.data.data.totalBalance} USDT`);
        }

        // 5. List Merchant Wallets (Pagination)
        console.log('\n[5/6] Listing first 5 wallets...');
        const walletsRes = await axios.get(`${BASE_URL}/api/merchant/users?limit=5`, { headers });
        /* Response:
        {
          "success": true,
          "data": {
            "wallets": [ { "externalUserId": "...", "balance": "..." } ],
            "total": 10
          }
        }
        */
        if (walletsRes.data.success) {
            walletsRes.data.data.wallets.forEach(w => {
                console.log(`- User: ${w.externalUserId} | Balance: ${w.balance} | Address: ${w.depositAddress}`);
            });
        }

        // 6. Withdrawal Management
        console.log('\n[6/6] Fetching Formatted Withdrawals (Ready for Contract)...');
        const formattedWithdrawRes = await axios.get(`${BASE_URL}/api/merchant/withdraw-requests/formatted`, { headers });
        /* Response:
        {
          "success": true,
          "data": [ ["0xAddress1", "0xAddress2"], ["100000000", "200000000"] ]
        }
        */
        if (formattedWithdrawRes.data.success) {
            const [addresses, amounts] = formattedWithdrawRes.data.data;
            console.log(`Pending Withdrawals: ${addresses.length}`);
            if (addresses.length > 0) {
                console.log(`First Address: ${addresses[0]} | Amount: ${amounts[0]}`);
            }
        }

        console.log('\n--- Demo Complete ---');

    } catch (error) {
        console.error('\n❌ API Error:');
        if (error.response) {
            console.error(error.response.status, error.response.data.message || error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

walletIntegrationDemo();
