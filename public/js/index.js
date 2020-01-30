const countries = [{ abbrev: 'ec', name: 'Ecuardor' }, { abbrev: 'fi', name: 'Finland' }, { abbrev: 'it', name: 'Italy' }, { abbrev: 'nz', name: 'New Zealand' }, { abbrev: 'tr', name: 'Turkey' }, { abbrev: 'jp', name: 'Japan' }, { abbrev: 'at', name: 'Austria' }, { abbrev: 'nl', name: 'Netherlands' }, { abbrev: 'lv', name: 'Latvia' }, { abbrev: 'hk', name: 'Hong Kong' }]
const trackSelection = ["1","2","3","4","5"]

let data = []
let metaData = []
let dates = []
let startDate = '2017-01-01'

let helper = {
    loader: {
        show: function () {
            console.log("show")
            window.onload = function () {
                let loader = document.getElementById("wrapper")
                loader.classList.remove("hidden")
                loader.classList.add("flex")
                // Dropdown menus added to the existing window onload function
                let dropDown1 = document.getElementById("dropDown1")
                let dropDown2 = document.getElementById("dropDown2")
                countries.forEach((el, i)=> {
                    let option = document.createElement("option")
                    option.value = el.abbrev
                    option.text = el.name
                    if (i == 0) {
                        option.selected = "selected"
                    }
                    dropDown1.appendChild(option)
                })
                countries.forEach((el, i) => {
                    let option = document.createElement("option")
                    option.value = el.abbrev
                    option.text = el.name
                    if (i == 1) {
                        option.selected = "selected"
                    }
                    dropDown2.appendChild(option)
                })
            }
        },
        hide: function () {
            console.log("hide")
            let loader = document.getElementById("wrapper")
            loader.classList.remove("flex")
            loader.classList.add("hidden")
        }
    }
}


async function init(){
    helper.loader.show()
    await getData()
    const newData = mapData(data)
    dates = mapDates(newData)
    console.log(newData)
    console.log(metaData)
    createSlider(dates, newData)
    drawVis(newData, dates)
    helper.loader.hide()
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
    let reMap = data.reduce((newData, entry) => {
        let findMetaData = metaData.find(el => entry['Track Name'] == el.name)
        const countryObject = {
            country: entry.Region,
            amountPlayed: Number(entry.Streams),
            children: [],
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
            return el.country === entry.Region
        })
        
        if (!foundObject && trackSelection.some(el => entry.Position == el) && countries.some(el => entry.Region.includes(el.abbrev))) {
            newData.push(countryObject)
        } else if (trackSelection.some(el => entry.Position == el) && countries.some(el => entry.Region.includes(el.abbrev))) {
            foundObject.children.push(musicObject)
            foundObject.amountPlayed += musicObject.amountPlayed
            if (findMetaData != undefined) {
                musicObject.length = findMetaData.duration_ms
                musicObject.bpm = findMetaData.tempo
                musicObject.danceability = findMetaData.danceability
            }
            
        }
        return newData
    }, [])
    return reMap
}

function mapDates(newData){
    let dates = newData[0].children.reduce((newDates, entry) => {
        const dateObject = {
            date: entry.date
        }
        const foundObject = newDates.find(el => {
            return el.date === entry.date
        })
        if(!foundObject){
            newDates.push(dateObject)
        }
        return newDates
    }, [])
    return dates
}

function createSlider(dates, newData){
    dates = dates
    let slider = document.createElement("input")
    let dateLabel = document.createElement("label")
    let container = document.getElementById('sliderContainer')
    slider.id = 'slider'
    slider.type = 'range'
    slider.min = 0
    slider.max = dates.length-1
    dateLabel.id = 'dateLabel'
    dateLabel.textContent = dates[0].date
    container.appendChild(slider)
    container.appendChild(dateLabel)
    slider = document.getElementById('slider')
    slider.addEventListener('change', function(el){
        let dateLabel = document.getElementById('dateLabel')
        let currentDate = dates[el.target.value].date
        dateLabel.textContent = currentDate
        gatherDrawData(dates, newData)
    })
}

function gatherDrawData(dates, newData){
    console.log(newData)
    let slider = document.getElementById('slider')
    let date = dates[slider.value].date
    console.log(date)
    
    function checkDate(el){
        return el.date == date
    }
    let country1 = document.getElementById('dropDown1').value    
    let country2 = document.getElementById('dropDown2').value
    let mappedData = newData.reduce((drawData, entry) => {
        entry.children = entry.children.filter(checkDate)
        if (country1 == entry.country || country2 == entry.country) {
            drawData.push(entry)
        }
        return drawData
        
    }, [])
    console.log(mappedData)
    updateVis(mappedData)  
}

function gatherDrawData2(dates, newData) {
    let slider = document.getElementById('slider')
    let date = dates[slider.value].date
    function checkDate(el) {
        return el.date == date
    }
    let country1 = document.getElementById('dropDown1').value
    let country2 = document.getElementById('dropDown2').value
    let mappedData = newData.reduce((drawData, entry) => {
        entry.children = entry.children.filter(checkDate)
        if (country1 == entry.country || country2 == entry.country) {
            drawData.push(entry)
        }
        return drawData

    }, [])
    return mappedData
}

function drawVis(drawData, dates){
    drawData = gatherDrawData2(dates, drawData)
    const width = 1920
    const height = 872
    const svg = d3.select("body").append("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);
    drawData.forEach(el => {
        const root = d3.hierarchy(el);
        const links = root.links();
        const nodes = root.descendants();

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(0).strength(1))
            .force("charge", d3.forceManyBody().strength(-100))

        const link = svg.append("g").attr("id", 'links')
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line");

        const node = svg.append("g").attr("id", 'nodes')
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
    })
    
}

function updateVis(drawData){
    drawData.forEach(el => {
        const root = d3.hierarchy(el);
        const links = root.links();
        const nodes = root.descendants();

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(0).strength(1))
            .force("charge", d3.forceManyBody().strength(-100))

        let link = d3.select("#links")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line");

        let node = d3.select("#nodes")
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

        // return svg.node();
    })
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

init()