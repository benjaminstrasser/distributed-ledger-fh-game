// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Ammo is ERC20Burnable, Ownable {

    constructor() ERC20("Ammo", "AMM") {
    }

    function initializeAmmo(address battleshipOwner, uint8 amount) public {
        _mint(battleshipOwner, amount);
    }

    function decreaseAmmo(address battleshipOwner, uint8 amount) public {
        _burn(battleshipOwner, amount);
    }
}
