import { Blockchain, SandboxContract, printTransactionFees, TreasuryContract } from '@ton-community/sandbox';
import { Cell, toNano, beginCell, } from 'ton-core';
import { TonLinkV4 } from '../wrappers/TonLinkV4';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { flattenTransaction } from "./transaction";
import { expect } from "chai";

describe('TonLink-V4', () => {
    let blockchain: Blockchain;
    let tonlink: SandboxContract<TonLinkV4>;
    let deployer: SandboxContract<TreasuryContract>;
    let feeder: SandboxContract<TreasuryContract>;
    let user: SandboxContract<TreasuryContract>;

    beforeEach(async () => {
        let code = await compile('TonLinkV4');
        blockchain = await Blockchain.create();

        tonlink = blockchain.openContract(TonLinkV4.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');
        feeder = await blockchain.treasury('feeder');
        user = await blockchain.treasury('user');

        await tonlink.sendDeploy(deployer.getSender(), toNano('0.05'));
    });

    describe("ton-link-v4", async () => {
        it('send 1 vote from 1 feeder', async () => {   
            let result = await tonlink.sendStake(feeder.getSender())
            let res = flattenTransaction(result.transactions[1]);
            expect(res.exitCode).to.equal(0)
            expect(res.aborted).to.equal(false)

            
            var body = beginCell()
                .storeUint(160, 32)
                .storeUint(0, 64)
                .storeUint(9213995, 64)
            .endCell()
            var result1 = await tonlink.sendAction(feeder.getSender(), body);
            var res1 = flattenTransaction(result1.transactions[1]);
            expect(res1.exitCode).to.equal(0)
            expect(res1.aborted).to.equal(false)

            var res2 = await tonlink.get_vote_by_id(feeder.address)
            expect(res2).to.equal(9213995n)

            var body = beginCell()
                .storeUint(170, 32)
                .storeUint(0, 64)
                .storeRef(beginCell().storeUint(0, 1).endCell())
            .endCell()
            var result3 = await tonlink.sendAction(user.getSender(), body);
            var res3 = flattenTransaction(result3.transactions[2]);
            expect(res3.exitCode).to.equal(0)
            expect(res3.aborted).to.equal(false)
        })
    })
});

