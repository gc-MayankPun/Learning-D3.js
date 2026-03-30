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

# Level 1 — Selections and attributes

D3 selections work almost like jQuery. You select elements, then set their attributes.

````

// select one element
d3.select("#chart")

// select all matching elements
d3.selectAll("rect")

// chain attribute/style setters
d3.select("#chart")
.style("background", "red")
.attr("width", 500)

```

The key difference from jQuery: setters can take a function that receives the bound data:

```

d3.selectAll("rect")
.attr("height", (d) => d) // d = the data value bound to this element
.attr("y", (d) => 100 - d) // every element gets its own value
.style("fill", (d) => d > 50 ? "red" : "blue")

```

d is always the datum for that specific element. This is the whole point of D3, the data drives every attribute.
```
````
