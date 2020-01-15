const countries = ['at', 'ec', 'hk', 'fi', 'ic', 'it', 'jp', 'nl', 'nz', 'tr']
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
        const musicObject = {
            trackName: entry['Track Name'],
            artist: entry.Artist,
            amountPlayed: Number(entry.Streams),
            country: entry.Region,
            date: entry.Date
        }
        if (entry.Position == "1" && countries.some(el => entry.Region.includes(el))) {
            newData.push(musicObject)
        } 
        return newData
    }, [])
    return reMap
}

init()