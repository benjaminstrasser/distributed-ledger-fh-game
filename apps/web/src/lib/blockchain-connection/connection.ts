import { ethers } from 'ethers';

import { BattleShip__factory, deploymentAddresses, type BattleShip } from 'blockchain';
import { NETWORK } from './metamask';
export function getProvider() {
  // If you don't specify a //url//, Ethers connects to the default
  // (i.e. ``http:/\/localhost:8545``)
  return new ethers.providers.JsonRpcProvider(NETWORK.rpcUrls[0]);
}

export function getBattleshipContract(): BattleShip {
  return BattleShip__factory.connect(deploymentAddresses.Battleship, getProvider());
}
