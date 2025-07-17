import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

/**
 * Không thể import { store } from '~/redux/store' theo cách thông thường ở đây
 * Giải pháp: Inject store - là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios hiện tại
 * Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên, từ bên đó chúng ta gọi hàm injectStore ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này.
 * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */
let axiosReduxStore
export const injectStore = mainStore => { axiosReduxStore = mainStore }

// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 *10 // 10 phút

// withCredentials: Sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu JWT tokens (refresh & access) vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Cấu hình Interceptors (Bộ đánh chặn vào giữa mọi Request & Response)
 * https://axios-http.com/docs/interceptors
 */

// Interceptors Request: cho phép can thiệp vào giữa những cái request API
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Kỹ thuật chặn spam click (xem kĩ mô tả ở formatters chứa function)
  interceptorLoadingElements(true)

  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Khởi tạo một cái promise cho việc gọi api refresh_token
// Mục đích tạo Promise này để khi nào gọi api refresh_token xong xuôi thì mới retry lại những api
// bị lỗi trước đó
// https://www.thedutchlab.com/en/insights/using-axios-interceptors-for-refreshing-your-api-token
let refreshTokenPromise = null

// Interceptors Response: cho phép can thiệp vào giữa những cái response nhận về
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Kỹ thuật chặn spam click (xem kĩ mô tả ở formatters chứa function)
  interceptorLoadingElements(false)

  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  // Mọi mã http startus code nằm ngoài khoảng 200 - 299 sẽ là error và rơi vào đây

  // Kỹ thuật chặn spam click (xem kĩ mô tả ở formatters chứa function)
  interceptorLoadingElements(false)

  /* Quan trọng: Xử lý Refresh Token tự động */
  // Trường hợp 1: Nếu nhận mã 401 từ BE, thì gọi api đăng xuất luôn
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  // Trường hợp 2: Nếu nhận mã 410 từ BE, thì sẽ gọi api refresh token để làm mới accessToken
  // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
  const originalRequests = error.config
  // console.log('originalRequests: ', originalRequests)

  if (error.response?.status === 410 && !originalRequests._retry) {
    // Gán them _retry = true trong khoảng thời gian chờ, đảm bảo việc refresh token này chỉ luôn gọi 1 lần tại 1 thời điểm (nhìn tại điều kiện if ngay phía trên)
    originalRequests._retry = true

    // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện gán việc gọi api refresh_token đồng thời gán vào cái refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          // đồng thời accessToken đã nằm trong httpOnly cookie (xử lý từ phía BE)
          return data?.accessToken
        })
        .catch(() => {
          // Nếu nhận bất kỳ lỗi nào từ api refresh token thì cứ logout luôn
          axiosReduxStore.dispatch(logoutUserAPI(false))
        })

        .finally(() => {
          // Dù API có thành công hay lỗi thì vẫn luôn gán cái refreshTokenPromise về null như ban đầu
          refreshTokenPromise = null
        })
    }

    // Cần return trong trường hợp refreshTokenPromise chạy thành công và thêm vào đây:
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
      /**
       * Bước 1: Đối với trường hợp nếu dự án cần lưu accessToken vào localStorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây.
       * Ví dụ: axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
       * Hiện tại ở đây không cần bước 1 này vì chúng ta đã đưa accessToken vào cookie (xử lý từ phía BE) sau khi api refreshToken được gọi thành công.
       */

      // Bước 2: Bước quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequest để gọi lại những api ban đầu bị lỗi
      return authorizedAxiosInstance(originalRequests)
    })
  }

  // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (viết code một lần: Clean Code)
  // console.log error ra là sẽ thấy cấu trúc data dẫn tới message tôi như dưới đây
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  // Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình – Ngoại trừ mã 410 – GONE phục vụ việc tự động refresh lại token.
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance