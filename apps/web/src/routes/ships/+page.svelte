<script lang="ts">
    import ammoImage from "$lib/assets/ammo.png"
    import armorImage from "$lib/assets/armor.jpg"
    import Shipselection from './Shipselection.svelte';
    import { Modals, closeModal, openModal } from 'svelte-modals'
    import { getAccounts, getWriteBattleshipContract } from "$lib/blockchain-connection";
    import type { BattleShip } from "blockchain";
    import { BigNumber, ethers } from "ethers";
    import { getProvider } from "$lib/blockchain-connection/connection";
    import { onDestroy, onMount } from "svelte";
    import { id, shallowCopy } from "ethers/lib/utils";

    const battleShipContract = getWriteBattleshipContract()

    let accountAddress: string;

    onMount(async () => {
        accountAddress = await  battleShipContract.signer.getAddress()
    })

    let ships: BattleShip.ShipStructOutput[] = []
    getShips()

    const listener = getProvider().on("block", async() => {
        console.log("new block")
        await getShips()
    })

    onDestroy(() => {
        listener.off("block")
    })

  async function createShip(){
    (await battleShipContract.createShip({
        gasLimit: 1_000_000,
        value: ethers.utils.parseUnits("0.01", "ether")
    })).wait();
  }

  async function repair(id: BigNumber) {
    (await battleShipContract.heal(id, {
        gasLimit: 1_000_000
    })).wait();
  }

  async function getShips(){
    ships = (await battleShipContract.getShips())
  }

  async function handleClick(type: "Fire" | "Transfer", fromId: BigNumber) {

    const currentAddress = (await battleShipContract.signer.getAddress());
    let filteredShips = ships.filter((ship) => {
        
        if(type === "Fire"){
            return ship.owner !== currentAddress
        }
        if(type == "Transfer") {
            return ship.owner == currentAddress && ship.id !== fromId
        }
    }) 

    openModal(Shipselection, { type, fromId, filteredShips, action: async (id) => {
        if(type === "Fire"){
            await battleShipContract.attack(fromId, id, {
                gasLimit: 1_000_000
            })
        }
        if(type == "Transfer") {
            await battleShipContract.transfer(fromId, id, {
                gasLimit: 1_000_000
            })
        }
    } })
  }
</script>

<div class="col-12">
    <button on:click={createShip} class="btn btn-primary mt-3 text-white">Create Ship</button>
</div>
  
<Modals>
    <div
      slot="backdrop"
      class="backdrop"
      on:click={closeModal}
    />
</Modals>

{#if ships.length === 0}
    <h6>NO ships</h6>
{/if}

{#each ships as ship}
    <div class="col-xl-4 col-lg-6 col-md-12 py-4">
	<div class="m-1 p-4 shadow row rounded d-flex align-items-center text-center">
		<div class="d-flex">
            <h6 class="px-3">Battleship {ship.id}</h6>
            {ship.ammo}<img src={ammoImage} width=25px height=25px class="img-fluid mb-2">
            {ship.armor}<img src={armorImage} width=25px height=25px class="img-fluid mb-2">
        </div>
        owner: {ship.owner}
        {#if accountAddress === ship.owner}
        <div class="d-flex justify-content-start">
            <button on:click={() => handleClick("Fire", ship.id)} class="btn btn-primary mt-3 text-white mx-1">Fire</button>
            <button on:click={() => handleClick("Transfer", ship.id)} class="btn btn-primary mt-3 text-white mx-1">Transfer</button>
            <button on:click={() => repair(ship.id)} class="btn btn-primary mt-3 text-white mx-1">Repair</button>
        </div>
        {/if}
	</div>
    </div>
{/each}


<style>
    .backdrop {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      background: rgba(0,0,0,0.50)
    }
  </style>