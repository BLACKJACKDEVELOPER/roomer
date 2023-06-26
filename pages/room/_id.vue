<template>
	

<div class="Boxchat">
	<b-collapse style="width: 100%;">
	<!-- CALL TO ALL MEMBERS -->
	<div class="transferMedia">
		<div>
			<h1 class="roomTitle">Loading....</h1>
		</div>
		<div class="communication">
			<img src="../../static/videocall.png" alt="">
			<img @click="call()" src="../../static/call.png" alt="">
		</div>	
	</div>

	<div ref="chat" class="chat">
		
	</div>
	<form @submit.prevent="send()" style="display: flex;width: 100% !important;flex-direction: row;justify-content: center;align-items: center;margin-top: 2%;">
		<div class="typeFile">
			<img @click="upVideo()" class="optional" width="40" src="../../static/video.png" alt="">
			<img @click="upImage()" class="optional" width="40" src="../../static/image.png" alt="">
		</div>
		<b-input style="width: 100%;" ref="text"></b-input>
		<b-button style="display: flex;flex-direction: row;justify-content: center;align-items: center;" type="submit" @click="send()">
			<img width="30" src="../../static/send.png" alt="">
		</b-button>
	</form>
	</b-collapse>
	<!-- STATUS THAT WHO ONLINE -->
	<b-collapse style="border: 2px solid #1011;height: 100% !important;">
        <b-tabs :v-model="true">
            <b-tab-item label="Members">
                <Members :leaved="leaved" :status="status" :data="members"></Members>
            </b-tab-item>

            <b-tab-item label="Picture">
            	picters
            </b-tab-item>

            <b-tab-item label="video">
            	videos
            </b-tab-item>

            <b-tab-item label="Info">
            	infomation
            </b-tab-item>
        </b-tabs>
	</b-collapse>
</div>


</template>
<script>
import { io } from "socket.io-client";
const socket = io(process.env.SERVER)

socket.on('connect',()=> {
	console.log('YOU CONNECT THIS ROOM')
})



