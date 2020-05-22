import axios from 'axios';
const baseUrl = '/api/persons'

function getAll() {
    return axios.get(baseUrl)
}

function create(personObj) {
    return axios.post(baseUrl, personObj)
}

function update(id, personObj) {
    return axios.put(baseUrl + `/${id}`, personObj)
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