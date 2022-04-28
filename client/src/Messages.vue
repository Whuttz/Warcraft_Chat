<template>

	<div id="messages">	
	    <div id="messages-list">
    		<div v-for="message in messages" v-bind:key="message.id" class="message">
	        	<div class="message">{{ message.content }}</div>
      		</div>
    	</div>
  	</div>

</template>

<script>

	import {messageList} from './page-chat.js'

	export default {
		name: "Messages",
		data() {
			return {
				messages: messageList,
			};
		},
		// code trouvé sur Internet pour auto scroll, mais ne marche pas ¯\_(ツ)_/¯
// 		updated() {
// 			this.$nextTick(() => {
// 				let element = document.querySelector("message-box");
// 				element.scrollTop = element.scrollHeight;
// 			});
// 		}
		}
</script>

