import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'

/**
 * Cấu hình redux-persist
 * https://www.npmjs.com/package/redux-persist
 * Bài viết hướng dẫn này để hiểu rõ hơn:
 * https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
 */
import { combineReducers } from 'redux' // Lưu ý: chúng ta đã có sẵn redux trong node_modules vì khi cài @reduxjs/toolkit thì đã bao gồm rồi
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // Mặc định là localStorage

const rootPersistConfig = {
  key: 'root', // Key của persist, chúng ta tự chỉ định. Cứ để mặc định là 'root' cũng được
  storage: storage, // Biến storage ở trên – lưu vào localStorage
  whitelist: ['user'] // Định nghĩa các slice dữ liệu ĐƯỢC PHÉP duy trì qua mỗi lần F5 trình duyệt
  // blacklist: ['user'] // Định nghĩa các slice KHÔNG ĐƯỢC PHÉP duy trì qua mỗi lần F5 trình duyệt
}

// Kết hợp các reducer trong dự án của chúng ta tại đây
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer
})

// Thực hiện persistReducer để kết hợp cấu hình lưu trữ với các reducer
const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  // Fix warning error when implement redux-persist
  // https://stackoverflow.com/a/63244831/8324172
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})
