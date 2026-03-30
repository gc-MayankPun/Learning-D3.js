import { useEffect, useRef } from "react";
import * as d3 from "d3";

const App = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const data = [40, 80, 25, 60, 90, 35, 70];

    // dimensions
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)

    // a <g> (group) shifted by margin, everything draws inside this
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // xScale — maps index to horizontal position
    const xScale = d3
      .scaleBand()
      .domain(data.map((_, i) => i))
      .range([0, innerWidth])
      .padding(0.2);

    // yScale — maps data value to vertical position
    const yScale = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]); // flipped! high value = small y = high on screen

    // x axis
    g.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("fill", "white");
    
    // y axis
    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .attr("fill", "white");

    // bars
    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("width", xScale.bandwidth())
      .attr("fill", "steelblue")
      .attr("rx", 3)
      // Add interactivity
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "orange");
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "steelblue");
      })
      .on("click", function (event, d) {
        console.log("clicked bar with value:", d);
      })
      // start bars at height 0 (before animation)
      .attr("y", innerHeight)
      .attr("height", 0)
      // then animate to real values
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr("y", (d) => yScale(d))
      .attr("height", (d) => innerHeight - yScale(d));
  }, []);

  return (
    <div className="container">
      <svg ref={svgRef} width={600} height={400} />
    </div>
  );
};

export default App;
