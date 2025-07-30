import React, { Suspense } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

// Lazy load các page lớn để tối ưu performance
const Board = React.lazy(() => import('~/pages/Boards/_id'))
const NotFound = React.lazy(() => import('~/pages/404/NotFound'))
const Auth = React.lazy(() => import('~/pages/Auth/Auth'))
const AccountVerification = React.lazy(() => import('~/pages/Auth/AccountVerification'))
const Settings = React.lazy(() => import('~/pages/Settings/Settings'))
const Boards = React.lazy(() => import('~/pages/Boards'))

/**
 * Giải pháp Clean Code trong việc xác định các route nào cần đăng nhập tài khoản xong thì mới cho truy cập
 * Sử dụng <Outlet /> của react-router-dom để hiển thị các Child Route (xem cách sử dụng trong App() bên dưới)
 * https://reactrouter.com/en/main/components/outlet
 * Một bài hướng dẫn khá đầy đủ:
 * https://www.robinwieruch.de/react-router-private-routes/
 */
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    // Bọc Suspense để hiển thị spinner khi đang tải các page lớn (lazy load)
    <Suspense fallback={<PageLoadingSpinner />}>
      <Routes>
        {/* Redirect Route */}
        <Route path='/' element={
          // Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là route / sẽ không còn nằm trong history của Browser
          // Thực hành dễ hiểu hơn bằng cách nhấn Go Home từ trang 404 xong thử quay lại bằng nút back của trình duyệt giữa 2 trường hợp có replace hoặc không có.
          <Navigate to='/boards' replace={true} />
        } />

        {/* Protected Routes (Hiểu đơn giản trong dự án của chúng ta là những route chỉ cho truy cập sau khi đã login) */}
        <Route element={<ProtectedRoute user={currentUser} />}>
          {/* <Outlet /> của react-router-dom sẽ chạy vào các child route trong này */}

          {/* Board Detail */}
          <Route path='/boards/:boardId' element={<Board />} />
          <Route path='/boards' element={<Boards />} />

          {/* User Settings */}
          <Route path='/settings/account' element={<Settings />} />
          <Route path='/settings/security' element={<Settings />} />
        </Route>

        {/* Authentication */}
        <Route path='/login' element={<Auth />} />
        <Route path='/register' element={<Auth />} />
        <Route path='/account/verification' element={<AccountVerification />} />

        {/* 404 Not Found */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App