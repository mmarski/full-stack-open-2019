const initialState = 'Hello world'

const notificationReducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch(action.type) {
    case 'NOTIFY':
      const message = action.data.message
      return message
    default:
      return state
  }
}

export function notify(message) {
  return {
    type: 'NOTIFY',
    data: { message }
  }
}


export default notificationReducer