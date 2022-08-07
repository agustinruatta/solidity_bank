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
        it("Should revert if customer is not enrolled", async function () {
            const {solidityBankContract} = await loadFixture(deployEmptyContract);

            await expect(solidityBankContract.getBalance()).to.be.revertedWith('Customer is not enrolled');
        });
    });

    describe("amIEnrolled", function () {
        it("Should return false for non enrolled customer", async function () {
            const {solidityBankContract} = await loadFixture(deployEmptyContract);

            expect(await solidityBankContract.amIEnrolled()).to.be.false;
        });
    });

    describe("enroll", function () {
        it("Should enroll user", async function () {
            const {solidityBankContract} = await loadFixture(deployEmptyContract);

            await solidityBankContract.enroll();

            expect(await solidityBankContract.amIEnrolled()).to.be.true;
        });
    });    

    describe("deposit", function () {
        it("Should revert if customer is not enrolled", async function () {
            const {solidityBankContract} = await loadFixture(deployEmptyContract);

            await expect(solidityBankContract.deposit()).to.be.revertedWith('Customer is not enrolled');
        });

        it("Should add to balance", async function () {
            const {solidityBankContract} = await loadFixture(deployEmptyContract);

            solidityBankContract.enroll();

            const balance = ethers.utils.parseEther("1");

            await solidityBankContract.deposit({value: balance});

            expect(await solidityBankContract.getBalance()).to.be.equal(balance);
        });
    });    
});
