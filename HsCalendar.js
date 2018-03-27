const axios = require('axios')
const cheerio = require('cheerio')
const moment = require('moment')

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

  /**
   * Get the schedule for the week with the time of the day
   * sample output from testing the method:
   * 
    [{
      "day": "Monday",
      "animes": [{
        "time": "2018-03-26T08:15:00Z",
        "slug": "/shows/micchiri-neko",
        "title": "Micchiri Neko"
      }]
    }]
   * 
   * @returns {Promise}
   */
  getWeekWithTime() {
    return this._axios.get()
    .then(res => {
      let $ = cheerio.load(res.data)
      let days = $(".entry-content h2").toArray().slice(0, -1)
      let tables = $(".entry-content table").toArray().slice(0, -1)
      return days.map(el => $(el).text())
      .map((day, index) => {
        let table = $(tables[index])
        let titles = table.find('.schedule-page-show').toArray()
        let times = table.find('.schedule-time').toArray()
        let animes = titles.map(el => $(el))
        .map((el, index) => {
          let title = el.text()
          let link = el.find('a')
          let slug = link && link.attr('href')
          let time = $(times[index]).text()
          let utcTime = moment.utc(`${day} ${time}`, "dddd HH:mm").add(7, 'hour').format()
          return {
            time: utcTime,
            slug,
            title
          }
        })
        return {
          day,
          animes
        }
      })
    }).catch(error => {
      console.error('Error getting source!')
      if (this.debug) { console.log(error) }
    })
  }
}

module.exports = HsCalendar
