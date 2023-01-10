import { ethers } from 'hardhat';
import { deploymentAddressesBuilder } from './util';

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const lockedAmount = ethers.utils.parseEther('1');

  const Lock = await ethers.getContractFactory('Lock');
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  // const Ammo = await ethers.getContractFactory('Ammo');
  // const ammo = await Ammo.deploy();
  //
  // const Armor = await ethers.getContractFactory('Armor');
  // const armor = await Armor.deploy();

  await lock.deployed();
  // await ammo.deployed();
  // await armor.deployed();

  const BattleShip = await ethers.getContractFactory('BattleShip');
  const battleShip = await BattleShip.deploy();

  await battleShip.deployed();

  console.log(`Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`);

  deploymentAddressesBuilder.addDeployment('Lock', lock.address);
  // deploymentAddressesBuilder.addDeployment('Ammo', ammo.address);
  // deploymentAddressesBuilder.addDeployment('Armor', armor.address);
  deploymentAddressesBuilder.addDeployment('Battleship', battleShip.address);

  deploymentAddressesBuilder.generateDeploymentAddressesFile();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
