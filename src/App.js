import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { register, useAsyncOp, prependMiddleware } from 'use-async-ops'

import RunningOpsProvider from 'use-async-ops/dist/middleware/runningOps/RunningOpsProvider'
import useRunningOps from 'use-async-ops/dist/middleware/runningOps/useRunningOps'
import useAsyncLoading from 'use-async-ops/dist/middleware/runningOps/useAsyncLoading'

// import { reduxPlugin } from 'use-async-ops-redux'
// import useAsyncRunning from 'use-async-ops/dist/useAsyncRunning'

const delay = time => new Promise(resolve => window.setTimeout(resolve, time))

register('op1', async id => {
  await delay(1000)
  return 'response for ' + id
}, {
  mock: async id => 'MOCK response for ' + id
})

const reducer = (state = {}, action) => state

const store = createStore(reducer)

// registerPlugin(reduxPlugin(store.dispatch))

const ShowRunning = () => {
  const running = useRunningOps()
  const loading = useAsyncLoading()
  return <pre>{JSON.stringify(running, null, 2)} {loading ? <h1>LOADING</h1> : null}</pre>
}

export default () => {
  const { call, result, loading } = useAsyncOp('op1')

  return (
    <RunningOpsProvider prependMiddleware={prependMiddleware}>
      <Provider store={store}>
        <div>
          <button onClick={() => call(1)}>run</button>
          <pre>{JSON.stringify({ result, loading }, null, 2)}</pre>
          <ShowRunning />
        </div>
      </Provider>
    </RunningOpsProvider>
  )
}
