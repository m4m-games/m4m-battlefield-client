import { BlockSubscriptionIndex } from "./BlockSubscriptionIndex";
import { ConnectWalletTonkeeper } from "./ConnectWalletTonkeeper";

const IS_TESTNET = true;
export const TONCENTER_API_KEY = IS_TESTNET ? '0b6ec5b0242bd7bdd6c24a2dc2cf1c8246713a5adefddbd09fb4c69608ecd901' : 'YOUR_MAINNET_API_KEY'; // obtain on https://toncenter.com
export const NODE_API_URL = IS_TESTNET ? 'https://testnet.toncenter.com/api/v2/jsonRPC' : 'https://toncenter.com/api/v2/jsonRPC';
export const INDEX_API_URL = IS_TESTNET ? 'https://testnet.toncenter.com/api/index/' : 'https://toncenter.com/api/index/';
export const MY_HOT_WALLET_ADDRESS = 'EQB7AhB4fP7SWtnfnIMcVUkwIgVLKqijlcpjNEPUVontypON';
export class DepositsJettons {
    public TonWeb: any;
    public tonwebsdk: any;
    public static get Instance(): DepositsJettons {
        if (this._instance == null) {
            this._instance = new DepositsJettons();
        }
        return this._instance;
    }
    private static _instance: DepositsJettons;
    public jettons = {};
    public TopUpAmount: any; // 0.05 TON
    public constructor() {
        this.TonWeb = window["TonWeb"];
        this.tonwebsdk = new this.TonWeb(new this.TonWeb.HttpProvider(NODE_API_URL, { apiKey: TONCENTER_API_KEY }));
        this.TopUpAmount = this.TonWeb.utils.toNano('0.05')//0.05TON;
        for (const jettonInfoName in this.jettonsInfo) {
            const jettonInfo = this.jettonsInfo[jettonInfoName];
            this.jettons[jettonInfoName] = new this.TonWeb.token.jetton.JettonMinter(this.tonwebsdk.provider, { address: jettonInfo.address });
        }
    }

    public async initWallet() {
        // console.error("newKeyPair", this.TonWeb.utils.newKeyPair());
        await this.createDepositWallet(ConnectWalletTonkeeper.Instance.tid, this.TonWeb.utils.newKeyPair()); // generate new keypair for user deposit wallet
        console.error('To deposit send jettons to address ' + (this.userIdToTonWallet[0]).address.toString(true, true, true));

        const masterchainInfo = await this.tonwebsdk.provider.getMasterchainInfo(); // get last masterchain info from node
        const lastMasterchainBlockNumber = masterchainInfo.last.seqno;
        console.error(`Starts from ${lastMasterchainBlockNumber} masterchain block`);

        // const blockSubscription = new BlockSubscriptionRaw(tonweb, lastMasterchainBlockNumber, onTransaction);
        // or
        const blockSubscription = new BlockSubscriptionIndex(this.tonwebsdk, lastMasterchainBlockNumber, this.onTransaction, INDEX_API_URL, TONCENTER_API_KEY);
        await blockSubscription.start();
    }


    public jettonsInfo = {
        'jUSDC': {
            address: 'EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728',
            decimals: 6,
            hasStandardInternalTransfer: true,
            minDepositAmount: '1' // minimum amount to deposit in units
        },
        'KOTE': {
            address: 'EQBlU_tKISgpepeMFT9t3xTDeiVmo25dW_4vUOl6jId_BNIj',
            decimals: 9,
            hasStandardInternalTransfer: true,
            minDepositAmount: '1' // minimum amount to deposit in units
        }
    };

    public userIdToTonWallet = {};
    public userIdToJettonWallet = {};
    public async createDepositWallet(userId, keyPair) {
        const wallet = this.createWallet(keyPair);
        console.error("wallet",wallet);
        const address = await wallet.getAddress();
        console.error(`user ${userId} deposit wallet is ` + address.toString(true, true, true))
        this.userIdToTonWallet[userId] = { address, keyPair };
        // get deposit jetton-wallet addresses for this user
        for (const jettonName in this.jettons) {
            const jetton = this.jettons[jettonName];
            const jettonAddress = await jetton.getJettonWalletAddress(address);
            console.error(`user ${userId} underlying ${jettonName} jetton-wallet is ` + jettonAddress.toString(true, true, true));
            if (!this.userIdToJettonWallet[userId]) {
                this.userIdToJettonWallet[userId] = {};
            }
            this.userIdToJettonWallet[userId][jettonName] = jettonAddress;
        }
        return address;
    }

