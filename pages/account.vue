<template>
	
<div class="mainAccount">
	<b-collapse
	class="card">
		<h1 class="title">Account</h1>
		<div class="boxImage">
			<img ref="preview" @click="getFile()" :src="`${$config.SERVER}/profile/${$store.state.profile}`" alt="">
		</div>
		<form>
			<b-field
			label="firstname">
			<b-input
			ref="firstname"
			:value="$store.state.firstname"></b-input>
			</b-field>
			<b-field
			label="lastname">
			<b-input
			ref="lastname"
			:value="$store.state.lastname"></b-input>
			</b-field>
			<b-field
			label="email">
			<b-input
			ref="email"
			:value="$store.state.email"></b-input>
			</b-field>
			<b-field
			label="password">
			<b-input
			ref="password"
			:value="$store.state.password"></b-input>
			</b-field>

			<b-button
			@click="update()"
			style="width: 100%;"
			type="is-primary">
				Update
			</b-button>
		</form>
	</b-collapse>
</div>

</template>
<script>
export default {
	name:"Account",
	data() {
		return {
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
		async update() {
			const { $refs:{ firstname , lastname , email , password } } = this
			const { data } = await this.$axios.post(`${process.env.SERVER}/api/profile`,{
				id:this.$store.state.id,
				firstname:firstname.newValue,
				lastname:lastname.newValue,
				email:email.newValue,
				password:password.newValue,
				file:this.file ? this.file.split(';base64,').pop() : false
			})
			data.pass ? (sessionStorage.setItem('token',data.data),window.location.reload()) : this.$buefy.dialog.alert({message:data.msg})
		}
	}
}
</script>
<style>
	.mainAccount {
		width: 50%;
		margin: auto;
		margin-top: 1%;
	}
	.card {
		padding: 2%;
	}
	.title {
		font-size: 25px;
	}
	.boxImage {
		width: 20%;
		margin: auto;
	}
</style>