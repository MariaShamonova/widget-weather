import reducer from './reducer'
import React from 'react'
import axios from 'axios'

const defaultState = {
    responseData: null,
    isFetching: true,
    error: null,
}

const useRequest = (lat, lon, pollInterval) => {
    const [state, dispatch] = React.useReducer(reducer.reducer, {
        responseData: null,
        isFetching: true,
        error: null,
        requestId: 1,
    })

    const apiKey = 'bdf8194cb2aa74ffc6a004548c775541'

    React.useEffect(() => {
        const source = axios.CancelToken.source()
        axios(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        ).catch((error) => {
            console.log('eror....')
            dispatch({ type: 'error', payload: error })
        })
        return source.cancel
    }, [state.requestId])

    React.useEffect(() => {
        if (!pollInterval || state.isFetching) return
        const timeoutId = setTimeout(() => {
            dispatch({ type: 'poll' })
        }, pollInterval)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [lat, lon, pollInterval, state.isFetching])
    return [state]
}

export { useRequest }
