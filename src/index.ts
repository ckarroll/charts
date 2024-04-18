import * as d3 from "d3";

declare global {
    interface Array<T> {
        draw(): void;
    }
}

function getXScale<T extends (number | string)[]>(data: T, boxWidth: number){
    switch(typeof data[0]){
        case "number":
            return d3.scaleBand<number>()
                .domain(data.map((d, i) => i))
                .range([0, boxWidth])
                .paddingInner(0.05)
                .paddingOuter(0.01);
        case "string": 
            return d3.scaleBand()
                .domain(data as string[])
                .range([0, boxWidth])
                .paddingInner(0.05)
                .paddingOuter(0.01);
    }
}

function getYScale<T extends (number | string)[]>(data: T, boxHeight: number){
    switch(typeof data[0]){
        case "number":
            return d3.scaleLinear()
                    .domain([0, d3.max(data as number[])!])
                    .range([boxHeight, 0]);
        case "string":
            return d3.scaleLinear()
                    .domain([0, d3.max(d3.rollup(data, d => d.length, d => d).values())!])
                    .range([boxHeight, 0]);
    }
}

function xAttr<T extends (number | string)>(x: d3.ScaleBand<number | string>, item: T, index: number){
    switch(typeof item){
        case "number":
            return x(index);
        case "string":
            return x(item);
    }    
}

function yAttr<T extends (number | string)>(data: T[], y: d3.ScaleLinear<number, number, never>, item: T){
    switch(typeof item){
        case "number":
            return y(item);
        case "string":
            return y(d3.rollup(data, d => d.length, d => d).get(item)!);
    }    
}


Array.prototype.draw = function<T extends (number | string)>(this: T[]) {
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

    const x = getXScale(this, width);

    const y = getYScale(this, height);

    // const [min, max] = d3.extent(this);
    // const color = d3.scaleLinear<string, number>()
    //     .domain([min!, max!])
    //     .range(['yellow', 'red']);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom<number | string>(x as d3.ScaleBand<number | string>));

    svg.append("g")
        .call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(this)
        .join("rect")
        .attr("x", (d, i) => xAttr(x as d3.ScaleBand<number | string>, d, i)!)
        .attr("y", (d) => yAttr(this, y, d))
        .attr("width", x.bandwidth())
        .attr("height", (d, i) => { return height - yAttr(this, y, d); })
        .style("fill", "#69b3a2")
        .on('click', console.log)
        // .attr("fill", d => color(d))
        .append("title")
        .text(d => d);
}
