# hs-calendar
HorribleSubs releasing calendar

```js
const HsCalendar = require('HsCalendar')

const hs = new HsCalendar()

hs.getDay("tuesday").then(
    (res) => {
        console.log(res)
        /* Output
        [
            {
                "name": "Micchiri Neko",
                "slug": "micchiri-neko"
            }
        ]
        */
    }, (err) => {
        console.log(err)
    }
)
```