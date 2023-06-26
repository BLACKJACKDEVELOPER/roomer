<template>
	<div class="box">
		<div v-for="(value,key) in data.data" class="Boxrooms">
			<div class="floatImg">
				<img class="roomImage" :src="`${$config.SERVER}/profile/${value.r_profile}`" alt="">
				<b-button @click="deleteRoom()" v-if="$store.state.id == value.u_id" type="is-danger" class="delete">Delete</b-button>
			</div>
			<div>
				<h2 style="font-size: 20px;"><b>{{ value.r_name }}</b></h2>
				<p class="owner">ผู้สร้าง : {{ value.u_firstname }}</p>
				<p>ประเภท : <router-link :to="`/room?find_hashtag=${value.r_type}`">{{ value.r_type }}</router-link></p>
				<p>สร้างเมื่อ : {{ value.r_date_create }}</p>
				<address>Status : {{ value.r_password != 0 ? 'Private' : 'Public' }}</address>
				<b-button
				class="btn_join"
				style="width: 100%;margin-top: 2% !important;"
				type="is-primary"
				@click="join(value.r_id,value.r_password)">
				JOIN
				<img class="join_icon" src="../static/join.png" alt="">
			</b-button>
		</div>
	</div>
</div>
</template>
<script>
export default {
	name:"AllRooms",
	props:['data'],
	methods:{
		async deleteRoom() {
			this.$buefy.dialog.confirm({
				message:"Are you sure to delete this room ?",
				cancelText:'Cancel',
				confirmText:'Sure!!',
				type:'is-danger'
			});
		},
		async join(roomId,password) {
			if (password != 0) {
				// room require password
				this.$buefy.dialog.prompt({
					message:"This room require password ?",
					inputAttrs:{
						placeholder:"Password here"
					},
					onConfirm:async (value)=> {
						if (password == value) {
							// join member current room
							const { data } = await this.$axios.post(`${process.env.SERVER}/api/join`,{
								user_id:this.$store.state.id,
								roomId:roomId
							})
							if (data.pass) {
								this.$buefy.notification.open({
									message:`You has been joined room ${roomId}`,
									type:"is-info",
									hasIcon:true
								})
								// redirect to room
								this.$router.push(`/room/${roomId}`)
							}else{
								this.$buefy.notification.open({
									message:data.msg,
									type:"is-danger",
									hasIcon:true
								})
							}
						}else{
							this.$buefy.notification.open({
								message:"Password is incorrect!?",
								type:"is-danger",
								hasIcon:true
							})
						}
					}
				})

			}else{
				// join member current room
				const { data } = await this.$axios.post(`${process.env.SERVER}/api/join`,{
					user_id:this.$store.state.id,
					roomId:roomId
				})
				if (data.pass) {
					this.$buefy.notification.open({
						message:`You has been joined room ${roomId}`,
						type:"is-info",
						hasIcon:true
					})
				// redirect to room
				this.$router.push(`/room/${roomId}`)
				}else{
					this.$buefy.notification.open({
						message:data.msg,
						type:"is-danger",
						hasIcon:true
					})
				}
			}
		}
	}
}
</script>
<style>
	.Boxrooms {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-radius: 10px;
		padding: 3%;
		border: 2px solid whitesmoke;
		width: 100%;
	}
	.roomImage {
		border-radius: 5px;
	}
	.floatImg {
		position: relative;
	}
	.delete {
		position: absolute;
		right: 5px;
		top: 5px;
	}
	.join_icon {
		width: 15%;
	}
	.btn_join {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>