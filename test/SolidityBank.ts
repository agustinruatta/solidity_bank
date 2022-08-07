import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SolidityBank", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshopt in every test.
    async function deployEmptyContract() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const SolidityBank = await ethers.getContractFactory('SolidityBank');
        const solidityBankContract = await SolidityBank.deploy();

        return { solidityBankContract };
    }

    describe("Deployment", function () {
        it("Should deploy the contract", async function () {
            const {solidityBankContract} = await loadFixture(deployEmptyContract);

            expect(solidityBankContract).to.not.empty;
        });
    });

    describe("getBalance", function () {
        it("Should throw an error if customer is not enrolled", async function () {
            const {solidityBankContract} = await loadFixture(deployEmptyContract);

            await expect(solidityBankContract.getBalance('0xb794f5ea0ba39494ce839613fffba74279579268')).to.be.revertedWith('Customer is not enrolled');
        });
    });

    
});
