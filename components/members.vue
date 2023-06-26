<template>
	
<div>
	<div v-if="data.pass == false">
		<div class="media-content" v-for="(value) in 6">
			<div class="content">
				<p>
					<b-skeleton active></b-skeleton>
					<b-skeleton height="80px"></b-skeleton>
				</p>
			</div>
		</div>
	</div>
	<div v-else>
		<b-collapse class="memberBox" v-for="(value,key) in data.data">
			<div class="memberProfile">
				<img style="border-radius:50%;width: 50px;height: 50px;" :src="`${$config.SERVER}/profile/${value.profile}`" alt="">
				<div class="status">
					<h2 class="memberName"><b>{{ value.firstname }} {{value.lastname}}</b></h2>
					<p v-if="value.status == 'OFFLINE'" :ref="`member/${value.id}`" class="status_offline">OFFLINE</p>
					<p v-else :ref="`member/${value.id}`" class="status_online">ONLINE</p>
				</div>
			</div>
		</b-collapse>
	</div>
</div>

</template>
<script>
export default {
	name:"Members_Components",
	props:['data','status','leaved'],
	watch:{
		status() {
			console.log(this.status)
			if (this.status != null) {
				if (this.$refs[`member/${this.status}`]) {
					let DOMstatus = this.$refs[`member/${this.status}`][0]
					DOMstatus.setAttribute('class','status_online')
					DOMstatus.innerHTML = 'ONLINE'
				}
			}
			return 
		},
		leaved() {
			console.log(this.status)
			if (this.leaved != null) {
				if (this.$refs[`member/${this.leaved}`]) {
					let DOMleaved = this.$refs[`member/${this.leaved}`][0]
					DOMleaved.setAttribute('class','status_offline')
					DOMleaved.innerHTML = 'OFFLINE'
				}
				
			}
			return 
		}
	}

}
</script>
<style>
	.memberProfile {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}
	.memberBox {
		margin-top: 2%;
		background-color: whitesmoke;
		padding: 2%;
		border-radius: 20px;
	}
	.status {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-left: 3%;
	}
	.status_online {
		color: green;
	}
	.status_offline {
		color: red;
	}
</style>