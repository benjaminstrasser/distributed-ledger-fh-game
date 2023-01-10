import { ethers } from 'hardhat';
import { deploymentAddressesBuilder } from './util';

async function main() {

  const BattleShip = await ethers.getContractFactory('BattleShip');
  const battleShip = await BattleShip.deploy();

  await battleShip.deployed();

  deploymentAddressesBuilder.addDeployment('Battleship', battleShip.address);

  deploymentAddressesBuilder.generateDeploymentAddressesFile();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
