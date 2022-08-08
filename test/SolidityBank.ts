import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SolidityBank", function () {
    const ONE_ETHER = ethers.utils.parseEther("1");
    const CONTRACT_BALANCE = ONE_ETHER;
    const HALF_CONTRACT_BALANCE = ethers.utils.parseEther("0.5");

    async function deployEmptyContract() {
        const SolidityBank = await ethers.getContractFactory('SolidityBank');
        const solidityBankContract = await SolidityBank.deploy();

        return { solidityBankContract };
    }

    async function deployContractWithOneDepositedEther() {
        const {solidityBankContract} = await deployEmptyContract();

        await solidityBankContract.enroll();
        await solidityBankContract.deposit({value: ONE_ETHER});

        const [owner] = await ethers.getSigners();

        return { solidityBankContract, owner };
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

            await solidityBankContract.deposit({value: ONE_ETHER});

            expect(await solidityBankContract.getBalance()).to.be.equal(ONE_ETHER);
        });
    });

    describe("withdraw", function () {
        it("Should revert if customer is not enrolled", async function () {
            const {solidityBankContract} = await loadFixture(deployEmptyContract);

            await expect(solidityBankContract.withdraw(1)).to.be.revertedWith('Customer is not enrolled');
        });

        it("Should not withdraw more than available", async function () {
            const {solidityBankContract} = await loadFixture(deployContractWithOneDepositedEther);

            await expect(solidityBankContract.withdraw(CONTRACT_BALANCE.add(1))).to.be.revertedWith('Can not withdraw more than available balance');
        });

        it("withdraws half balance should set balance to half", async function () {
            const {solidityBankContract} = await loadFixture(deployContractWithOneDepositedEther);
            
            await solidityBankContract.withdraw(HALF_CONTRACT_BALANCE);

            expect(await solidityBankContract.getBalance()).to.be.equal(HALF_CONTRACT_BALANCE);
        });

        it("withdraws half balance should send ethers to owner account", async function () {
            const {solidityBankContract, owner} = await loadFixture(deployContractWithOneDepositedEther);

            await expect(await solidityBankContract.withdraw(HALF_CONTRACT_BALANCE)).to.changeEtherBalances([solidityBankContract, owner], [HALF_CONTRACT_BALANCE.mul(-1), HALF_CONTRACT_BALANCE]);
        });
    });    
});
