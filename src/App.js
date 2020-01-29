import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { register, useAsyncOp, registerPlugin } from 'use-async-ops'

import RunningOpsProvider from 'use-async-ops/dist/plugins/runningOps/RunningOpsProvider'
import useRunningOps from 'use-async-ops/dist/plugins/runningOps/useRunningOps'

// import { reduxPlugin } from 'use-async-ops-redux'
// import useAsyncRunning from 'use-async-ops/dist/useAsyncRunning'

const delay = time => new Promise(resolve => window.setTimeout(resolve, time))

register('op1', async id => {
  await delay(3000)
  return 'response for ' + id
})

const reducer = (state = {}, action) => state

const store = createStore(reducer)

// registerPlugin(reduxPlugin(store.dispatch))

const ShowRunning = () => {
  const running = useRunningOps()
  return <pre>{JSON.stringify(running, null, 2)}</pre>
}

export default () => {
  const { call, result, loading } = useAsyncOp('op1')

  return (
    <RunningOpsProvider registerPlugin={registerPlugin}>
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
