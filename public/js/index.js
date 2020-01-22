const countries = ['at', 'ec', 'hk', 'fi', 'lv', 'it', 'jp', 'nl', 'nz', 'tr']
const trackSelection = ["1","2","3","4","5"]
let data = []
let metaData = []

async function init(){
    await getData()
    mapData(data)
    console.log(mapData(data))
    console.log(metaData)
}

async function getData(){
    await d3.csv("../data/data.csv", entry => {
        return data.push(entry)
    })
    await d3.csv("../data/top2017.csv", entry => {
        return metaData.push(entry)
    })
}

function mapData(data){
    let reMap = data.reduce((newData, entry, i) => {
        let findMetaData = metaData.find(el => entry['Track Name'] == el.name)
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
        } else if (trackSelection.some(el => entry.Position == el) && countries.some(el => entry.Region.includes(el)) && findMetaData != undefined) {
            foundObject.tracks.push(musicObject)
            foundObject.totalAmountPlayed += musicObject.amountPlayed
            musicObject.length = findMetaData.duration_ms
            musicObject.bpm = findMetaData.tempo
            musicObject.danceability = findMetaData.danceability
        }
        return newData
    }, [])
    return reMap
}

init()