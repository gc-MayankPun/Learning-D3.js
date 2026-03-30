import { useEffect, useRef } from "react";
import * as d3 from "d3";

const App = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 600;
    const height = 500;

    const nodes = [
      { id: 0, name: "Alice" },
      { id: 1, name: "Bob" },
      { id: 2, name: "Carol" },
      { id: 3, name: "Dave" },
      { id: 4, name: "Eve" },
      { id: 5, name: "Frank" },
      { id: 6, name: "Grace" },
    ];

    const links = [
      { source: 0, target: 1 },
      { source: 0, target: 2 },
      { source: 0, target: 3 },
      { source: 0, target: 3 },
      { source: 0, target: 4 },
      { source: 0, target: 5 },
      { source: 0, target: 6 },
      { source: 0, target: 6 },
    ];

    // count connections per node — more connections = bigger node
    const connectionCount = {};
    links.forEach((l) => {
      connectionCount[l.source] = (connectionCount[l.source] || 0) + 1;
      connectionCount[l.target] = (connectionCount[l.target] || 0) + 1;
    });

    // color scale — more connections = more vivid color
    const colorScale = d3
      .scaleLinear()
      .domain([1, 4])
      .range(["#4a90d9", "#e05252"]);

    const svg = d3.select(svgRef.current);

    // arrow marker for directed edges (optional — remove if you want undirected)
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 28) // offset so arrow tip touches node edge
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#555");

    const link = svg
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#444")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)");

    const node = svg
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => 15 + (connectionCount[d.id] || 0) * 3)
      .attr("fill", (d) => colorScale(connectionCount[d.id] || 1))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .style("cursor", "grab")
      .on("mouseover", function (event, d) {
        // highlight connected links
        link
          .attr("stroke", (l) =>
            l.source.id === d.id || l.target.id === d.id ? "#fff" : "#333",
          )
          .attr("stroke-width", (l) =>
            l.source.id === d.id || l.target.id === d.id ? 2.5 : 1,
          );
      })
      .on("mouseout", function () {
        link.attr("stroke", "#444").attr("stroke-width", 1.5);
      });

    const label = svg
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.name)
      .attr("font-size", 11)
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("pointer-events", "none"); // labels don't block mouse events on circles

    // simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(120),
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(40));

    simulation.on("tick", () => {
      // clamp nodes inside svg boundary
      node
        .attr("cx", (d) => (d.x = Math.max(30, Math.min(width - 30, d.x))))
        .attr("cy", (d) => (d.y = Math.max(30, Math.min(height - 30, d.y))));

      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      label.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });

    // drag
    const drag = d3
      .drag()
      .on("start", function (event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        d3.select(this).style("cursor", "grabbing");
      })
      .on("drag", function (event, d) {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", function (event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        d3.select(this).style("cursor", "grab");
      });

    node.call(drag);
  }, []);

  return (
    <div className="container">
      <svg ref={svgRef} width={600} height={500} />
    </div>
  );
};

export default App;
