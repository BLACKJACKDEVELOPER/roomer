<template>
	
<div ref="parenter">
	<div class="option">
		<h1 ref="peerId">Your PeerId : </h1>
		<input ref="join" placeholder="Join with another id" type="text">
		<button @click="call()">โทร</button>
		<div class="videos">
			<video ref="local" src="" autoplay></video>
			<video ref="remote" src="" autoplay></video>
		</div>
		<br>
	</div>
</div>

</template>
<script>
import { Peer } from "peerjs"
const peer = new Peer()
export default {
	name:"CAllingGroupPage",
	layout:"calling",
	async created() {
		peer.on('open',async(id)=> {
			this.$refs.peerId.innerHTML += id
		})
		peer.on('call',async (call)=> {
			this.$buefy.dialog.confirm({
				message:"รับสายหรือไม่",
				onConfirm:async ()=> {
					const localVideo = await navigator.mediaDevices.getDisplayMedia(this.mediaOptions)
					call.answer(localVideo)
					this.$refs.local.srcObject = localVideo
					this.$refs.local.play()
					call.on('stream',async (data)=> {
						this.$refs.remote.srcObject = data
						this.$refs.remote.play()
					})
				}
			})
		})
	},
	data() {
		return {
			mediaOptions:{
				video:{
					width:500,
					height:500,
					cursor:"always"
				}
			},
			conn:false
		}
	},
	methods:{
		async call() {
			const cli_id = this.$refs.join.value
			const catchVideo = await navigator.mediaDevices.getDisplayMedia(this.mediaOptions)
			this.$refs.local.srcObject = catchVideo
			this.$refs.local.play()
			const call = peer.call(cli_id,catchVideo)
			call.on('stream',async(data)=> {
				this.$refs.remote.srcObject = data
				this.$refs.remote.play()
				console.log(data)
			})
		}
	}
}
</script>
<style>
.videos {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.videos > video {
	width: 50%;
}
</style>