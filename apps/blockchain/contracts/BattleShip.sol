// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './Ammo.sol';
import './Armor.sol';

contract BattleShip is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Ship {
        address owner;
        uint id;
        uint armor;
        uint ammo;
        uint lastHeal;
        uint LastShot;
    }

    mapping(uint256 => uint) lastAttack;
    mapping(uint256 => uint) lastHeal;

    Ammo ammoToken;
    Armor armorToken;

    event ShipCreated(address owner, uint256 shipId);

    constructor() ERC721('BattleShip', 'FHBSH') {
        ammoToken = new Ammo();
        armorToken = new Armor();
    }

    function createShip() public payable returns (uint256) {
        require(msg.value == 0.01 ether, 'Ship price is ETH 0.01: not enough!');
        _tokenIds.increment();
        uint256 newBattleShipTokenId = _tokenIds.current();
        address currentIdAddress = address(uint160(_tokenIds.current()));
        _mint(msg.sender, _tokenIds.current());
        ammoToken.increaseAmmo(currentIdAddress, 10);
        armorToken.increaseArmor(currentIdAddress, 10);
        return newBattleShipTokenId;
    }

    function attack(uint160 attackerShipId, uint160 defenderShipId) public {
        address attackerShipAddress = address(attackerShipId);
        address defenderShipAddress = address(defenderShipId);

        require(
            ownerOf(attackerShipId) == msg.sender,
            'You are not the owner of the attacking ship!'
        );
        require(_exists(defenderShipId));
        require(ammoToken.balanceOf(attackerShipAddress) > 0);
        require(lastAttack[attackerShipId] != block.number, 'Already Attacked this turn');
        require(lastHeal[defenderShipId] + 3 < block.number);

        lastAttack[attackerShipId] = block.number;

        if (lastHeal[defenderShipId] + 3 < block.number && lastHeal[defenderShipId] != 0) {
            armorToken.increaseArmor(defenderShipAddress, 2);
            lastHeal[defenderShipId] = 0;
        }

        if (lastAttack[attackerShipId] + 3 < block.number) {
            armorToken.decreaseArmor(defenderShipAddress, 2);
        } else {
            armorToken.decreaseArmor(defenderShipAddress, 1);
        }
        ammoToken.decreaseAmmo(attackerShipAddress, 1);

        if (armorToken.balanceOf(defenderShipAddress) <= 0) {
            _burn(defenderShipId);
            ammoToken.transferFrom(
                defenderShipAddress,
                attackerShipAddress,
                ammoToken.balanceOf(defenderShipAddress)
            );
        }
    }

    function getArmorContractAddress() public view onlyOwner returns (address) {
        return address(armorToken);
    }

    function transfer(uint160 fromShipId, uint160 toShipId) public {
        require(ownerOf(fromShipId) == msg.sender);
        require(ownerOf(toShipId) == msg.sender);
        ammoToken.transferFrom(
            address(fromShipId),
            address(toShipId),
            ammoToken.balanceOf(address(fromShipId))
        );
    }

    function heal(uint160 id) external {
        require(_ownerOf(id) == msg.sender);
        require(lastHeal[id] + 3 < block.number);

        if (lastHeal[id] + 3 < block.number && lastHeal[id] != 0) {
            armorToken.increaseArmor(address(id), 2);
        }

        lastHeal[id] = block.number;
    }

    function getShips() external view {
        uint counter = 0;

        for (uint160 i = 1; i <= _tokenIds.current(); i++) {
            if (_exists(i)) {
                counter++;
            }
        }

        Ship[] memory ships = new Ship[](counter);

        counter = 0;

        for (uint160 i = 1; i <= _tokenIds.current(); i++) {
            if (_exists(i)) {
                Ship memory ship = Ship({
                    owner: _ownerOf(i),
                    id: i,
                    armor: armorToken.balanceOf(address(i)),
                    ammo: ammoToken.balanceOf(address(i)),
                    lastHeal: lastHeal[i],
                    LastShot: lastAttack[i]
                });
                ships[counter] = ship;
                counter++;
            }
        }
    }

    function getAmmoContractAddress() public view onlyOwner returns (address) {
        return address(ammoToken);
    }
}
