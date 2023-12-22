import { BlockSubscriptionIndex } from "./BlockSubscriptionIndex";

export const IS_TESTNET = true;
export const TONCENTER_API_KEY = IS_TESTNET ? '0b6ec5b0242bd7bdd6c24a2dc2cf1c8246713a5adefddbd09fb4c69608ecd901' : '0b6ec5b0242bd7bdd6c24a2dc2cf1c8246713a5adefddbd09fb4c69608ecd901'; // obtain on https://toncenter.com
// You can use your own instance of TON-HTTP-API or public toncenter.com
export const NODE_API_URL = IS_TESTNET ? 'https://testnet.toncenter.com/api/v2/jsonRPC' : 'https://toncenter.com/api/v2/jsonRPC';
export const INDEX_API_URL = IS_TESTNET ? 'https://testnet.toncenter.com/api/index/' : 'https://toncenter.com/api/index/';

export const MY_HOT_WALLET_ADDRESS = 'EQB7AhB4fP7SWtnfnIMcVUkwIgVLKqijlcpjNEPUVontypON';
export class Deposits {
    public static get Instance(): Deposits {
        if (this._instance == null) {
            this._instance = new Deposits();
        }
        return this._instance;
    }
    private static _instance: Deposits;
    public TonWeb: any;
    public tonwebsdk: any
    constructor() {
        this.TonWeb = window["TonWeb"];
        this.tonwebsdk = new this.TonWeb(new this.TonWeb.HttpProvider(NODE_API_URL, { apiKey: TONCENTER_API_KEY }));
    }



    /**
     * @param   address {string}
     * @return {boolean}
     */
    public async isDepositAddress(address) {
        new this.TonWeb.Address(address).toString(true, true, true); // convert address to you form
        // more about address forms - https://ton.org/docs/#/howto/step-by-step?id=_1-smart-contract-addresses

        // check in DB that this address is one of deposit addresses of your service

        return false;
    }

    public createWallet(keyPair) {
        const WalletClass = this.tonwebsdk.wallet.all.v3R2;
        const wallet = new WalletClass(this.tonwebsdk.provider, {
            publicKey: keyPair.publicKey
        });
        return wallet;
    }

    /**
     * @param tx    {Object}
     * @return {Promise<void>}
     */
    public processDeposit = async (tx) => {
        const balance = new this.TonWeb.utils.BN(await this.tonwebsdk.provider.getBalance(tx.address.account_address));

        if (balance.gt(new this.TonWeb.utils.BN(0))) {

            const keyPair = this.TonWeb.utils.nacl.sign.keyPair(); // get key pair for this deposit wallet from your database

            const depositWallet = this.createWallet(keyPair);

            const seqno = await depositWallet.methods.seqno().call();

            const transfer = await depositWallet.methods.transfer({
                secretKey: keyPair.secretKey,
                toAddress: MY_HOT_WALLET_ADDRESS,
                amount: 0,
                seqno: seqno,
                payload: '123', // if necessary, here you can set a unique payload to distinguish the incoming payment to the hot wallet
                sendMode: 128 + 32, // mode 128 is used for messages that are to carry all the remaining balance; mode 32 means that the current account must be destroyed if its resulting balance is zero;
            });

            // IMPORTANT:
            // We send all balance from deposit wallet to hot wallet and destroy deposit wallet smart contract.
            // After destroy deposit wallet account will be `unitialized`.
            // Don't worry, you can always deploy it again with the next transfer (and then immediately destroy it).
            // TON has a micro fee for storage, which is occasionally debited from the balance of smart contracts simply for the fact that it's data is stored in the blockchain.
            // If there is nothing on the balance, then after a while the account will be frozen.
            // To avoid this and to be able to always use this address for this user, we destroy the account after each transfer.
            // Destroyed accounts do not store data and therefore do not pay for storage.

            await transfer.send();

            // In real life, you need to create a new transfer task, and repeat it until the balance of the deposit wallet is positive.
            // In case the API `send` call for some reason was not executed the first time.

            // You can process incoming coins on the hot wallet as described in `deposits-single-wallet.js`

        }
    }

    public onTransaction = async (tx) => {
        // ATTENTION: ALWAYS CHECK THAT THERE WERE NO OUTGOING MESSAGES.
        // It is important to check that Toncoins did not bounce back in case of an error.
        // To do this, we check that there was only an incoming message and there were no outgoing messages.

        if (tx.out_msgs.length > 0) {
            return;
        }

        // If the `tx.account` address is in your database of deposit addresses
        // then we check and process the deposit

        if (await this.isDepositAddress(tx.account)) {
            // For security, we double-check each deposit transaction with an additional direct request to the node
            const result = await this.tonwebsdk.provider.getTransactions(tx.account, 1, tx.lt, tx.hash);
            if (result.length < 1) {
                throw new Error('no transaction in node');
            }
            const txFromNode = result[0];
            // You can check `in_msg` and `out_msgs` parameters between `tx` and `txFromNode`

            await this.processDeposit(txFromNode); // use tx from your own node
        }
    }

    public async init() {
        const masterchainInfo = await this.tonwebsdk.provider.getMasterchainInfo(); // get last masterchain info from node
        const lastMasterchainBlockNumber = masterchainInfo.last.seqno;
        console.log(`Starts from ${lastMasterchainBlockNumber} masterchain block`);

        // const blockSubscription = new BlockSubscriptionRaw(tonweb, lastMasterchainBlockNumber, onTransaction);
        // or
        const blockSubscription = new BlockSubscriptionIndex(this.tonwebsdk, lastMasterchainBlockNumber, this.onTransaction, INDEX_API_URL, TONCENTER_API_KEY);
        await blockSubscription.start();
    }
}