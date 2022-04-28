<template>

	<div id="members">
		<div id="members-list">
    		<div v-for="member in members" v-bind:key="member.id" class="member">
	        	<div class="member">{{ member }}</div>
      		</div>
    	</div>
  	</div>
	  
</template>

<script>

	import {membersList} from './page-chat.js'

	export default {
		name: "Members",
		data() {
			return {
				members: membersList,
			};
		},
    };
</script>