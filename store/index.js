export const state = () => ({
  profile: "normal.jpg",
  id:"",
  firstname:"",
  lastname:"",
  email:"",
  password:""
})


export const mutations = {
  setData(state,{ profile , id ,firstname , lastname , email , password}) {
    state.id = id
    state.profile = profile
    state.firstname = firstname
    state.lastname = lastname
    state.email = email
    state.password = password
  }
}