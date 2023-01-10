<script lang="ts">
    import ammoImage from "$lib/assets/ammo.png"
    import armorImage from "$lib/assets/armor.jpg"
    import Shipselection from './Shipselection.svelte';
    import { Modals, closeModal, openModal } from 'svelte-modals'
    

  function handleClick() {
    openModal(Shipselection, { title: 'Fire', message: 'This is an alert' })
  }
</script>

<div class="col-12">
    <button class="btn btn-primary mt-3 text-white">Create Ship</button>
</div>
  
  <Modals>
    <div
      slot="backdrop"
      class="backdrop"
      on:click={closeModal}
    />
  </Modals>

<div class="col-4 py-4">
	<div class="m-1 p-4 shadow row rounded d-flex align-items-center text-center">
		<div class="d-flex">
            <h6 class="px-3">Battleship 1</h6>
            10<img src={ammoImage} width=25px height=25px class="img-fluid mb-2">
            10<img src={armorImage} width=25px height=25px class="img-fluid mb-2">
        </div>
        <div class="d-flex justify-content-start">
            <button on:click={handleClick} class="btn btn-primary mt-3 text-white mx-1">Fire</button>
            <button class="btn btn-primary mt-3 text-white mx-1">Transfer</button>
            <button class="btn btn-primary mt-3 text-white mx-1">Repair</button>
        </div>
	</div>
</div>

<div class="col-4 py-4">
	<div class="m-1 p-4 shadow row rounded d-flex align-items-center text-center">
		<div class="d-flex">
            <h6 class="px-3">Battleship 2</h6>
            7<img src={ammoImage} width=25px height=25px class="img-fluid mb-2">
            9<img src={armorImage} width=25px height=25px class="img-fluid mb-2">
        </div>
        <div class="d-flex justify-content-start">
            <button class="btn btn-primary mt-3 text-white mx-1">Fire</button>
            <button class="btn btn-primary mt-3 text-white mx-1">Transfer</button>
            <button class="btn btn-primary mt-3 text-white mx-1">Repair</button>
        </div>
	</div>
</div>


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