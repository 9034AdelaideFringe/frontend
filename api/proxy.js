export default async function handler(req, res) {
  console.log(666, req)
  const { path = [] } = req.url

  const backendBase = process.env.APP_API_URL // from Vercel env
  const targetPath = removeApiPrefix(req.url) // 去掉 '/api'

  const targetUrl = `${backendBase}${targetPath}`
  console.log('backendBase', backendBase)

  try {
    console.log('targetUrl', targetUrl)
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(backendBase).hostname,
      },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
    })

    const contentType = response.headers.get('content-type')
    res.status(response.status)

    if (contentType?.includes('application/json')) {
      const json = await response.json()
      res.json(json)
    } else {
      const text = await response.text()
      res.send(text)
    }
  } catch (error) {
    res.status(500).json({ error: 'Proxy failed', message: error.message })
  }
}
function removeApiPrefix(url) {
  return url.replace(/^\/api/, '') // 使用正则表达式替换
}
