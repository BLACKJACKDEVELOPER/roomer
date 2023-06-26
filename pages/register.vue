<template>
	

<form class="register">

<h1 class="title">Sign Up</h1>

		<b-field 
		label="Fisrtname"
		custom-class="labeler">
			<b-input v-model="fname" ref="firstname" require></b-input>
		</b-field>
		

		<b-field
		label="Lastname"
		custom-class="labeler">
			<b-input v-model="lname" ref="lastname" require></b-input>
		</b-field>
		
		<b-field
		label="Date of birth"
		custom-class="labeler">
			<b-datepicker
			placeholder="Click to Select Date of birth"
			icon="calendar-today" ref="birth" v-model="birth" value="" require></b-datepicker>
		</b-field>

		<b-field
		label="Email"
		custom-class="labeler">
			<b-input ref="email" v-model="email" require></b-input>
		</b-field>
		

		<b-field
		label="Password"
		custom-class="labeler">
			<b-input
			type="password"
			password-reveal v-model="password" ref="password" require></b-input>
		</b-field>

		
		<div class="btn-group">
		<b-button
		type="is-success"
		@click="register()">
		Sign up
		</b-button>
		<b-button
		tag="router-link"
		to="/login"
		type="is-success is-light">
		Sign in
		</b-button>
</div>
</form>


</template>
<script>
export default {
	name:"RegisterPage",
	layout:"register",
	data() {
		return {
			fname:"",
			lname:"",
			email:"",
			birth:new Date(),
			password:""
		}
	},
	methods:{
		async register() {
			let { fname , lname , email , birth , password } = this
			if (fname.length == 0 || lname.length == 0 || email.length == 0 || birth.length == 0 || password.length == 0) {
				return this.$buefy.dialog.alert({
					message:"Form is empty!?!?"
				})
			}
			birth = `${birth.getDate()}-${birth.getMonth()+1}-${birth.getFullYear()}`
			const { data } = await this.$axios.post(`${process.env.SERVER}/api/register`,{
				firstname:fname,
				lastname:lname,
				email:email,
				birth:birth,
				password:password
			})
			console.log(data)
			data.pass ? (this.$router.push('/login')) : alert(data.msg)
		}
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
	.btn-group {
		margin-top: 2%;
	}
</style>