import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber, ContractTransaction } from 'ethers';

describe('Battleship', function () {
  async function deployTokenFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const BattleShip = await ethers.getContractFactory('BattleShip');
    const battleShip = await BattleShip.deploy();

    const Armor = await ethers.getContractFactory('Armor');
    const armor = Armor.attach(await battleShip.getArmorContractAddress());

    const Ammo = await ethers.getContractFactory('Ammo');
    const ammo = Ammo.attach(await battleShip.getAmmoContractAddress());

    return {armor, ammo, battleShip, owner, otherAccount};
  }

  async function getShipId(txResponse: ContractTransaction) {
    let txReceipt = await txResponse.wait();
    // @ts-ignore
    let [mintEvent] = txReceipt.events;
    return mintEvent.args.tokenId;
  }

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const {battleShip, owner} = await loadFixture(deployTokenFixture);
      expect(await battleShip.owner()).to.equal(owner.address);
    });

    it('Should deploy Ammo and Armor token with BattleShip contract as owner', async function () {
      const {armor, ammo, battleShip} = await loadFixture(deployTokenFixture);
      expect(battleShip.address).to.equal(await armor.owner());
      expect(battleShip.address).to.equal(await ammo.owner());
    });
  });

  describe('Create Ship', function () {
    it('Should create ship with right price', async function () {
      const {armor, ammo, battleShip, owner, otherAccount} = await loadFixture(deployTokenFixture);
      await expect(battleShip.connect(otherAccount).createShip(otherAccount.address, 'FirstShip', {value: ethers.utils.parseEther('0.01')})).not.to.be.reverted;
    });

    it('Should not create ship with wrong price', async function () {
      const {armor, ammo, battleShip, owner, otherAccount} = await loadFixture(deployTokenFixture);
      await expect(battleShip.connect(otherAccount).createShip(otherAccount.address, 'FirstShip', {value: ethers.utils.parseEther('0.001')})).to.be.revertedWith('Ship price is ETH 0.01: not enough!');
    });

    it('Should mint ammo and armor token for each new ship', async function () {
      const {armor, ammo, battleShip, owner, otherAccount} = await loadFixture(deployTokenFixture);
      await battleShip.connect(otherAccount).createShip(otherAccount.address, 'FirstShip', {value: ethers.utils.parseEther('0.01')});
      expect(await ammo.balanceOf(otherAccount.address)).to.equal(BigNumber.from('10'));
      expect(await armor.balanceOf(otherAccount.address)).to.equal(BigNumber.from('10'));
      await battleShip.connect(otherAccount).createShip(otherAccount.address, 'SecondShip', {value: ethers.utils.parseEther('0.01')});
      expect(await ammo.balanceOf(otherAccount.address)).to.equal(BigNumber.from('20'));
      expect(await armor.balanceOf(otherAccount.address)).to.equal(BigNumber.from('20'));
    });
  });

  describe('Attack Ship', function () {
    it('Should allow owner of a ship to attack another existing enemy ship', async function () {
      const {armor, ammo, battleShip, owner, otherAccount} = await loadFixture(deployTokenFixture);
      let txResponse = await battleShip.createShip(owner.address, 'HeroShip', {value: ethers.utils.parseEther('0.01')});
      let txReceipt = await txResponse.wait();
      let [mintEvent] = txReceipt.events;
      const heroShipId = mintEvent.args;
      txResponse = await battleShip.connect(otherAccount).createShip(otherAccount.address, 'VillainShip', {value: ethers.utils.parseEther('0.01')});
      txReceipt = await txResponse.wait();
      [mintEvent] = txReceipt.events;
      const villainShipId = mintEvent.args;
      expect(battleShip.connect(otherAccount).attack(heroShipId, villainShipId)).to.be.revertedWith('You are not the owner of the attacking ship!');
      expect(battleShip.connect(owner).attack(heroShipId, villainShipId)).not.to.be.reverted;
    });

    it('Should decrease ammo of attacker', async function() {
      const {armor, ammo, battleShip, owner, otherAccount} = await loadFixture(deployTokenFixture);

      let txResponse = await battleShip.createShip(owner.address, 'HeroShip', {value: ethers.utils.parseEther('0.01')});
      const heroShipId = getShipId(txResponse);
      txResponse = await battleShip.connect(otherAccount).createShip(otherAccount.address, 'VillainShip', {value: ethers.utils.parseEther('0.01')});
      const villainShipId = getShipId(txResponse);

      expect(await ammo.balanceOf(otherAccount.address)).to.equal(BigNumber.from('10'));
      expect(await armor.balanceOf(otherAccount.address)).to.equal(BigNumber.from('10'));

      await battleShip.connect(owner).attack(heroShipId, villainShipId);

      expect(await ammo.balanceOf(owner.address)).to.equal('9');
      expect(await armor.balanceOf(otherAccount.address)).to.equal(BigNumber.from('9'));
    });
  });

});
