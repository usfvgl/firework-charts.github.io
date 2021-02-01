// TODO Add a parameter for a function to call at the end of the tick! so you can pass colorize :)

// (Variables without getters/setters)
export const BOBA_COLLIDE_RADIUS_COEFFICIENT = 1.46;
export const BOBA_COLLIDE_STRENGTH_COEFFICIENT = 1.2;
export const BOBA_CHARGE_STRENGTH_COEFFICIENT =  -0.83;
export const BOBA_CHARGE_DISTMAX_COEFFICIENT = 1.665;

export const FIREWORK_COLLIDE_RADIUS_COEFFICIENT = 1.168;
export const FIREWORK_COLLIDE_STRENGTH_COEFFICIENT = 1.2         *0.7;
export const FIREWORK_CHARGE_STRENGTH_COEFFICIENT = -3.984       *0.3;
export const FIREWORK_CHARGE_DISTMAX_COEFFICIENT = 16.65;
export const FIREWORK_LINK_DISTANCE_COEFFICIENT = 0;
export const FIREWORK_LINK_STRENGTH_COEFFICIENT = 0.2             *0.3;

export const FIREWORK_CUP_RADIUS_SCALE_FACTOR = 0.5;
export const PEARL_RADIUS_SCALING_FACTOR = 0.8; // max recommended: 1.3

export const POSSIBLE_COLORS = [
    "#1f77b4",
    "#17becf",
    "#AACCFF",
    "#9467bd",
    "#2ca02c",
    "#ff7f0e",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#d62728"
];

// Another magic internet function pretty much
export function positionLink(d) {
    return "M" + d['source'].x + "," + d['source'].y
        + "L" + d['target'].x + "," + d['target'].y
    // + " " + d[2].x + "," + d[2].y;
}

// Tick function - doesn't enforce circle boundaries
export function fireworkTick(nodes, links) {
    // console.log('barebones tick');

    links.attr("d", positionLink);

    nodes.attr('cx', d => d.x)
        .attr('cy', d => d.y);
}

// Make links and link elements
export function generateLinks(pearlsData, group, distance, i, offset, color="") {
    let links = [];
    for (let i = 1; i < pearlsData.length; i++) {
        links.push({"source": 0+offset, "target": i+offset, "distance": distance});
    }

    // Generate links
    let linkElems = group.selectAll(`path.link${i}`)
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link");

    if (color != "") {
        linkElems.style("stroke", color);
    }

    return [linkElems, links];
}

// Pick a random color for debugging
function randomDebuggingColor() {
    return choose(POSSIBLE_COLORS.slice(0,3));
}

