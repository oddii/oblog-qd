const ipUtils = {
  init: () => {
    const script = document.createElement('script')
    script.src = 'http://pv.sohu.com/cityjson?ie=utf-8'

    const body = document.body
    body.appendChild(script)
  },
  getIp: () => {
  }
}

export default ipUtils
