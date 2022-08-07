// SPDX-License-Identifier: GPL v3
pragma solidity ^0.8.0;

contract SolidityBank {
    struct Customer {
        bool enrolled;
        bool balance;
    }

    mapping (address => Customer) customers;

    function getBalance(address _address) public view returns (uint256) {
        require(customers[_address].enrolled, 'Customer is not enrolled');

        return 0;
    }
}
