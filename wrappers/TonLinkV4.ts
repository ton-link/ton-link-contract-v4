import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, TupleBuilder } from 'ton-core';

export type TonLinkV4Config = {};

export function mainConfigToCell(config: TonLinkV4Config): Cell {
    return beginCell()
        .storeDict(null)
        .storeDict(null)
        .storeUint(0, 64)
        .storeDict(null)
        .storeDict(null)
        .storeUint(0, 64)
        .storeUint(Date.now(), 64)
    .endCell();
}

export class TonLinkV4 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new TonLinkV4(address);
    }

    static createFromConfig(config: TonLinkV4Config, code: Cell, workchain = 0) {
        const data = mainConfigToCell(config);
        const init = { code, data };
        return new TonLinkV4(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            bounce: false
        });
    }

    async sendAction(provider: ContractProvider, via: Sender, body: Cell) {
        var res = await provider.internal(via, {
                value: "1.5",
                body: body
        });
        return res
    }

    async sendStake(provider: ContractProvider, via: Sender, val: string) {
        var body = beginCell()
                .storeUint(40, 32)
                .storeUint(0, 64)
        .endCell()
        var res = await provider.internal(via, {
            value: val,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: body
        });
        return res
    }

    async get_vote_by_id(provider: ContractProvider, wallet: Address) {
        let args = new TupleBuilder();
        args.writeAddress(wallet);
        const { stack } = await provider.get("get_vote_by_id", args.build());
        return stack.readBigNumber();
    }

    async get_exchange_rate(provider: ContractProvider) {
        let args = new TupleBuilder();
        const { stack } = await provider.get("get_exchange_rate", args.build());
        return stack.readBigNumber();
    }
}
