import { useEffect, useRef } from "react";
import * as d3 from "d3";

const App = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const data = [
      { month: "Jan", value: 30 },
      { month: "Feb", value: 55 },
      { month: "Mar", value: 40 },
      { month: "Apr", value: 70 },
      { month: "May", value: 45 },
      { month: "Jun", value: 85 },
      { month: "Jul", value: 60 },
      { month: "Aug", value: 90 },
    ];

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3
      .scalePoint()
      .domain(data.map((d) => d.month))
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);

    // axes
    g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("fill", "white");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .attr("fill", "white");

    // area — drawn first (bottom layer)
    const area = d3
      .area()
      .x((d) => xScale(d.month))
      .y0(innerHeight)
      .y1((d) => yScale(d.value));

    g.append("path")
      .datum(data)
      .attr("d", area)
      .attr("fill", "steelblue")
      .attr("opacity", 0.15);

    // line generator
    const line = d3
      .line()
      .x((d) => xScale(d.month))
      .y((d) => yScale(d.value));

    // line path — animated
    const path = g
      .append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2);

    const totalLength = path.node().getTotalLength();

    path
      .attr("stroke-dasharray", totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // dots — drawn last (top layer)
    g.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => xScale(d.month))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 4)
      .attr("fill", "steelblue")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 7).attr("fill", "orange");
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 4).attr("fill", "steelblue");
      });
  }, []);

  return (
    <div className="container">
      <svg ref={svgRef} width={600} height={400} />
    </div>
  );
};

export default App;
