<template>
<div class="box" v-if="rooms.pass != true">
	<div v-for="item in 15" class="Boxrooms_lazy">
		<b-skeleton :animated="true" height="110px"></b-skeleton>
		<b-skeleton :animated="true"></b-skeleton>
		<b-skeleton :animated="true"></b-skeleton>
		<b-skeleton :animated="true"></b-skeleton>
	</div>
</div>
<div v-else class="index">
	<div class="search">
			<b-numberinput min="1" controls-alignment="right" controls-position="compact" placeholder="Page" v-model="page"></b-numberinput>
		<b-input v-model="search" placeholder="Search name of the room..." style="width: 100%;"
		icon="magnify"></b-input>
	</div>
	<roomer :data="rooms"></roomer>
</div>

</template>
<script>
export default {
	name:"rooms",
	data() {
		return {
			rooms:[],
			page:1,
			search:''
		}
	},
	async created() {
		const { data } = await this.$axios.get(`${process.env.SERVER}/api/room?offset=${this.page}`)
		this.rooms = data
	},
	methods:{
	},
	watch:{
		async page() {
			const { data } = await this.$axios.get(`${process.env.SERVER}/api/room?offset=${parseInt(this.page)}`)
			this.rooms = data
		},
		async search() {
			const { data } = await this.$axios.get(`${process.env.SERVER}/api/room?search=${this.search}`)
			this.rooms = data
		}
	}
}
</script>
<style scoped>
	.box {
		max-width: 70%;
		margin: auto;
		margin-right: 7%;
		margin-top: 0.5%;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		grid-gap: 2%;
		align-content: stretch !important;
		align-items: stretch !important;
		max-height: 80% !important;
	}
	.search {
		max-width: 70%;
		margin: auto;
		margin-right: 7%;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 1%;
	}
</style>