// Thanks internet
function choose(choices) {
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

// Create the pearls cups in the SVG group
export function createPearls(group, nodesData, coordModifier, shapeRendering, colorize, i, className, fractionalStyle, color="") {

    let combinedClassName = `${fractionalStyle?"fractional-":""}${className}`
    let pearls = group.selectAll(`.${combinedClassName}${i}`)
        .data(nodesData)
        .enter()
        .append('circle')
        .attr('class', combinedClassName)
        .attr('r', d => d.rad * PEARL_RADIUS_SCALING_FACTOR)

        // Scale the default phyllotaxis arrangement to be more appropriate, if needed
        .attr('cx', function (d) {
            d.x = coordModifier(d.x);
            return d.x;
        })
        .attr('cy', function (d) {
            d.y = coordModifier(d.y);
            return d.y;
        });

    // Maybe make a color
    if (colorize && !fractionalStyle) {
        if (color != "") {
            pearls.style("fill", color);
        }
        // if (color == "") {
        //     pearls.style("fill", randomDebuggingColor());
        // }
    }


    if (shapeRendering !== "") {
        pearls.attr('shape-rendering', "geometricPrecision")
    }

    return pearls;
}

// Make data array for nodes
export function generatePearlsData(n, pearlRadius, newXValue, newYValue) {
    let data = new Array(n);
    data.fill(undefined);
    return data.map(_ => (
        {
            rad: pearlRadius,

            // Instantiate with either phyllotaxis arrangement or random values
            x : newXValue(),
            y : newYValue()
        })
    );
}

// Closure function to hold all the juicy configuration data
function bobaMaker() {

    // (Variables with getters/setters)
    let pearlArrangement = 'phyllotaxis';
    let pearlFDL = false;
    let cupBorderWidth = 'constant'; // 'scaled';
    let shapeRendering = ''; // '' means don't set shape-rendering
    let fireworkStyle = false;
    let drawCup = true;
    let colorizePearls = false;
    let colorizeLinks = false;
    let raiseLinks = false;     // Default: links are background. If true: links become the foreground

    // (Getter/Setter Methods)
    boba.pearlArrangement = function(value) {
        if (!arguments.length) return pearlArrangement;
        pearlArrangement = value;
        return boba;
    };
    boba.colorizePearls = function(value) {
        if (!arguments.length) return colorizePearls;
        colorizePearls = value;
        return boba;
    }
    boba.colorizeLinks = function(value) {
        if (!arguments.length) return colorizeLinks;
        colorizeLinks = value;
        return boba;
    }
    boba.pearlFDL = function(value) {
        if (!arguments.length) return pearlFDL;
        pearlFDL = value;
        return boba;
    };
    boba.drawCup = function(value) {
        if (!arguments.length) return drawCup;
        drawCup = value;
        return boba;
    };
    boba.fireworkStyle = function(value) {
        if (!arguments.length) return fireworkStyle;
        fireworkStyle = value;
        return boba;
    };
    boba.raiseLinks = function(value) {
        if (!arguments.length) return raiseLinks;
        raiseLinks = value;
        return boba;
    };
    boba.cupBorderWidth = function(value) {
        if (!arguments.length) return cupBorderWidth;
        cupBorderWidth = value;
        return boba;
    };
    boba.shapeRendering = function(value) {
        if (!arguments.length) return shapeRendering;
        shapeRendering = value;
        return boba;
    };

    // (Other useful functions)

    // Magic "pythag" function I found on the internet. It makes things work!
    function magicInternetFunction(r, coord, b, cupBorderWidth, cupRadius, hyp2, w) {
        r = (1/3) * r * 4;

        // force use of b coord that exists in circle to avoid sqrt(x<0)
        b = Math.min(w - r - cupBorderWidth, Math.max(r + cupBorderWidth, b));

        let b2 = Math.pow((b - cupRadius), 2);
        let a = Math.sqrt(hyp2 - b2);

        // radius - sqrt(hyp^2 - b^2) < coord < sqrt(hyp^2 - b^2) + radius
        coord = Math.max(cupRadius - a + r + cupBorderWidth,
            Math.min(a + cupRadius - r - cupBorderWidth, coord));

        return coord
    }

    // Tick function - enforces circle boundaries
    function bobaTick(nodes, strokeWidth, cupRadius, hyp2, w) {
        // console.log('tick');

        nodes.attr('cx', function (d) {
            return d.x = magicInternetFunction(d.rad, d.x, d.y, strokeWidth, cupRadius, hyp2, w);
        })
            .attr('cy', function (d) {
                return d.y = magicInternetFunction(d.rad, d.y, d.x, strokeWidth, cupRadius, hyp2, w);
            });
    }

    // Main function/object to draw a singular, isolated boba cup for the specified group, given a radius and pearl count
    function boba(group, cupRadius, pearlCount, fractionalStyle=false) {
        if (fireworkStyle) {
            cupRadius *= FIREWORK_CUP_RADIUS_SCALE_FACTOR;
        }

        // TODO this is lazy, do this in a better way
        if (fireworkStyle) {
            cupRadius *= 2;
        }


        const w = 2 * cupRadius;
        group.attr('cupRadius', cupRadius);
        const h = w;
        group.attr('width', w);
        group.attr('height', h);

        const hyp2 = Math.pow(cupRadius, 2);
        const pearlRadius = (w * 3) / (9.8 * Math.sqrt(pearlCount));
        group.attr('pearlRadius', pearlRadius);

        pearlCount = Math.round(pearlCount);
        group.attr('pearlCount', pearlCount);

        const phyllotaxisScaleToRadius = val => val * (((1/Math.sqrt(pearlCount)) * (cupRadius-pearlRadius)) / 11) + cupRadius;
        // const phyllotaxisScaleToRadius = val => val * (1/Math.sqrt(pearlCount)) * (cupRadius) / 11 + cupRadius;
        const coordModifier = pearlArrangement === 'phyllotaxis' ? phyllotaxisScaleToRadius : i => i;

        // Draw the cup all the lil' pearls swim in (if desired)
        const strokeWidth = cupBorderWidth === 'scaled' ? cupRadius * 0.05 : 1;
        if (drawCup) {
            group.append('circle')
                .style('stroke-width', strokeWidth)
                .attr('class', 'pool')
                .attr("r", cupRadius)
                .attr("cx", w / 2)
                .attr("cy", h / 2)
            if (shapeRendering !== "") {
                group.attr('shape-rendering', shapeRendering);
            }
        }

        // Make an array of data elements, one for each pearl
        const valueGetter = pearlArrangement === 'phyllotaxis' ? _ => NaN : _ => Math.random() * w;
        let pearlsData = generatePearlsData(pearlCount, pearlRadius, valueGetter, valueGetter);

        // Maybe make an invisible center for Firework Style
        if (fireworkStyle) {
            const val = pearlFDL ? cupRadius : 0;
            pearlsData.unshift({
                rad: 0,
                fx : val,
                fy : val
            })
        }

        // Make a FDL simulation: needed to run phyllotaxis layout even if FDL not being used
        let force = d3.forceSimulation().nodes(pearlsData);

        // Create the pearls
        let className = fireworkStyle ? 'fireworkPearl' : 'pearl';
        let pearlNodes = createPearls(group, pearlsData, coordModifier, shapeRendering, colorizePearls,0, className, fractionalStyle);

        // let use_link_strength = (FIREWORK_LINK_STRENGTH_COEFFICIENT  * 200 * (1/w) )- 0.025;
        let use_link_strength = FIREWORK_LINK_STRENGTH_COEFFICIENT  * 0.0001 //(1 / Math.sqrt(pearlCount)) ) //+  0.025;
        // TODO this is lazy, do this right.

        // Create links if desired
        let links = [];
        let linkElems = null;
        if (fireworkStyle) {

            const le = generateLinks(pearlsData, group, cupRadius, 0, 0);
            linkElems = le[0];
            links=le[1];

            force.force("link", d3.forceLink(links)
                .distance(cupRadius * FIREWORK_LINK_DISTANCE_COEFFICIENT) // 0.01
                // .strength(pearlRadius  * use_link_strength)); // 0.01
                // .strength(pearlRadius  * FIREWORK_LINK_STRENGTH_COEFFICIENT)); // 0.01
                .strength(w  * use_link_strength + 0.18)); // 0.01
                // // TODO this is lazy, change back to FIREWORK_LINK_STRENGTH_COEFFICIENT
            linkElems.attr('d', positionLink);
            if (raiseLinks) {
                linkElems.raise();
            } else {
                linkElems.lower();
            }
        }

        // Setup FDL forces, run the simulation (or don't)
        let charge_strength_coefficient = fireworkStyle ? FIREWORK_CHARGE_STRENGTH_COEFFICIENT : BOBA_CHARGE_STRENGTH_COEFFICIENT;
        let charge_distmax_coefficient = fireworkStyle ? FIREWORK_CHARGE_DISTMAX_COEFFICIENT : BOBA_CHARGE_DISTMAX_COEFFICIENT;
        let collide_radius_coefficient = fireworkStyle ? FIREWORK_COLLIDE_RADIUS_COEFFICIENT : BOBA_COLLIDE_RADIUS_COEFFICIENT;
        let collide_strength_coefficient = fireworkStyle ? FIREWORK_COLLIDE_STRENGTH_COEFFICIENT : BOBA_COLLIDE_STRENGTH_COEFFICIENT;

        if (pearlFDL) {
            force.velocityDecay(0.6) // A bit more friction/slowing down. Default is 0.4
                .alphaMin(0.01)
                .force("charge", d3.forceManyBody()
                    .strength(thing => thing.rad * charge_strength_coefficient) // 0.5
                    .distanceMax(pearlRadius * charge_distmax_coefficient)) // 0.5
                .force("collide", d3.forceCollide()
                    .radius(thing => thing.rad * collide_radius_coefficient) // 0.5
                    .strength(collide_strength_coefficient)) // 1

            if (!fireworkStyle) {
                force.on('tick', _ => bobaTick(pearlNodes, strokeWidth, cupRadius, hyp2, w));

            } else if (fireworkStyle) {
                force.on('tick', _ => fireworkTick(pearlNodes, linkElems));
            }
        } else {
            force.stop();
        }
    }

    return boba;
}

export {bobaMaker};