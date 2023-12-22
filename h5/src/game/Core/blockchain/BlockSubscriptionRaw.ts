import { DepositsJettons } from "./DepositsJettons";

export class BlockSubscriptionRaw {
    public tonweb
    public startMasterchainBlockNumber
    public onTransaction
    constructor(tonweb, startMasterchainBlockNumber, onTransaction) {
        this.tonweb = tonweb;
        this.startMasterchainBlockNumber = startMasterchainBlockNumber;
        this.onTransaction = onTransaction;
    }

    async start() {

        const onBlock = async (blockHeader) => {
            const workchain = blockHeader.id.workchain;
            const shardId = blockHeader.id.shard;
            const blockNumber = blockHeader.id.seqno;
            console.error('Got block ', workchain + ':' + shardId + ':' + blockNumber);

            // BlockId = workchain + shardId + blockNumber; these three parameters uniquely identify the block.

            const blockTransactions = await this.tonweb.provider.getBlockTransactions(workchain, shardId, blockNumber); // todo: (tolya-yanot) `incomplete` is not handled in response
            const shortTransactions = blockTransactions.transactions;
            for (const shortTx of shortTransactions) {
                await this.onTransaction(shortTx, blockHeader);
            }
        }

        // BlockStorage stores blocks that we have already processed
        // In this example we use in-memory storage
        // In real life you need to implement BlockStorage interface and use a real database (e.g. MySQL, PostgreSQL, MongoDB, etc).
        const storage = new DepositsJettons.Instance.TonWeb.InMemoryBlockStorage(log => console.error('DB: ' + log));

        const blockSubscribe = new DepositsJettons.Instance.TonWeb.BlockSubscription(this.tonweb.provider, storage, onBlock, {
            startMcBlockNumber: this.startMasterchainBlockNumber
        });
        await blockSubscribe.start();
    }
}
