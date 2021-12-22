// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

contract EthersWallet {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function withdraw(uint256 amount) external {
        require(msg.sender == owner, "Not owner");
        owner.transfer(amount);
    }

    receive() external payable {}
}
