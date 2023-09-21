const { success, info, error } = require('./logger')
const fs = require('fs')
const { DATA_PATH } = require('./constants')
const { v4 } = require('uuid')
const sys = require('systeminformation')

class Monitor {
  async run () {
    const data = []

    data.push({
      time: new Date().toLocaleTimeString(),
      uuid: v4(),
      systemLoad: (await sys.currentLoad()),
      cpuUsage: 50,
      cpuInfo: { data: (await sys.cpu()), temperature: (await sys.cpuTemperature()) },
      memoryUsage: (await sys.mem()),
      diskUsage: (await sys.fsSize()),
      networkUsage: (await sys.networkStats())
    })

    this.handleWrite(JSON.stringify(data))
  }

  handleWrite (data) {
    info('MNTR | starting write to data.json')
    // eslint-disable-next-line n/no-path-concat
    fs.writeFileSync(DATA_PATH, data, 'utf-8', function (err) {
      if (err) {
        error('MNTR | an error occured writing to the data.json file: ' + err)
      } else {
        success('MNTR | data copied to data.json successfully')
      }
    })

    success('MNTR | data written to data.json successfully')
  }
}

module.exports = new Monitor()
