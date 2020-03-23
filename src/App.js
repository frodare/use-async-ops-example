import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { register, useAsyncOp, useAsyncEffect, prependMiddleware, middleware } from 'use-async-ops'
import { reduxMiddleware, reducer } from 'use-async-ops-redux'
import logger from 'redux-logger'

const delay = time => new Promise(resolve => window.setTimeout(resolve, time))

register('op1', async id => {
  await delay(1000)
  return 'response for ' + id
}, {
  mock: async id => 'MOCK response for ' + id
})

// const reducer = (state = {}, action) => reducer

const store = createStore(reducer, applyMiddleware(logger))

// prependMiddleware(middleware.logging)
prependMiddleware(reduxMiddleware(store.dispatch))

const ShowRunning = () => {
  const running = middleware.runningOps.useRunningOps()
  const loading = middleware.runningOps.useAsyncLoading()
  return <pre>{JSON.stringify(running, null, 2)} {loading ? <h1>LOADING</h1> : null}</pre>
}

export default () => {
  const { call, result, loading } = useAsyncOp({ name: 'op1', options: { channel: '1' } })
  const { call: call2, result: result2, loading: loading2 } = useAsyncOp({ name: 'op1', options: { channel: '2' } })
  useAsyncEffect({ name: 'op1', options: { channel: 'autoStart' } }, 1, 2, 3)

  return (
    <middleware.runningOps.Provider prependMiddleware={prependMiddleware}>
      <Provider store={store}>
        <div>
          <button onClick={() => call(1)}>run</button>
          <pre>{JSON.stringify({ result, loading }, null, 2)}</pre>
        </div>

        <div>
          <button onClick={() => call2(1)}>run</button>
          <pre>{JSON.stringify({ result2, loading2 }, null, 2)}</pre>
        </div>
        <ShowRunning />
      </Provider>
    </middleware.runningOps.Provider>
  )
}
