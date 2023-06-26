<template>
	

<form class="register">

<h1 class="title">Sign in</h1>

		<b-field
		label="Email"
		custom-class="labeler">
			<b-input
			ref="email"
			v-model="email"></b-input>
		</b-field>
		

		<b-field
		label="Password"
		custom-class="labeler">
			<b-input
			type="password"
			password-reveal
			ref="password"
			v-model="password"></b-input>
		</b-field>

		<b-field
		:label="'Remeber me '+(remember == false ? '1 hours' : 'forever')"
		custom-class="labeler">
			<b-switch v-model="remember"></b-switch>
		</b-field>
		
		<div>
			<b-button
			type="is-success"
			@click="login()">
				Sign in
			</b-button>
			<b-button
			tag="router-link"
			to="/register"
			type="is-success is-light">
				Sign up
			</b-button>
		</div>
</form>


</template>
<script>
export default {
	name:"RegisterPage",
	layout:"login",
	data() {
		return {
			remember:false,
			email:"",
			password:""
		}
	},
	methods:{
		async login() {
			const { remember , email , password } = this
			const { data } = await this.$axios.post(`${process.env.SERVER}/api/login`,
				{ 
					remember,
					email,
					password
				})
			data.pass ? (sessionStorage.setItem('token',data.data),window.location.href = '/') : this.$buefy.notification.open({duration: 5000,message: data.msg,position: 'is-bottom-right',type: 'is-danger',hasIcon: true})
		}
	},
	async mounted() {
		this.$route.query.msg ? this.$buefy.notification.open({duration: 5000,message: this.$route.query.msg,position: 'is-bottom-right',type: 'is-danger',hasIcon: true}) : ''
	}

}
</script>
<style>
	.register {
		max-width: 50%;
		margin: auto;
		margin-top: 5%;
		background: #363636;
		padding: 2%;
		border-radius: 5px;
	}
	.labeler {
		color: #fff;
	}
	.register h1 {
		font-size: 30px;
		color: #fff;
		margin-bottom: 2%;
	}
</style>