import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import router from "./router"
import { HelmetProvider } from "react-helmet-async"
import { Provider } from "react-redux"
import Store from './context'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={Store}>
        <RouterProvider router={router} />
      </Provider>
    </HelmetProvider>
  </StrictMode>,
)
