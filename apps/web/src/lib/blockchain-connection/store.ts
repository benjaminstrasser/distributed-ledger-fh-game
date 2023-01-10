import { readable, writable } from 'svelte/store';
import { getBattleshipContract } from './connection';
import { ethers } from 'ethers';

export function getWriteBattleshipContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return getBattleshipContract().connect(signer);
}
