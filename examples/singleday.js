const HsCalendar = require('HsCalendar')

const hs = new HsCalendar()

hs.getDay("tuesday").then(
    (res) => {
        console.log(res)
    }, (err) => {
        console.log(err)
    }
)