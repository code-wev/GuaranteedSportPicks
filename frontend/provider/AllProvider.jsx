'use client'
import { store } from '@/store/store'
import { Provider } from 'react-redux'

export default function AllProvider({children}) {
  return (

    <Provider store={store}>


        <div>

        {children}
    </div>
    </Provider>
  )
}
