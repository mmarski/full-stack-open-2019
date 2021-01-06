const initialState = ''
var timeoutId = undefined

const notificationReducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch(action.type) {
    case 'SET_NOTIFICATION':
      const message = action.data.message
      return message
    case 'REMOVE_NOTIFICATION':
      return ''
    default:
      return state
  }
}

export function setNotification(message, showTimeSec) {
  return dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: { message }
    })
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      dispatch(removeNotification())
    }, showTimeSec * 1000)
  }
}

export function removeNotification() {
  return {
    type: 'REMOVE_NOTIFICATION'
  }
}


export default notificationReducer