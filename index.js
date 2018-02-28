const axios = require('axios')
const cheerio = require('cheerio')

/** 
 * HsCalendar builds an JS Object from the HorribleSubs release schedule
 * 
 * @param {boolean} debug - Debug mode. Default is false
 */

class HsCalendar {
    constructor(debug) {
        this.debug = debug || false

        this._baseURL = "https://horriblesubs.info/release-schedule/"
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
    getDay(day) {
        return this._axios.get().then(
            (res) => {
                const $ = cheerio.load(res.data)
                const week = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
                let animes = []
                
                // Selected day (numeric)
                let s_day = week.indexOf(day.toLowerCase())
                let schedule = $('.schedule-today-table').toArray()

                $(schedule[s_day]).children().children().children().children().toArray().map((e) => {
                    let anime = {
                        "name": $(e).text(),
                        "slug": $(e).attr('href').replace("/shows/", "")
                    }

                    animes.push(anime)
                })

                return animes
            },
            (error) => {
                console.error("Error getting source!")
                if (this.debug)
                    console.log(error)
            }
        )
    }

    /**
     * Get the schedule for the week.
     * 
     * @returns {Promise}
     */

    getWeek() {
        return this._axios.get().then(
            (res) => {
                const $ = cheerio.load(res.data)
                let animes = []
                let week = {}
                
                let schedule = $('.schedule-today-table').toArray()

                // TODO: skip last index
                $(schedule).children().children().children().children().toArray().map((e, index) => {
                    let obj = {
                        "name": $(e).text(),
                        "slug": $(e).attr('href').replace("/shows/", "")
                    }
                    animes.push(obj)
                })

                return animes
            },
            (error) => {
                console.error("Error getting source!")
                if (this.debug)
                    console.log(error)
            }
        )
    }
}

module.exports = HsCalendar

const hs = new HsCalendar(true)

hs.getWeek().then(
    (res) => {
        console.log(res)
    }, (err) => {
        console.log(err)
    }
)