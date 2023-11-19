import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { Cell, toNano, beginCell, OpenedContract, } from 'ton-core';
import { TonLinkV4 } from '../wrappers/TonLinkV4';
import { compile } from '@ton-community/blueprint';
import '@ton-community/test-utils';


describe('TonLink-V4', () => {
    let code: Cell;
    let blockchain: Blockchain;
    let tonlink: SandboxContract<TonLinkV4>;
    let deployer: SandboxContract<TreasuryContract>;
    let feeder: SandboxContract<TreasuryContract>;
    let feeder2: SandboxContract<TreasuryContract>;
    let feeder3: SandboxContract<TreasuryContract>;
    let feeder4: SandboxContract<TreasuryContract>;
    let warden: SandboxContract<TreasuryContract>;
    let user: SandboxContract<TreasuryContract>;

    beforeAll(async () => {
        code = await compile('TonLinkV4');
    });
    
    beforeEach(async () => {
        blockchain = await Blockchain.create();

        //blockchain.verbosity = {...blockchain.verbosity, debugLogs: true}

        tonlink = blockchain.openContract(TonLinkV4.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');
        feeder = await blockchain.treasury('feeder');
        feeder2 = await blockchain.treasury('feeder2');
        feeder3 = await blockchain.treasury('feeder3');
        feeder4 = await blockchain.treasury('feeder4');
        user = await blockchain.treasury('user');
        warden = await blockchain.treasury('warden');
    });

    it('should deploy', async () => {
        let deployResult = await tonlink.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonlink.address,
            deploy: true,
        });
    });

    it('send 1 vote from 1 feeder', async () => {   
        let result = await tonlink.sendStake(feeder.getSender(), "30000")
        expect(result.transactions).toHaveTransaction({
            from: feeder.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        let body = beginCell()
            .storeUint(200, 32)
            .storeUint(0, 64)
        .endCell()
        result = await tonlink.sendAction(warden.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: warden.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        body = beginCell()
            .storeUint(160, 32)
            .storeUint(0, 64)
            .storeUint(9213995, 64)
        .endCell()
        result = await tonlink.sendAction(feeder.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: feeder.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        body = beginCell()
            .storeUint(220, 32)
            .storeUint(0, 64)
        .endCell()
        result = await tonlink.sendAction(warden.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: warden.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        let er = await tonlink.get_exchange_rate();
        expect(er).toEqual(9213995n)
    })

    it('send 1 vote from 2 feeder', async () => {   
        let result = await tonlink.sendStake(feeder.getSender(), "30000")
        expect(result.transactions).toHaveTransaction({
            from: feeder.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        result = await tonlink.sendStake(feeder2.getSender(), "30")
        expect(result.transactions).toHaveTransaction({
            from: feeder2.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        let body = beginCell()
            .storeUint(200, 32)
            .storeUint(0, 64)
        .endCell()
        result = await tonlink.sendAction(warden.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: warden.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        body = beginCell()
            .storeUint(160, 32)
            .storeUint(0, 64)
            .storeUint(9213995, 64)
        .endCell()
        result = await tonlink.sendAction(feeder.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: feeder.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        body = beginCell()
            .storeUint(160, 32)
            .storeUint(0, 64)
            .storeUint(1500000, 64)
        .endCell()
        result = await tonlink.sendAction(feeder2.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: feeder2.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        body = beginCell()
            .storeUint(220, 32)
            .storeUint(0, 64)
        .endCell()
        result = await tonlink.sendAction(warden.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: warden.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        let er = await tonlink.get_exchange_rate();
        expect(er).toEqual(9213995n)
    })

    it('send 1 vote from 3 feeder', async () => {   
        let result = await tonlink.sendStake(feeder.getSender(), "30000")
        expect(result.transactions).toHaveTransaction({
            from: feeder.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        result = await tonlink.sendStake(feeder2.getSender(), "30")
        expect(result.transactions).toHaveTransaction({
            from: feeder2.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        result = await tonlink.sendStake(feeder3.getSender(), "250000")
        expect(result.transactions).toHaveTransaction({
            from: feeder3.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        let body = beginCell()
            .storeUint(200, 32)
            .storeUint(0, 64)
        .endCell()
        result = await tonlink.sendAction(warden.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: warden.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        body = beginCell()
            .storeUint(160, 32)
            .storeUint(0, 64)
            .storeUint(9213995, 64)
        .endCell()
        result = await tonlink.sendAction(feeder.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: feeder.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        body = beginCell()
            .storeUint(160, 32)
            .storeUint(0, 64)
            .storeUint(1500000, 64)
        .endCell()
        result = await tonlink.sendAction(feeder2.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: feeder2.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        body = beginCell()
            .storeUint(160, 32)
            .storeUint(0, 64)
            .storeUint(1500000, 64)
        .endCell()
        result = await tonlink.sendAction(feeder3.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: feeder3.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        body = beginCell()
            .storeUint(220, 32)
            .storeUint(0, 64)
        .endCell()
        result = await tonlink.sendAction(warden.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: warden.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        let er = await tonlink.get_exchange_rate();
        expect(er).toEqual(1500000n)
    })

    it('send 2 vote from 1 feeder', async () => {   
        let result = await tonlink.sendStake(feeder.getSender(), "1")
        expect(result.transactions).toHaveTransaction({
            from: feeder.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        let body = beginCell()
            .storeUint(200, 32)
            .storeUint(0, 64)
        .endCell()
        result = await tonlink.sendAction(warden.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: warden.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        body = beginCell()
            .storeUint(160, 32)
            .storeUint(0, 64)
            .storeUint(9213995, 64)
        .endCell()
        result = await tonlink.sendAction(feeder.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: feeder.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        body = beginCell()
            .storeUint(220, 32)
            .storeUint(0, 64)
        .endCell()
        result = await tonlink.sendAction(warden.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: warden.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        let er = await tonlink.get_exchange_rate();
        expect(er).toEqual(9213995n)

        body = beginCell()
            .storeUint(160, 32)
            .storeUint(0, 64)
            .storeUint(2300000, 64)
        .endCell()
        result = await tonlink.sendAction(feeder.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: feeder.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        body = beginCell()
            .storeUint(220, 32)
            .storeUint(0, 64)
        .endCell()
        result = await tonlink.sendAction(warden.getSender(), body);
        expect(result.transactions).toHaveTransaction({
            from: warden.address,
            to: tonlink.address,
            aborted: false,
            exitCode: 0,
        });

        er = await tonlink.get_exchange_rate();
        expect(er).toEqual(2300000n)
    })
});

