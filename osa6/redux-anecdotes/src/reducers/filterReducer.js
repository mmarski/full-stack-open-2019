const initialState = ''

const filterReducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch(action.type) {
    case 'SET_FILTER':
      const filter = action.data.filter
      return filter
    default:
      return state
  }
}

export function setFilter(filter) {
  return {
    type: 'SET_FILTER',
    data: { filter }
  }
}


export default filterReducer