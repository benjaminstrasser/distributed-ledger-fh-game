// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Ammo is ERC20Burnable, Ownable {
    constructor() ERC20('Ammo', 'AMM') {}

    function increaseAmmo(address battleshipOwner, uint8 amount) public onlyOwner {
        _mint(battleshipOwner, amount);
    }

    function decreaseAmmo(address battleshipOwner, uint8 amount) public onlyOwner {
        _burn(battleshipOwner, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override(ERC20) onlyOwner returns (bool) {
        _transfer(from, to, amount);
        return true;
    }
}
