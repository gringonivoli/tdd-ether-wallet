import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { EthersWallet } from "../typechain";

describe("EthersWallet Contract", function () {
    let EthersWallet;
    let ethersWallet: EthersWallet;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let addrs: SignerWithAddress[];

    beforeEach(async () => {
        EthersWallet = await ethers.getContractFactory("EthersWallet");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        ethersWallet = (await EthersWallet.deploy()) as EthersWallet;
    });

    it('should be deployed', () => {
        expect(ethersWallet).to.be.not.null;
    })

    it('should set right owner', async () => {
        expect(await ethersWallet.owner()).to.equal(owner.address);
    })

    it('should send ethers to contract', async () => {
        const beforeBalance = await owner.getBalance();
        await owner.sendTransaction({ to: ethersWallet.address, value: ethers.utils.parseEther('1.0') });
        const afterBalance = await owner.getBalance();
        expect(afterBalance.lt(beforeBalance)).to.equal(true);
    })

    it('should send ethers to contract if not owner', async () => {
        const beforeBalance = await addr1.getBalance();
        await addr1.sendTransaction({ to: ethersWallet.address, value: ethers.utils.parseEther('1.0') });
        const afterBalance = await addr1.getBalance();
        expect(afterBalance.lt(beforeBalance)).to.equal(true);
    })

    it('should receive ethers and get the balance', async () => {
        const oneEther = ethers.utils.parseEther('1.0');
        await owner.sendTransaction({ to: ethersWallet.address, value: oneEther });
        expect(await ethersWallet.getBalance()).to.equal(oneEther);
    })

    it('should withdraw ethers', async () => {
        const oneEther = ethers.utils.parseEther('1.0');
        await owner.sendTransaction({ to: ethersWallet.address, value: oneEther });
        await ethersWallet.withdraw(oneEther);
        expect(await ethersWallet.getBalance()).to.equal(0);
    });

    it('should not withdraw ethers if not owner', async () => {
        const oneEther = ethers.utils.parseEther('1.0');
        await owner.sendTransaction({ to: ethersWallet.address, value: oneEther });
        await expect(ethersWallet.connect(addr1).withdraw(oneEther)).to.be.revertedWith('Not owner');
    });
});