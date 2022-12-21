import { ethers } from 'ethers';

import { Lock__factory, deploymentAddresses } from 'blockchain';
import type { Lock } from 'blockchain';

function getProvider() {
  // If you don't specify a //url//, Ethers connects to the default
  // (i.e. ``http:/\/localhost:8545``)
  return new ethers.providers.JsonRpcProvider();
}

export function getReadLockContract(): Lock {
  return Lock__factory.connect(deploymentAddresses.Lock, getProvider());
}
