import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'

function AccountVerification() {
  // Lấy giá trị email và token từ URL
  let [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  // Tao một biến state đề biết được là để verify tài khoản thành công hay chưa
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState(false)

  // Gọi API để verify tài khoản
  useEffect(() => {
    // Nếu email và token có giá trị thì gọi API verify
    if (email && token) {
      verifyUserAPI({ email, token })
        .then(() => setVerified(true))
        .catch(() => setError(true))
    }
  }, [email, token])

  // Nếu url có vấn đề, không tồn tại 1 trong 2 giá trị email hoặc token thì đá ra trang 404 luôn
  if (!email || !token) {
    return <Navigate to='/404' />
  }

  // Nếu verify thất bại thì điều hướng về 404 (hoặc có thể show thông báo lỗi riêng)
  if (error) {
    return <Navigate to='/404' />
  }

  // Nếu chưa verify xong thì hiện toasting
  if (!verified) {
    return <PageLoadingSpinner caption='Verifying your account...' />
  }

  // Cuối cùng nếu không gặp vấn đề gì + với verify thanh công thì điều hướng về trang login cùng giá trị verifiedEmail
  return <Navigate to ={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification