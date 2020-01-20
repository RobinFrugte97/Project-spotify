const countries = ['at', 'ec', 'hk', 'fi', 'lv', 'it', 'jp', 'nl', 'nz', 'tr']
const trackSelection = ["1","2","3","4","5"]
let data = []

async function init(){
    await getData(data)
    mapData(data)
    console.log(mapData(data))
}

async function getData(data){
    await d3.csv("../data/data.csv", entry => {
        return data.push(entry)
    })
    return data
}

function mapData(data){
    let reMap = data.reduce((newData, entry) => {
        const countryObject = {
            countryCode: entry.Region,
            totalAmountPlayed: Number(entry.Streams),
            tracks: [],
        }
        const musicObject = {
            position: entry.Position,
            trackName: entry['Track Name'],
            artist: entry.Artist,
            amountPlayed: Number(entry.Streams),
            country: entry.Region,
            date: entry.Date
        }
        const foundObject = newData.find(el => {
            return el.countryCode === entry.Region
        })
        if (!foundObject && trackSelection.some(el => entry.Position == el) && countries.some(el => entry.Region.includes(el))) {
            newData.push(countryObject)
        } else if (trackSelection.some(el => entry.Position == el) && countries.some(el => entry.Region.includes(el))) {
            foundObject.tracks.push(musicObject)
            foundObject.totalAmountPlayed += musicObject.amountPlayed
        }
        return newData
    }, [])
    return reMap
}

init()