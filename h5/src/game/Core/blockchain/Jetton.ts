

export const TonWeb = window["TonWeb"]

const { JettonMinter, JettonWallet } = TonWeb.token.jetton;
export const tonweb = new TonWeb(
    new TonWeb.HttpProvider("https://testnet.toncenter.com/api/v2/jsonRPC", {
        apiKey: "0b6ec5b0242bd7bdd6c24a2dc2cf1c8246713a5adefddbd09fb4c69608ecd901",
    })
);

export const getJettonBalance = async (jettonAddr: string, owner: string) => {
    const minter = await new JettonMinter(tonweb.provider, {
        adminAddress: new TonWeb.Address(owner),
        jettonContentUri: "",
        jettonWalletCodeHex: "",
        address: jettonAddr,
    });
    const walletAddr = await minter.getJettonWalletAddress(
        new TonWeb.Address(owner)
    );
    const jettonWallet = new JettonWallet(tonweb.provider, {
        address: walletAddr,
    });
    const data = await jettonWallet.getData();
    // console.log("getJettonBalance", data.balance.toNumber());
    return Number(data.balance);
};