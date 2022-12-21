<script lang="ts">
  import { switchAndAddEthereumChain , readLockContract, LOCAL_CHAIN } from '$lib/blockchain-connection';
  import { MyCounterButton } from 'ui';

  async function test() {
	await switchAndAddEthereumChain(LOCAL_CHAIN)
  }

</script>

<h1>Web</h1>

{#await $readLockContract.unlockTime()}
	<p>...waiting</p>
{:then unlockTime}
	<p>Funds locked until {new Date(unlockTime*1000).toLocaleString()}</p>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<button on:click={test}>getProvider</button>

<MyCounterButton />

<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
