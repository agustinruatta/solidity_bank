// SPDX-License-Identifier: GPL v3
pragma solidity ^0.8.0;

contract SolidityBank {
    struct Customer {
        bool enrolled;
        uint256 balance;
    }

    mapping (address => Customer) customers;

    function getBalance() public view returns (uint256) {
        require(customers[msg.sender].enrolled, 'Customer is not enrolled');

        return customers[msg.sender].balance;
    }

    function amIEnrolled() public view returns (bool) {
        return customers[msg.sender].enrolled;
    }

    function enroll() public {
        customers[msg.sender].enrolled = true;
    }

    function deposit() public payable {
        require(customers[msg.sender].enrolled, 'Customer is not enrolled');

        customers[msg.sender].balance += msg.value;
    }
}
