const axios = require('axios')
const cheerio = require('cheerio')

/** HsCalendar builds an JS Object from the HorribleSubs release schedule
 *  @param {boolean} debug - Debug mode. Default is false
 */

class HsCalendar {
  constructor (debug) {
    this.debug = debug || false

    this._baseURL = 'https://horriblesubs.info/release-schedule/'
    this._axios = axios.create({
      baseURL: this._baseURL,
      timeout: 30000
    })
  }

  /**
     * Get the schedule for the wanted day. Default is today.
     *
     * @param {string} day
     * @returns {Promise}
     */
  getDay (day) {
    return this._axios.get().then(
      (res) => {
        let $ = cheerio.load(res.data)
        let week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        let animes = []

        // Selected day (numeric)
        let sDay = week.indexOf(day.toLowerCase())
        let schedule = $('.schedule-today-table').toArray()

        $(schedule[sDay]).children().children().children().children().toArray().map((e) => {
          let anime = {
            'name': $(e).text(),
            'slug': $(e).attr('href').replace('/shows/', '')
          }

          animes.push(anime)
        })

        return animes
      },
      (error) => {
        console.error('Error getting source!')
        if (this.debug) { console.log(error) }
      }
    )
  }

  /**
     * Get the schedule for the week.
     *
     * @returns {Promise}
     */

  getWeek () {
    return this._axios.get().then(
      (res) => {
        let $ = cheerio.load(res.data)
        let week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        let animes = []

        let schedule = $('.schedule-today-table').toArray()

        // TODO: skip last index
        $(schedule).children().children().children().children().toArray().map((e, index) => {
          if (index !== 8) {
            animes.push({
              'name': $(e).text(),
              'slug': $(e).attr('href').replace('/shows/', '')
            })
          }
        })

        return animes
      },
      (error) => {
        console.error('Error getting source!')
        if (this.debug) { console.log(error) }
      }
    )
  }
}

module.exports = HsCalendar
