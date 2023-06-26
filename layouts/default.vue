<template>
  <div>
<b-sidebar
                position="absolute"
                :expand-on-hover="false"
                :reduce="false"
                :delay="500"
                type="is-light"
                open
                :fullheight="autofull"
                ref="sidebar"
                class="sidebar"
            >
                    <div class="container_menu">
                      <div class="menu_div">
                        <div class="profile">
                          <div class="msger" @click="notifer()">
                            <img class="bell" src="../static/bell.png" alt="">
                            <h1>{{notify}}</h1>
                          </div>
                        <img @click="$router.push('/account')" style="width: 70px;height: 70px;border-radius: 50%;" :src="`${$config.SERVER}/profile/${this.$store.state.profile}`" alt="">
                        <div>
                         <h1>{{ $store.state.firstname }}</h1>
                         <h1>{{ $store.state.lastname }}</h1>
                       </div>
                      </div>
                        <button type="is-primary" @click="$router.push('/create_room')" class="menu">
                          <div style="width: 100%;" class="iconic">
                            <p>Create a Room</p>
                            <img src="../static/create.png" alt="">
                          </div>
                        </button>
                        <button type="is-primary" @click="$router.push('/list_room')" class="menu">
                          <div style="width: 100%;" class="iconic">
                            <p>Your Rooms</p>
                            <img src="../static/list.png" alt="">
                          </div>
                        </button>
                        <button type="is-primary" @click="$router.push('/room')" class="menu">
                          <div style="width: 100%;" class="iconic">
                            <p>Rooms</p>
                            <img src="../static/room.png" alt="">
                          </div>
                        </button>
                      </div>
                      <b-button type="is-danger" @click="logout()">
                        Logout
                      </b-button>
                    </div>
            </b-sidebar>
            
     <Nuxt/>
  </div>
</template>

<script>
import { io } from "socket.io-client";
const socket = io(process.env.SERVER)

export default {
  name: 'DefaultLayout',
  async created() {
    const { data } = await this.$axios.post(`${process.env.SERVER}/api/auth`,{
      token:sessionStorage.getItem('token')
    })
    console.log(this.$store.state)
    data.pass ? (await this.$store.commit('setData',data.data)) : this.$router.push(`/login?msg=${data.msg}`)

    // amount of notify
    //this.notify = (JSON.parse(localStorage.getItem('Notifications'))).length

    // get Notify
    socket.on(`notify/${data.data.id}`,(data)=> {

      this.$buefy.notification.open({
        message:'คุณมีข้อความใหม่ในห้อง '+data.roomId,
        type:"is-info",
        position:"is-bottom-right",
        hasIcon:true
      })

      const msg = JSON.stringify({ msg:`คุณมีข้อความใหม่ในห้อง ${data.roomId}` })
      if (localStorage.getItem('Notifications')) {
        const msg = JSON.parse(localStorage.getItem('Notifications'))
        msg.push({ msg:`คุณมีข้อความใหม่ที่ห้อง ${data.roomId}`,roomId:data.roomId })
        localStorage.setItem('Notifications',JSON.stringify(msg))
      }else{
        localStorage.setItem('Notifications',JSON.stringify([]))
        const msg = JSON.parse(localStorage.getItem('Notifications'))
        msg.push({ msg:`คุณมีข้อความใหม่ที่ห้อง ${data.roomId}`,roomId:data.roomId })
        localStorage.setItem('Notifications',JSON.stringify(msg))
      }
      this.notify += data.notify
    })
  },
  data() {
    return {
      profile:`${process.env.SERVER}/profile/${this.$store.state.profile}`,
      autofull:true,
      notify:0
    }
  },
  methods:{
    async notifer() {

      let data = JSON.parse(localStorage.getItem('Notifications'))
      data = data.map((msg) => {
        const link = this.$createElement('a', {
          class: 'notifyLink',
          attrs: {
            href: '/room/' + msg.roomId
          }
        }, msg.msg);

        return link;
      });
      this.$buefy.dialog.alert({
        title:"Notifications",
        message:data,
        customClass:"boxNotify",
        hasIcon:true,
        iconPack:"mdi"
      })
      localStorage.setItem('Notifications',JSON.stringify([]))
      this.notify = 0
    },
    async logout() {
      sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style type="text/css">
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai+Looped&family=Kanit:wght@300&display=swap');
  body::-webkit-scrollbar {
    width: 0px !important;
  }
  .notifyLink {
    display: block;
    font-size: 20px;
    padding: 2%;
    background-color: #0101;
    margin-top: 3%;
    width: 125% !important;
    display: flex;
    justify-content: center;
    border-radius: 5%;
  }
  .msger {
    width: 15%;
    position: absolute;
    right: 5px;
    top: 5px;
    border: none;
    display: flex;
    flex-direction: row;
    justify-content: flex-end !important;
  }
  .msger > h1 {
    position: absolute;
    color: #000;
    background-color: red;
    padding: 1%;
    height: 20px;
    width: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
  .bell {
    width: 15%;
  }
  .boxNotify {
    width: 100%;
  }
  .menu_div {
    display: flex;
    flex-direction: column;
  }
  .menu {
    width: 100%;
    border:2px solid whitesmoke !important;
    width: 100% !important;
    height: 50px;
    text-align: left;
    background-color: #714dd2;
    border-radius: 5px;
  }
  .iconic {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: #fff;
    font-size: 105%;
    font-weight: bolder;
    font-family: 'IBM Plex Sans Thai Looped', sans-serif;
    font-family: 'Kanit', sans-serif;
    padding: 2%;
  }
  .iconic > img {
    width: 10%;
  }
  .container_menu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 3%;
  }
  .profile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3%;
    align-items: center;
    font-family: 'IBM Plex Sans Thai Looped', sans-serif;
    font-family: 'Kanit', sans-serif;
    position: relative;
    background-color: #0101;
    border: 2px solid #0101;
  }
  .profile > h1 {
    font-weight: bolder;
  }
  .profile > div {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
    font-weight: bolder !important;
    font-size: 17px;
  }
  .profile > img {
    border:3px solid #6943d0;
  }
  .sidebar {
  }
</style>
