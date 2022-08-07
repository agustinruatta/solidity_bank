// SPDX-License-Identifier: GPL v3
pragma solidity ^0.8.0;

contract SolidityBank {
    struct Customer {
        bool enrolled;
        uint256 balance;
    }

    mapping (address => Customer) customers;

    modifier assertEnrolled {
        require(customers[msg.sender].enrolled, 'Customer is not enrolled');
        _;
    }

    function getBalance() public assertEnrolled view returns (uint256) {
        return customers[msg.sender].balance;
    }

    function amIEnrolled() public view returns (bool) {
        return customers[msg.sender].enrolled;
    }

    function enroll() public {
        customers[msg.sender].enrolled = true;
    }

    function deposit() public assertEnrolled payable {
        customers[msg.sender].balance += msg.value;
    }
}
