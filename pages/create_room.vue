<template>
	
<form class="createRoom">
	
	<b-collapse
	class="card">
	<h2 class="title">Create Room</h2>
	<div class="boxImage">
		<img class="previewImage" src="" ref="preview" alt="">
	</div>

	<b-field
	label="Profile of Room">
	<b-button
	style="width: 100%;"
	icon="credit-card"
	@click="getFile()">
	Upload
	</b-button>
	</b-field>
	<b-field
	label="Name of Room">
	<b-input
	ref="room_name"></b-input>
	</b-field>
	<b-field
	label="Amount of members">
	<b-input
	value="2"
	min="2"
	type="number"
	ref="room_amount"></b-input>
	</b-field>
	<b-field
	label="Type of Room">
	<b-input
	ref="type_room"></b-input>
	</b-field>
	<b-field
	:label="secure">
	<b-switch
	v-model="secure"
	true-value="Private Room"
	false-value="Public Room">
	</b-switch>
	</b-field>

	<b-field
	v-if="secure == 'Private Room'"
	label="Password">
		<b-input ref="password" placeholder="Password"></b-input>
	</b-field>

	<b-button
	type="is-primary"
	style="width: 100%;margin-top: 3%;"
	@click="createRoom()">
		Create
	</b-button>
	</b-collapse>

</form>

</template>
<script>
export default {
	name:"create_Room",
	data() {
		return {
			secure:"Public Room",
			file:false
		}
	},
	methods:{
		base64(file) {
			return new Promise((resolve,reject)=> {
				const reader = new FileReader()
				reader.readAsDataURL(file)
				reader.onload = ()=> resolve(reader.result)
				reader.onerror = ()=> reject(false)
			})
		},
		async getFile() {
			const input = document.createElement('input')
			input.setAttribute('type','file')
			input.setAttribute('accept','.jpg,.jpeg')
			input.addEventListener('change',async ()=> {
				const data = await this.base64(input.files[0])
				this.file = data
				this.$refs.preview.src = this.file
			})
			input.click()
		},
		async createRoom() {
			let when = new Date()
			when = `${when.getDate()}-${when.getMonth()+1}-${when.getFullYear()}`
			const { $refs:{ room_name , room_amount , type_room , password } } = this
			const { data } = await this.$axios.post(`${process.env.SERVER}/api/room`,{
				file:this.file ? this.file.split(';base64,').pop() : false,
				room_name:room_name.newValue,
				room_amount:parseInt(room_amount.newValue),
				type_room:type_room.newValue,
				password:password ? password.newValue : false,
				owner:this.$store.state.id,
				date_create:when
			})
			data.pass ? (this.$buefy.dialog.alert({message:data.msg}),this.$router.push('/list_room')) : this.$buefy.dialog.alert({message:data.msg})

		}
	}
}
</script>
<style>
	.createRoom {
		width: 50%;
		margin:auto;
		margin-top: 1%;
	}
	.card {
		padding: 5%;
	}
	.previewImage {
		width: 100%;
		border-radius: 5px;
	}
	.boxImage {
		width: 40%;
		margin: auto;
	}
	.title {
		font-size: 25px;
	}
</style>