//import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { Experimental_CssVarsProvider as CssVarProvider } from '@mui/material/styles'
import theme from '~/theme'

// Cấu hình react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Cấu hình MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm'

// Cấu hình Redux Store
import { Provider } from 'react-redux'
import { store } from '~/redux/store.js'

// Cấu hình react-router-dom với BrowserRouter
import { BrowserRouter } from 'react-router-dom'

// Cấu hình Redux-Persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)

/* Kỹ thuật Inject Store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component */
import { injectStore } from '~/utils/authorizeAxios'
injectStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename='/'>
        <CssVarProvider theme={theme}>
          <ConfirmProvider defaultOptions={{
            allowClose: false,
            dialogProps: { maxWidth: 'xs' },
            buttonOrder: ['confirm', 'cancel'],
            cancellationButtonProps: { color: 'inherit' },
            confirmationButtonProps: { color: 'secondary', variant: 'outlined' }
          }}>
            <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
            <CssBaseline />
            <App />
            <ToastContainer position='bottom-left' theme="colored" />
          </ConfirmProvider>
        </CssVarProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
