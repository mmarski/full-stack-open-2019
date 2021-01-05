import axios from 'axios';
const baseUrl = ' http://localhost:3001/anecdotes'

async function getAll() {
  const response = await axios.get(baseUrl)
  return response.data
}

async function create(content) {
  const anecdote = {
    content,
    votes: 0
  }
  const response = await axios.post(baseUrl, anecdote)
  return response.data
}

async function update(id, anecdoteObj) {
  const response = await axios.put(baseUrl + `/${id}`, anecdoteObj)
  return response.data
}
/*
function remove(id) {
  return axios.delete(baseUrl + `/${id}`)
}*/

export default {
  getAll: getAll,
  create: create,
  update: update,
  //remove: remove
}