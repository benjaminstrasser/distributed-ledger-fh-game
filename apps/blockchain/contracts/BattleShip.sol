// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Ammo.sol";
import "./Armor.sol";

contract BattleShip is ERC721, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Ship {
        uint8 ammo;
        uint8 armor;
        uint256 id;
    }

    Ship[] private _ships;
    Ammo ammoToken;
    Armor armorToken;

    event ShipCreated(address owner, uint256 shipId);

    constructor(Ammo _ammoTokenContract, Armor _armorTokenContract) ERC721Burnable("FHCW_Battleship", "FHBSH") {
        ammoToken = _ammoTokenContract;
        armorToken = _armorTokenContract;
    }

    function createShip(address receiver, string memory tokenURI) public payable returns (uint256) {
        require(msg.value == 0.01 ether, "Ship price is ETH 0.01: not enough!");
        _tokenIds.increment();

        uint256 newBattleShipTokenId = _tokenIds.current();
        _mint(receiver, newBattleShipTokenId);
        _setTokenURI(newBattleShipTokenId, tokenURI);
        ammoToken.initializeAmmo(receiver, 10);
        armorToken.initializeArmor(receiver, 10);
        _ships.push(
            Ship({
                    ammo: 10,
                    armor: 10,
                    id: newBattleShipTokenId
                })
        );
        return newBattleShipTokenId;
    }

    function attack(uint256 attackerShipId, uint256 defenderShipId) public {
        require(ownerOf(attackerShipId) == msg.sender);
        require(_exists(defenderShipId));
        address attacker = ownerOf(attackerShipId);
        ammoToken.decreaseAmmo(attacker, 1);
        armorToken.decreaseArmor(defenderShipId, 1);
        _ships[attackerShipId].armor--;
        _ships[defenderShipId].ammo--;
    }
}
