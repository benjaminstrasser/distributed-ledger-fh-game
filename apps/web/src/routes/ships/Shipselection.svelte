<script lang="ts">
    import type { BigNumber } from 'ethers';
    import { closeModal } from 'svelte-modals'

    import ammoImage from "$lib/assets/ammo.png"
    import armorImage from "$lib/assets/armor.jpg"

    import type { BattleShip } from "blockchain";

  
    // provided by Modals
    export let isOpen: boolean
  
    export let type: string
    export let fromId: BigNumber
    export let filteredShips: BattleShip.ShipStructOutput[]
    export let action: (id: BigNumber) => void

    async function handleClick(id: BigNumber) {
        await action(id)
        closeModal()
    }
  </script>
  
  {#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2>{type}</h2>
      <div class="list-group">
        {#each filteredShips as ship}
        <a href="#" on:click={() => handleClick(ship.id)} class="list-group-item list-group-item-action">
            <h6 class="px-3">Battleship {ship.id}</h6>
            {ship.ammo}<img src={ammoImage} width=25px height=25px class="img-fluid mb-2">
            {ship.armor}<img src={armorImage} width=25px height=25px class="img-fluid mb-2">
        </a>
        {/each}
      </div>
    </div>
  </div>
  {/if}
  
  <style>
    .modal {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
  
      /* allow click-through to backdrop */
      pointer-events: none;
    }
  
    .contents {
      min-width: 440px;
      border-radius: 6px;
      padding: 16px;
      background: white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      pointer-events: auto;
    }
  
    h2 {
      text-align: center;
      font-size: 24px;
    }
  
    p {
      text-align: center;
      margin-top: 16px;
    }
  
    .actions {
      margin-top: 32px;
      display: flex;
      justify-content: flex-end;
    }
  </style>