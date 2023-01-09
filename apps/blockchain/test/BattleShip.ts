import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';

describe('Battleship', function () {
  async function deployTokenFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Armor = await ethers.getContractFactory('Armor');
    const armor = await Armor.deploy();

    const Ammo = await ethers.getContractFactory('Ammo');
    const ammo = await Ammo.deploy();

    const BattleShip = await ethers.getContractFactory('BattleShip');
    const battleShip = await BattleShip.deploy(ammo.address, armor.address);

    return {armor, ammo, battleShip, owner, otherAccount};
  }

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const {armor, ammo, battleShip, owner} = await loadFixture(deployTokenFixture);

      expect(await armor.owner()).to.equal(owner.address);
      expect(await ammo.owner()).to.equal(owner.address);
      expect(await battleShip.owner()).to.equal(owner.address);
    });
  });

  describe('Create Ship', function () {
    it('Should create ship with right price', async function () {
      const {armor, ammo, battleShip, owner, otherAccount} = await loadFixture(deployTokenFixture);
      await expect(battleShip.connect(otherAccount).createShip(otherAccount.address, {value: ethers.utils.parseEther('0.01')})).not.to.be.reverted;
    });

    it('Should not create ship with wrong price', async function () {
      const {armor, ammo, battleShip, owner, otherAccount} = await loadFixture(deployTokenFixture);
      await expect(battleShip.connect(otherAccount).createShip(otherAccount.address, {value: ethers.utils.parseEther('0.001')})).to.be.revertedWith('Ship price is ETH 0.01: not enough!');
    });

    it('Should mint ammo and armor token for each new ship', async function () {
      const {armor, ammo, battleShip, owner, otherAccount} = await loadFixture(deployTokenFixture);
      await battleShip.connect(otherAccount).createShip(otherAccount.address, {value: ethers.utils.parseEther('0.01')});
      expect(await ammo.balanceOf(otherAccount.address)).to.equal(BigNumber.from("10"));
      expect(await armor.balanceOf(otherAccount.address)).to.equal(BigNumber.from("10"));
      await battleShip.connect(otherAccount).createShip(otherAccount.address, {value: ethers.utils.parseEther('0.01')});
      expect(await ammo.balanceOf(otherAccount.address)).to.equal(BigNumber.from("20"));
      expect(await armor.balanceOf(otherAccount.address)).to.equal(BigNumber.from("20"));
    });
  });

});
