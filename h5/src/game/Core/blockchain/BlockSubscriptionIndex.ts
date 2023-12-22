export class BlockSubscriptionIndex {
    public tonweb;
    public lastProcessedMasterchainBlockNumber;
    public onTransaction: Function;
    public indexApiUrl;
    public indexApiKey;
    constructor(tonweb, lastProcessedMasterchainBlockNumber, onTransaction: Function, indexApiUrl, indexApiKey) {
        this.tonweb = tonweb;
        this.lastProcessedMasterchainBlockNumber = lastProcessedMasterchainBlockNumber;  // saved in DB; last masterchain block number that your service processed
        this.onTransaction = onTransaction;
        this.indexApiUrl = indexApiUrl;
        this.indexApiKey = indexApiKey;
    }

    async start() {

        /**
         * HTTP request to Index API
         * @param masterchainBlockNumber    {number}
         * @return {Promise<Object>}
         */
        const getTransactionsByMasterchainSeqno = (masterchainBlockNumber) => {
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-Key': this.indexApiKey
            };
            console.error(this.indexApiUrl + 'getTransactionsByMasterchainSeqno?seqno=' + masterchainBlockNumber);

            return fetch(
                this.indexApiUrl + 'getTransactionsByMasterchainSeqno?seqno=' + masterchainBlockNumber,
                {
                    method: 'GET',
                    headers: headers,
                })
                .then((response) => response.json())
                .then(response => response.error ? Promise.reject(response.error) : response)
        }

        let isProcessing = false;

        const tick = async () => {
            if (isProcessing) return;
            isProcessing = true;

            try {
                const masterchainInfo = await this.tonweb.provider.getMasterchainInfo(); // get last masterchain info from node
                const lastMasterchainBlockNumber = masterchainInfo.last.seqno;

                if (lastMasterchainBlockNumber > this.lastProcessedMasterchainBlockNumber) {
                    const masterchainBlockNumber = this.lastProcessedMasterchainBlockNumber + 1;

                    const transactions = await getTransactionsByMasterchainSeqno(masterchainBlockNumber); // get all transactions (executed in masterchain and shardchains) related for this block number

                    console.error('Got masterchain block ' + masterchainBlockNumber + ' and related shard blocks');

                    for (const tx of transactions) {
                        await this.onTransaction(tx);
                    }

                    this.lastProcessedMasterchainBlockNumber = masterchainBlockNumber; // save in DB
                }
            } catch (e) {
                console.error(e);
            }

            isProcessing = false;
        }

        setInterval(tick, 1000); // new masterchain block created every ~5 seconds
    }
}