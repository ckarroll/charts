import * as d3 from "d3";

const data: number[] = [1, 2, 2, 2, 3, 3, 4, 5];
// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        `translate(${margin.left},${margin.top})`);

// X axis: scale and draw:
const x = d3.scaleBand<number>()
    .domain(data.map((d, i) => i))
    .range([0, width])
    .paddingInner(0.05);

const y = d3.scaleLinear()
    .domain([0, d3.max(data)!])
    .range([height, 0]);

const [min, max] = d3.extent(data);
const color = d3.scaleLinear<string, number>()
    .domain([min!, max!])
    .range(['yellow', 'red']);

svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

svg.append("g")
    .call(d3.axisLeft(y));

// append the bar rectangles to the svg element
svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", i => x(i)!)
    .attr("y", d => y(d))
    .attr("width", x.bandwidth())
    .attr("height", function (d) { return height - y(d); })
    .attr("fill", d => color(d))
    .append("title")
    .text(d => d);