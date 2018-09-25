const axios = require('axios')
const { CurlClient } = require('./client')
const fs = require('fs')

exports.curlClientFactory = baseURL => {
  const instance = axios.create({
    baseURL,
    timeout: 60000, // request timeout
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache,no-store'
    },
    credentials: 'include',
    withCredentials: true
  })

  // request interceptor
  instance.interceptors.request.use(config => {
    config.headers = {
      ...(config.headers || {})
    }
    return config
  }, error => {
    // Do something with request error
    console.log(error)
    return Promise.reject(error)
  })

  // response interceptor
  instance.interceptors.response.use(
    response => {
      return response.data
    },
    error => {
      const data = error.response.data
      console.log(data)
      return Promise.reject('请求错误')
    }
  )

  return new CurlClient(instance)
}

exports.wget = (url, outputFilename) => {
  return axios.request({
    method: 'get',
    url,
    responseType: 'arraybuffer'
  }).then(result => {
    fs.writeFileSync(outputFilename, result.data)
    return outputFilename
  })
}