    public createWallet(keyPair) {
        // console.error("this.tonwebsdk.provider", this.tonwebsdk.provider);
        const WalletClass = this.tonwebsdk.wallet.all.v3R2;
        const wallet = new WalletClass(this.tonwebsdk.provider, {
            publicKey: keyPair.publicKey
        });
        // console.error("wallet", wallet);
        return wallet;
    }

    public depositsRequests = [];
    public async onTransaction(tx) {
        const found = await this.findDepositAddress(tx.account);

        if (found) {
            if (!(await this.validateJettonTransfer(tx, found.jettonName))) {
                return;
            }

            const jettonInfo = this.jettonsInfo[found.jettonName]
            const jettonWalletAddress = this.userIdToJettonWallet[found.userId][found.jettonName];
            const jettonWallet = new this.TonWeb.token.jetton.JettonWallet(this.tonwebsdk.provider, { address: jettonWalletAddress });
            const jettonBalance = (await jettonWallet.getData()).balance;

            if (new this.TonWeb.utils.BN(jettonInfo.minDepositAmount).gt(jettonBalance)) {
                console.error('not enough jettons');
                return false;
            }

            console.error(found.jettonName + ' jetton deposit of user ' + found.userId + ' detected');

            // Your need create Toncoin top-up queue (see `withdrawals.js`) from you reserve wallet to user deposit wallet
            // You will send `TOP_UP_AMOUNT` small amount of Toncoins to deposit wallet. It's amount for gas to transfer jetton.

            // Add withdrawal request to top-up queue here:

            // topUpRequests.push({
            //     amount: TOP_UP_AMOUNT,
            //     toAddress: userIdToTonWallet[found.userId].address
            // });

            this.depositsRequests.push({ // request to transfer jettons from deposit wallet to hot wallet
                jettonName: found.jettonName,
                userId: found.userId
            });
        }
    }

    public findDepositAddress(addressString) {
        const address = new this.TonWeb.utils.Address(addressString).toString(false);

        for (const userId in this.userIdToJettonWallet) {
            for (const jettonInfoName in this.jettonsInfo) {
                const jettonWalletAddress = this.userIdToJettonWallet[userId][jettonInfoName].toString(false);
                if (address === jettonWalletAddress) {
                    return { userId: userId, jettonName: jettonInfoName };
                }
            }
        }
        return null;
    }

    public async validateJettonTransfer(txFromIndex, jettonName) {

        try {
            const jettonInfo = this.jettonsInfo[jettonName];

            const sourceAddress = txFromIndex.in_msg.source;
            if (!sourceAddress) {
                // external message - not related to jettons
                return false;
            }

            // For security, we double-check each deposit transaction with an additional direct request to the node
            const result = await this.tonwebsdk.provider.getTransactions(txFromIndex.account, 1, txFromIndex.lt, txFromIndex.hash);
            if (result.length < 1) {
                throw new Error('no transaction in node');
            }
            const tx = result[0];
            // You can check `in_msg` and `out_msgs` parameters between `txFromIndex` and `tx` from node

            if (tx.out_msgs.length === 1 && new this.TonWeb.utils.Address(tx.out_msgs[0].destination).toString(false) === new this.TonWeb.utils.Address(tx.in_msg.source).toString(false)) {
                return false; // bounced message - error in transaction
            }

            // KEEP IN MIND that jettons are not required to implement a common internal_transfer, although the vast majority of jettons do.
            // If you want to support an unusual jetton, you don't need to parse the internal_transfer, just look at the balance of the jetton-wallet and transfer it to the hot wallet.

            if (jettonInfo.hasStandardInternalTransfer) {

                if (!tx.in_msg.msg_data ||
                    tx.in_msg.msg_data['@type'] !== 'msg.dataRaw' ||
                    !tx.in_msg.msg_data.body
                ) {
                    // no in_msg or in_msg body
                    return false;
                }

                const msgBody = this.TonWeb.utils.base64ToBytes(tx.in_msg.msg_data.body);

                const cell = this.TonWeb.boc.Cell.oneFromBoc(msgBody);
                const slice = cell.beginParse();
                const op = slice.loadUint(32);
                if (!op.eq(new this.TonWeb.utils.BN(0x178d4519))) return; // op == internal_transfer_notification
                const queryId = slice.loadUint(64);
                const amount = slice.loadCoins(); // amount of incoming jettons in units
                const from = slice.loadAddress();

                if ((await this.jettons[jettonName].getJettonWalletAddress(new this.TonWeb.utils.Address(from))).toString(false) !== new this.TonWeb.utils.Address(sourceAddress).toString(false)) {
                    // fake transfer - IT IS VERY IMPORTANT TO DO THIS CHECK
                    return false;
                }
            }

            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    public async processDeposit(request) {
        const userTonWallet = this.userIdToTonWallet[request.userId];
        const keyPair = userTonWallet.keyPair;
        const wallet = this.createWallet(keyPair);

        const toncoinBalance = new this.TonWeb.utils.BN(await this.tonwebsdk.provider.getBalance(userTonWallet.address.toString(true, true, true)));

        if (new this.TonWeb.utils.BN(this.TopUpAmount).gt(toncoinBalance)) {
            return false; // wait for Toncoins top-up for gas to transfer jettons
        }

        const jettonWalletAddress = this.userIdToJettonWallet[request.userId][request.jettonName];
        const jettonWallet = new this.TonWeb.token.jetton.JettonWallet(this.tonwebsdk.provider, { address: jettonWalletAddress });

        const jettonBalance = (await jettonWallet.getData()).balance;

        const jettonInfo = this.jettonsInfo[request.jettonName];

        if (new this.TonWeb.utils.BN(jettonInfo.minDepositAmount).gt(jettonBalance)) {
            console.log('not enough jettons');
            return false;
        }

        const seqno = await wallet.methods.seqno().call() || 0;

        const transfer = await wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: jettonWalletAddress,
            amount: 0,
            seqno: seqno,
            sendMode: 128 + 32, // mode 128 is used for messages that are to carry all the remaining balance; mode 32 means that the current account must be destroyed if its resulting balance is zero;
            payload: await jettonWallet.createTransferBody({
                queryId: seqno, // any number
                jettonAmount: jettonBalance, // jetton amount in units
                toAddress: new this.TonWeb.utils.Address(MY_HOT_WALLET_ADDRESS),
                responseAddress: new this.TonWeb.utils.Address(MY_HOT_WALLET_ADDRESS)
            })
        });

        // IMPORTANT:
        // We send all Toncoin balance from deposit wallet and destroy deposit wallet smart contract.
        // After destroy deposit wallet account will be `unitialized`.
        // Don't worry, you can always deploy it again with the next transfer (and then immediately destroy it).
        // TON has a micro fee for storage, which is occasionally debited from the balance of smart contracts simply for the fact that it's data is stored in the blockchain.
        // If there is nothing on the balance, then after a while the account will be frozen.
        // To avoid this and to be able to always use this address for this user, we destroy the account after each transfer.
        // Destroyed accounts do not store data and therefore do not pay for storage.

        await transfer.send();

        // Jetton-wallet contract has automatic Toncoin balance replenishment during transfer -
        // at the time the jettons arrive, the jetton-wallet contract always leaves a small Toncoin amount on the balance, enough to store for about a year.
        //
        // In case of freezing, if the balance of jetton on the jetton-wallet contract is zero, then the incoming jettons will unfreeze it.
        //
        // However, a case is possible when a user sent too few jettons, your service did not transfer jettons to a hot wallet, and then this jetton-wallet was frozen.
        // In this case, the user can be offered to unfreeze his deposit address on his own by https://unfreezer.ton.org/

        return true;
    }
    public isProcessing: boolean = false;
    public async processDepositsTick() {
        if (!this.depositsRequests.length) return; // nothing to withdraw

        if (this.isProcessing) return;
        this.isProcessing = true;

        console.log(this.depositsRequests.length + ' requests');

        // Get first  request from queue from database

        const request = this.depositsRequests[0];

        try {
            if (await this.processDeposit(request)) {
                this.depositsRequests.shift(); // delete first request from queue
            }
        } catch (e) {
            console.error(e);
        }

        this.isProcessing = false;
    }

}