export default {
	name:"Chating_Room",
	async created() {
		//leaved
		socket.on('leaved',async (id)=> {
			console.log(id)
			this.leaved = id
		})

		// join current room
		socket.emit('join',{ roomId:this.$route.params.id })

		// fetching members
		let { data } = await this.$axios.get(`${process.env.SERVER}/api/join?roomId=${this.$route.params.id}`)
		this.members = data

		// change status
		setTimeout(async ()=> {
			socket.emit('change_status',{roomId:this.$route.params.id,user_id:this.$store.state.id})
		},1000)
		// change status who that joined room
		socket.on('status',async (data)=> {
			this.status = data
		})

		// recieve message
		socket.on('reply',async (data_msg)=> {
			this.msg(data_msg)
			if (data_msg.perId != this.$store.state.id) {
				this.notify.play()
			}
		})
	},
	async mounted() {

		this.chat = this.$refs.chat
		// load data of current room
		let { data } = await this.$axios.get(`${process.env.SERVER}/api/messages?roomId=${this.$route.params.id}`)
		this.data = data
		setTimeout(async()=> {
			for (let i = 0;i < this.data.length;i++) {
				await this.msg(this.data[i])
			}
			this.chat.scrollTop = this.chat.scrollHeight;
		},100)

		// pull info current room
		let room = await this.$axios.get(`${process.env.SERVER}/api/room?roomId=${this.$route.params.id}`)
		data = room.data.data
		this.roomInfo = data[0]

	},
	data() {
		return {
			chat:undefined,
			data:[],
			roomInfo:[],
			members:[],
			status:null,
			user_id:null,
			leaved:null,
			notify:new Audio('/notify.wav')
		}
	},
	methods:{
		async call() {
			let callingWin = window.open("/calling?roomId="+this.$route.params.id, "_blank", "toolbar=no,scrollbars=no,resizable=no,top=500,left=100,width=1200,height=1000");
			//callingWin.postMessage('hello world','http://localhost:3000')
		},
		baes64(file) {
			return new Promise((resolve,reject)=> {
				const reader = new FileReader()
				reader.readAsDataURL(file)
				reader.onload = ()=> resolve(reader.result)
				reader.onerror = ()=> reject(false)
			})
		},
		async upImage() {
			const input = document.createElement('input')
			input.setAttribute('type','file')
			input.setAttribute('accept','.jpg,.png,.jpeg')
			input.addEventListener('change',async()=> {
				const data = await this.baes64(input.files[0])
				let date = new Date()
				date = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
				const info = { roomId:this.$route.params.id,info:{
					profile:this.$store.state.profile,
					type:'image',
					msg:data,
					date:date,
					perId:this.$store.state.id
				}}
				socket.emit('send',info)
			})
			input.click()
		},
		async upVideo() {
			const input = document.createElement('input')
			input.setAttribute('type','file')
			input.setAttribute('accept','.mp4')
			input.addEventListener('change',async()=> {
				const data = await this.baes64(input.files[0])
				let date = new Date()
				date = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
				const info = { roomId:this.$route.params.id,info:{
					profile:this.$store.state.profile,
					type:'video',
					msg:data,
					date:date,
					perId:this.$store.state.id
				}}
				socket.emit('send',info)
			})
			input.click()
		},
		async send() {
			const { $refs:{ text , chat } } = this
			if (text.newValue == '') {
				this.$buefy.dialog.alert({message:"Form is empty!!"})
				return
			}
			let date = new Date()
			date = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`

			const info = { roomId:this.$route.params.id,info:{
				profile:this.$store.state.profile,
				type:"text",
				msg:text.newValue,
				date:date,
				perId:this.$store.state.id
			}}

			socket.emit('send',info)
			text.newValue = ''
			socket.emit('notifyRoom',this.$route.params.id)
		},
		async msg(data) {
			const {  chat  } = this
			let msg = ""
			if (data.perId == this.$store.state.id) {
				switch (data.type) {
					case 'image':
						msg = `<img onclick="window.location.href = '${process.env.SERVER}/stores/${data.msg}'" width="400" class="msgFile" src="${process.env.SERVER}/stores/${data.msg}" alt="">`
					break
					case 'text':
						msg = `<p><b>${data.msg}</b></p>`
					break
					case 'video':
						msg = `<video width="400" class="msgFile" src="${process.env.SERVER}/stores/${data.msg}" autobuffer autoloop loop controls></video>`
					break
				}
				chat.innerHTML += 
				`
				<div style="display:flex;flex-direction:row-reverse;align-items:center;justify-content:flex-start;">
				<div>

				</div>
				<div class="msg" style="display:flex;margin-left:2%;background-color:#714dd2;color:#fff;padding:0.7%;border-radius:5px;">
				${ msg }
				</div>
				<div style="margin-left:1%;">
				<address style="opacity:0.3;width:100%;">
				${data.date}
				</address>
				</div>
				</div>`
				
			}else{
				switch (data.type) {
					case 'image':
						msg = `<img width="400" onclick="window.location.href = '${process.env.SERVER}/stores/${data.msg}'" class="msgFile" src="${process.env.SERVER}/stores/${data.msg}" alt="">`
					break
					case 'text':
						msg = `<p><b>${data.msg}</b></p>`
					break
					case 'video':
						msg = `<video width="400" class="msgFile" src="${process.env.SERVER}/stores/${data.msg}" autobuffer autoloop loop controls></video>`
					break
				}
				chat.innerHTML += 
				`
				<div class="msg" style="display:flex;align-items:center;">
				<div>
				<img style="border-radius:50%;width:50px;height:50px;object-fit:cover;" src="${process.env.SERVER}/profile/${data.profile}" alt="">
				</div>
				<div style="display:flex;margin-left:2%;background-color:#714dd2;color:#fff;padding:0.7%;border-radius:5px;">
				${ msg }
				</div>
				<div style="margin-left:1%;">
				<address style="opacity:0.3;width:100%;">
				${data.date}
				</address>
				</div>
				</div>
				`
				
			}
			chat.scrollTop = chat.scrollHeight;
		}
	}
}
</script>
<style>
	.Boxchat {
		max-width: 80%;
		margin: auto;
		margin-right: 1.5%;
		margin-top: 1%;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content:center;
		border: 2px solid #1011;

	}
	.chat {
		border: 2px solid whitesmoke;
		box-shadow: 0px 0px 5px 2	px whitesmoke;
		height: 640px;
		padding: 1%;
		overflow: scroll;
		background-color: #0101;
	}
	.chat::-webkit-scrollbar {
		width: 1px;
	}
	.msg {
		margin: 1%;
	}
	.typeFile {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-right: 2%;
	}
	.optional {
		margin: 2%;
	}
	.communication {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		max-width: 10%;
		margin: 0.5%;
	}
	.communication > img {
		width: 35%;
	}
	.transferMedia {
		border-bottom: 2px solid #0101;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0.5%;
	}
	.roomTitle {
		font-size: 25px;
		font-weight: bolder;
	}
</style>