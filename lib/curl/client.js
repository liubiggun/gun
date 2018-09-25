exports.CurlClient = class {
  constructor (axiosInstance) {
    this.proxy = axiosInstance
  }

  async get (url, options = {}) {
    const urlFormatted = formatUrl(url, options.params, options.query)
    return this.proxy.get(urlFormatted, {
      headers: options.headers
    })
  }

  async post (url, options = {}) {
    const urlFormatted = formatUrl(url, options.params)
    return this.proxy.post(urlFormatted, options.data, {
      headers: options.headers
    })
  }

  async put (url, options = {}) {
    const urlFormatted = formatUrl(url, options.params)
    return this.proxy.put(urlFormatted, options.data, {
      headers: options.headers
    })
  }

  async delete (url, options = {}) {
    const urlFormatted = formatUrl(url, options.params)
    return this.proxy.delete(urlFormatted, {
      headers: options.headers
    })
  }
}

function serialParams (params) {
  const paramStrs = []
  Object.entries(params).forEach(([key, value]) => {
    paramStrs.push(`${key}=${encodeURIComponent(value)}`)
  })
  return paramStrs.length ? `?${paramStrs.join('&')}` : ''
}

function fillPathParams (url, params = {}) {
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(`:${key}`, value)
  }
  return url
}

function formatUrl (url, params = {}, query = {}) {
  return fillPathParams(url, params) + serialParams(query)
}
