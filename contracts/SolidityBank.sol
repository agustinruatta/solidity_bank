// SPDX-License-Identifier: GPL v3
pragma solidity ^0.8.0;

contract SolidityBank {
    struct Customer {
        bool enrolled;
        bool balance;
    }

    mapping (address => Customer) customers;

    function getBalance() public view returns (uint256) {
        require(customers[msg.sender].enrolled, 'Customer is not enrolled');

        return 0;
    }
}
