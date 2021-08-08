const self = {
    reducer(state, action) {
        switch (action.type) {
            case 'fetched':
                return {
                    ...state,
                    isFetching: false,
                    responseData: action.payload,
                }
            case 'error':
                return {
                    ...state,
                    isFetching: false,
                    error: action.payload,
                }
            case 'poll':
                return {
                    ...state,
                    requestId: state.requestId + 1,
                    isFetching: true,
                }
            case 'pausePoll':
                return {
                    ...state,
                    pausePoll: true,
                }
            case 'restartPoll':
                return {
                    ...state,
                    pausePoll: false,
                }
            default:
                return state
        }
    },
}

export default self
