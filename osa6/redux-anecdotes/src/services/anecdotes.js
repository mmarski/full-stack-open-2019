import axios from 'axios';
const baseUrl = ' http://localhost:3001/anecdotes'

function getAll() {
  return axios.get(baseUrl)
}

function create(anecdoteObj) {
  return axios.post(baseUrl, anecdoteObj)
}

function update(id, anecdoteObj) {
  return axios.put(baseUrl + `/${id}`, anecdoteObj)
}

function remove(id) {
  return axios.delete(baseUrl + `/${id}`)
}

export default {
  getAll: getAll,
  create: create,
  update: update,
  remove: remove
}