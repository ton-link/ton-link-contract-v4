import { toNano } from 'ton-core';
import { TonLinkV4 } from '../wrappers/TonLinkV4';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const main = provider.open(TonLinkV4.createFromConfig({}, await compile('TonLinkV4')));

    await main.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(main.address);

    // run methods on `main`
}