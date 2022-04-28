<template>

	<div id="messages">
		
		<div id="members-list">
    		<div v-for="member in members" v-bind:key="member.id" class="member">
	        	<div class="member">{{ member }}</div>
      		</div>
    	</div>
		
	    <div id="message-list">
    		<div v-for="message in messages" v-bind:key="message.id" class="message">
	        	<div class="message">{{ message.content }}</div>
      		</div>
    	</div>

  	</div>
</template>

<script>

	import {messageList} from './page-chat.js'
	import {membersList} from './page-chat.js'

	export default {
		name: "App",
		data() {
			return {
				messages: messageList,
				members: membersList,
			};
		},
		// code trouvé sur Internet
		updated() {
			this.$nextTick(() => {
				let element = document.getElementById("messages");
				element.scrollTop = element.scrollHeight;
			});
		}
    };
</script>