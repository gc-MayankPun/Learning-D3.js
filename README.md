# What D3 actually is?

Most people think D3 is a "chart library". It's not. D3 is a DOM manipulation library that binds data to elements. There are no pre-built charts. You build everything yourself from primitives, which is why it's so powerful and so confusing at first.

The name literally means Data-Driven Documents, you give it data, it drives the document (HTML/SVG)

# The core mental model (The data join)

your data [10, 40, 25, 60, 15] -> D3 data join -> DOM Elements (RECT)

After .data(), D3 splits elements into 3 groups

- .join("rect") or individually: .enter() or .exit()
- enter -> data has no element yet -> Create it
- exit -> element has no data -> Remove it

update = elements that already existed and got new data → UPDATE them D3 figures out which is which automatically when you call .data()

This is the single most important concept in all of D3. Everything else builds on top of it.

# Installation on React

npm (for React / Vue / any bundler project)

```
npm install d3
```

Then import it

```
// import everything
import * as d3 from "d3";

// or import only what you need (better for bundle size)
import { select, scaleLinear, axisBottom } from "d3";
```

## The rule to remember about chaining order

```
selection
  .attr()        ← set static attributes
  .style()       ← set static styles
  .on()          ← attach event handlers   ← must be here
  .attr()        ← set animation START state
  .transition()  ← everything below animates
  .duration()
  .ease()
  .attr()        ← animation END state
```

## Forces you can apply:

```
- charge     → nodes repel (or attract) each other  (the "magnet" effect)
- link       → edges pull connected nodes together   (the "spring" effect)
- collide    → nodes can't overlap                   (the "collision" effect)
- center     → pulls everything toward the center    (stops it flying off screen)
- gravity    → pulls toward a point (custom)
```

## The data shape

Force graphs need two arrays - nodes and links

```
const nodes = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Carol" },
];

const links = [
  { source: 1, target: 2 },  // Alice — Bob
  { source: 2, target: 3 },  // Bob  — Carol
];
```

After the simulation runs, D3 mutates your node objects and adds x and y coordinates to them:

```
// after simulation starts, your nodes look like this:
{ id: 1, name: "Alice", x: 243, y: 187, vx: 0.2, vy: -0.1 }
//                       ↑ D3 added these
```

That's how you know where to draw each node — you read node.x and node.y on every tick.

### The tick concept

The simulation doesn't run all at once. It runs in small steps called ticks. On every tick, positions update slightly. You listen to the tick event and redraw your elements:

```
simulation.on("tick", () => {
  // runs ~300 times as simulation cools down
  // update element positions here based on new node.x, node.y values
  circles.attr("cx", d => d.x).attr("cy", d => d.y);
  lines.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
       .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
});
```

This is what makes it feel alive — you're watching the physics settle in real time.
