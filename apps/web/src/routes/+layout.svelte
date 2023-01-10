<script>
  import '../app.scss';
  import { isConnectedToCorrectChain, isMetamasConnected, NETWORK } from "$lib/blockchain-connection";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";


  onMount(async () => {
      if(!(await isMetamasConnected()) || !(await isConnectedToCorrectChain(NETWORK.chainId))){
        goto("/")
      }
  })
</script>

<main class="container">
  <div class="row">
    <slot />
  </div>
</main>