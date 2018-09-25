const subCmd = require('path').basename(__filename, '.js')
const axios = require('axios')
const os = require('os')

module.exports = {
  command: `${subCmd}`,
  aliases: [],
  desc: 'ip信息',
  builder: {
  },
  handler: async argv => {
    const ifaces = os.networkInterfaces()
    const ips = []
    Object.keys(ifaces).forEach(ifname => {
      let alias = 0
    
      ifaces[ifname].forEach(iface => {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return
        }
    
        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          ips.push(`${ifname}:alias ${iface.address}`)
        } else {
          // this interface has only one ipv4 adress
          ips.push(`${ifname} ${iface.address}`)
        }
        ++alias
      })
    })
    console.log(`
    接口:
    -------------------------------------
    ${ips.join('\n')}
    `)

    const res = await Promise.all([
      axios.get('https://myip.ipip.net'),
      axios.get('https://httpbin.org/ip')
    ])
    inner = res[0].data
    outter = res[1].data

    console.log(`
    国内出口:
    -------------------------------------
    ${inner}
    `)
    console.log(`
    国外出口:
    -------------------------------------
    ${outter.origin}
    `)
  }
}
