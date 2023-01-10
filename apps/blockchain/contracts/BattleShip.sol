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
        string shipName;
        uint8 ammo;
        uint8 armor;
        uint256 id;
    }

    Ship[] private _ships;

    mapping(uint256 => uint256) public tokenIndex;

    Ammo ammoToken;
    Armor armorToken;

    event ShipCreated(address owner, uint256 shipId);

    constructor() ERC721("FHCW_Battleship", "FHBSH") {
        ammoToken = new Ammo();
        armorToken = new Armor();
    }

    function createShip(address receiver, string memory name) public payable returns (uint256) {
        require(msg.value == 0.01 ether, "Ship price is ETH 0.01: not enough!");
        _tokenIds.increment();

        uint256 newBattleShipTokenId = _tokenIds.current();
        _mint(receiver, newBattleShipTokenId);
        ammoToken.initializeAmmo(receiver, 10);
        armorToken.initializeArmor(receiver, 10);
        _ships.push(
            Ship({
                    shipName: name,
                    ammo: 10,
                    armor: 10,
                    id: newBattleShipTokenId
                })
        );
        tokenIndex[newBattleShipTokenId] = _ships.length - 1;
        return newBattleShipTokenId;
    }

    function attack(uint256 attackerShipId, uint256 defenderShipId) public {
        require(ownerOf(attackerShipId) == msg.sender, "You are not the owner of the attacking ship!");
        require(_exists(defenderShipId));
        address attacker = ownerOf(attackerShipId);
        ammoToken.decreaseAmmo(attacker, 1);
        address defender = ownerOf(defenderShipId);
        armorToken.decreaseArmor(defender, 1);
        _ships[tokenIndex[attackerShipId]].armor--;
        _ships[tokenIndex[defenderShipId]].ammo--;
    }

    function getArmorContractAddress() public view onlyOwner returns (address) {
        return address(armorToken);
    }

    function getAmmoContractAddress() public view onlyOwner returns (address) {
        return address(ammoToken);
    }
}
