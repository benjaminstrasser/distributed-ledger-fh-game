import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('Armor', function () {
  async function deployArmorTokenFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Armor = await ethers.getContractFactory('Armor');
    const armor = await Armor.deploy();

    return { armor, owner, otherAccount };
  }

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { armor, owner } = await loadFixture(deployArmorTokenFixture);

      expect(await armor.owner()).to.equal(owner.address);
    });
  });

  describe('Minting', function () {
    it('Should revert if not called from contract owner', async function () {
      const { armor, owner, otherAccount } = await loadFixture(deployArmorTokenFixture);

      await expect(armor.connect(otherAccount).initializeArmor(owner.address, 10)).to.be.reverted;
    });
  });

});
