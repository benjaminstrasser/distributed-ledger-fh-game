import { readable } from 'svelte/store';
import { getReadLockContract } from './connection';

export const readLockContract = readable(getReadLockContract());
