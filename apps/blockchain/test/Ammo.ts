import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('Ammo', function () {
  async function deployAmmoTokenFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Ammo = await ethers.getContractFactory('Ammo');
    const ammo = await Ammo.deploy();

    return { ammo, owner, otherAccount };
  }

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { ammo, owner } = await loadFixture(deployAmmoTokenFixture);

      expect(await ammo.owner()).to.equal(owner.address);
    });
  });

  describe('Minting', function () {
    it('Should revert if not called from contract owner', async function () {
      const { ammo, owner, otherAccount } = await loadFixture(deployAmmoTokenFixture);

      await expect(ammo.connect(otherAccount).initializeAmmo(owner.address, 10)).to.be.reverted;
    });
  });

});
