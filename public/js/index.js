const countries = ['at', 'ec', 'hk', 'fi', 'lv', 'it', 'jp', 'nl', 'nz', 'tr']
const trackSelection = ["1","2","3","4","5"]
let data = []
let metaData = []

async function init(){
    await getData()
    let newData = mapData(data)
    console.log(newData)
    console.log(metaData)
    drawVis(newData)
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
            country: entry.Region,
            amountPlayed: Number(entry.Streams),
            children: [],
            source: entry.Region,
        }
        const musicObject = {
            position: entry.Position,
            trackName: entry['Track Name'],
            artist: entry.Artist,
            amountPlayed: Number(entry.Streams),
            country: entry.Region,
            date: entry.Date,
            target: entry.Region,
        }
        const foundObject = newData.find(el => {
            return el.country === entry.Region
        })
        
        if (!foundObject && trackSelection.some(el => entry.Position == el) && countries.some(el => entry.Region.includes(el))) {
            newData.push(countryObject)
        } else if (trackSelection.some(el => entry.Position == el) && countries.some(el => entry.Region.includes(el)) && findMetaData != undefined) {
            foundObject.children.push(musicObject)
            foundObject.amountPlayed += musicObject.amountPlayed
            musicObject.length = findMetaData.duration_ms
            musicObject.bpm = findMetaData.tempo
            musicObject.danceability = findMetaData.danceability
        }
        return newData
    }, [])
    return reMap
}

function drawVis(newData){
    const width = 1920
    const height = 1080
    const root = d3.hierarchy(newData[0]);
    const links = root.links();
    const nodes = root.descendants();

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(0).strength(1))
        .force("charge", d3.forceManyBody().strength(-100))


    const svg = d3.select("body").append("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line");

    const node = svg.append("g")
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("fill", d => d.children ? null : "#000")
        .attr("stroke", d => d.children ? null : "#fff")
        .attr("r", d => Math.sqrt(d.data.amountPlayed) / 100)
        .call(drag(simulation));

    node.append("title")
        .text(d => d.data.name);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    // invalidation.then(() => simulation.stop());

    return svg.node();
}

function drag (simulation) {

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

// function tick() {
//     console.log('tick')
    
//     node
//         .attr("cx", function (d) { return d.x; })
//         .attr("cy", function (d) { return d.y; })

//     link
//         .attr("x1", function (d) { return d.source.x * 100 })
//         .attr("y1", function (d) { return d.source.y * 100 })
//         .attr("x2", function (d) { return d.target.x * 100 })
//         .attr("y2", function (d) { return d.target.y * 100 })
// }

// // Color leaf nodes orange, and packages white or blue.
// function color(d) {
//     return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
// }

init()