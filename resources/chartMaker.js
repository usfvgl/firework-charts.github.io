import {translate, sortFunc} from './utilities.js';
import {
    bobaMaker, generatePearlsData,
    generateLinks,
    createPearls,
    fireworkTick,
    FIREWORK_COLLIDE_RADIUS_COEFFICIENT,
    FIREWORK_COLLIDE_STRENGTH_COEFFICIENT,
    FIREWORK_CUP_RADIUS_SCALE_FACTOR,
    FIREWORK_CHARGE_STRENGTH_COEFFICIENT,
    FIREWORK_CHARGE_DISTMAX_COEFFICIENT,
    FIREWORK_LINK_DISTANCE_COEFFICIENT,
    FIREWORK_LINK_STRENGTH_COEFFICIENT,
    POSSIBLE_COLORS
} from "./bobaMaker.js";
import {pickColors, zip} from "./clusteringfun.js";

// To apply the chart on a DOM selection (of SVG elements): myChart(selection);
// Each selected element must have a "datum" property of the data to be used
// Note: all dots have class "bobaDot". Feel free to style these with CSS.
function chartMaker() {

    // Properties without getters (internal only)
    let xScale = d3.scaleLinear();
    let yScale = d3.scaleLinear();
    let rScale = d3.scaleSqrt();
    let bobaCountScale = d3.scaleLinear();

    // Properties with getters (externally accessible). Defaults defined here
    let width = 300;
    let height = 300;
    let margin = {top:30, right:100, bottom:40, left:60};

    let radiusRange = [0, 20];
    let bobaCountRange = [1, 30];
    let chartPadding = radiusRange[1];

    let xTitleAttr = "xTitle";
    let yTitleAttr = "yTitle";
    let rTitleAttr = "rTitle";
    let chartTitleAttr = "chartTitle";
    let xAxisDomain = [null, null];
    let yAxisDomain = [null, null];
    let xAccessor = function(d) { return d[0]; };
    let yAccessor = function(d) { return d[1]; };
    let rAccessor = function(d) { return d[2]; };

    let boba_pearlFDL = false;
    let boba_pearlArrangement = 'phyllotaxis';
    let boba_fireworkStyle = false;
    let boba_drawCup = true;
    let boba_shapeRendering = '';
    let boba_colorize_pearls = false;
    let boba_colorize_links = false;
    let boba_raiseLinks = false;

    let useGrid = false;
    let boba = false;
    let showLegend = true;
    let displayFractionalNodes = true;

    let colorAccessor = (_ => "blue");
    let opacity = 0.7;

    // Getter/Setter Methods
    let makeBoba = null;
    chart.boba = function(value) {
        if (!arguments.length) return boba;
        boba = value;
        if (boba) {
            makeBoba = bobaMaker()
                .pearlFDL(boba_pearlFDL)
                .pearlArrangement(boba_pearlArrangement)
                .shapeRendering(boba_shapeRendering)
                .drawCup(boba_drawCup)
                .fireworkStyle(boba_fireworkStyle);

        }
        return chart;
    };
    chart.boba_pearlFDL = function(value) {
        if (!arguments.length) return boba_pearlFDL;
        boba_pearlFDL = value;
        if (makeBoba != null) {
            makeBoba.pearlFDL(boba_pearlFDL);
        }
        return chart;
    };
    chart.boba_drawCup = function(value) {
        if (!arguments.length) return boba_drawCup;
        boba_drawCup = value;
        if (makeBoba != null) {
            makeBoba.drawCup(boba_drawCup);
        }
        return chart;
    };
    chart.boba_fireworkStyle = function(value) {
        if (!arguments.length) return boba_fireworkStyle;
        boba_fireworkStyle = value;
        if (makeBoba != null) {
            makeBoba.fireworkStyle(boba_fireworkStyle);
        }
        return chart;
    };
    chart.boba_pearlArrangement = function(value) {
        if (!arguments.length) return boba_pearlArrangement;
        boba_pearlArrangement = value;
        if (makeBoba != null) {
            makeBoba.pearlArrangement(boba_pearlArrangement);
        }
        return chart;
    };
    chart.boba_shapeRendering = function(value) {
        if (!arguments.length) return boba_shapeRendering;
        boba_shapeRendering = value;
        if (makeBoba != null) {
            makeBoba.shapeRendering(boba_shapeRendering);
        }
        return chart;
    };
    chart.boba_colorize_pearls = function(value) {
        if (!arguments.length) return boba_colorize_pearls;
        boba_colorize_pearls = value;
        if (makeBoba != null) {
            makeBoba.colorizePearls(boba_colorize_pearls);
        }
        return chart;
    };
    chart.boba_colorize_links = function(value) {
        if (!arguments.length) return boba_colorize_links;
        boba_colorize_links = value;
        if (makeBoba != null) {
            makeBoba.colorizeLinks(boba_colorize_links);
        }
        return chart;
    };
    chart.boba_raiseLinks = function(value) {
        if (!arguments.length) return boba_raiseLinks;
        boba_raiseLinks = value;
        if (makeBoba != null) {
            makeBoba.raiseLinks(boba_raiseLinks);
        }
        return chart;
    };
    chart.useGrid = function(value) {
        if (!arguments.length) return useGrid;
        useGrid = value;
        return chart;
    }
    chart.showLegend = function(value) {
        if (!arguments.length) return showLegend;
        showLegend = value;
        return chart;
    }
    chart.bobaCountRange = function(value) {
        if (!arguments.length) return bobaCountRange;
        bobaCountRange = value;
        return chart;
    };
    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };
    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };
    chart.margin = function(value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    };
    chart.xTitleAttr = function(value) {
        if (!arguments.length) return xTitleAttr;
        xTitleAttr = value;
        return chart;
    };
    chart.yTitleAttr = function(value) {
        if (!arguments.length) return yTitleAttr;
        yTitleAttr = value;
        return chart;
    };
    chart.rTitleAttr = function(value) {
        if (!arguments.length) return rTitleAttr;
        rTitleAttr = value;
        return chart;
    };
    chart.chartTitleAttr = function(value) {
        if (!arguments.length) return chartTitleAttr;
        chartTitleAttr = value;
        return chart;
    };
    chart.radiusRange = function(value) {
        if (!arguments.length) return radiusRange;
        radiusRange = value;
        return chart;
    };
    chart.xAxisDomain = function(value) {   // [null, null] by default. if either bound is left null, it will default to the extent of that axis of the data
        if (!arguments.length) return xAxisDomain;
        xAxisDomain = value;
        return chart;
    };
    chart.yAxisDomain = function(value) {  // [null, null] by default. if either bound is left null, it will default to the extent of that axis of the data
        if (!arguments.length) return yAxisDomain;
        yAxisDomain = value;
        return chart;
    };
    chart.xAccessor = function(_) {
        if (!arguments.length) return xAccessor;
        xAccessor = _;
        return chart;
    };
    chart.yAccessor = function(_) {
        if (!arguments.length) return yAccessor;
        yAccessor = _;
        return chart;
    };
    chart.rAccessor = function(_) {
        if (!arguments.length) return rAccessor;
        rAccessor = _;
        return chart;
    };
    chart.colorAccessor = function(_) {
        if (!arguments.length) return colorAccessor;
        colorAccessor = _;
        return chart;
    };
    chart.opacity = function(_) {
        if (!arguments.length) return opacity;
        opacity = _;
        return chart;
    };

    // Reusable function to take a group and make a boba cup out of it
    function groupToBoba(d, index, groups) {
        let group = d3.select(groups[index])
        makeBoba(group, rScale(rAccessor(d)), bobaCountScale(rAccessor(d)))
        d3.select(this).attr("transform", translate(
            xScale(xAccessor(d)) - (group.attr('width')/2),
            yScale(yAccessor(d)) - (group.attr('height'))/2));
    }

    // Update the scales' ranges and domains now that we know what the data is
    function updateScales(data) {
        let xExtent = d3.extent(data, d => xAccessor(d));
        let yExtent = d3.extent(data, d => yAccessor(d));
        xScale
            .domain([xAxisDomain[0] == null ? xExtent[0] : xAxisDomain[0],
                xAxisDomain[1] == null ? xExtent[1] : xAxisDomain[1]])
            .range([chartPadding, width - margin.left - margin.right - chartPadding]);
        yScale
            .domain([yAxisDomain[0] == null ? yExtent[0] : yAxisDomain[0],
                yAxisDomain[1] == null ? yExtent[1] : yAxisDomain[1]])
            .range([height - margin.top - margin.bottom - chartPadding, chartPadding]);
        let rAccessorMax = d3.max(data, d => rAccessor(d));
        rScale = d3.scaleSqrt()     // Use scaleSqrt to properly size circles by area
            .domain([0, rAccessorMax])
            .range(radiusRange);
        bobaCountScale = d3.scaleLinear()
            .domain([0, rAccessorMax])
            .range(bobaCountRange);

       // TODO idea: set minimum to 3
    }

    // Draw the axes (and their titles) on the SVG
    function drawAxes(svg) {
        // Note: scales must be updated first
        let leftAxis = d3.axisLeft(yScale);
        let bottomAxis = d3.axisBottom(xScale);
        if (useGrid) {
            leftAxis.tickSize(-1 * (width - margin.right - margin.left - chartPadding/2));
            bottomAxis.tickSize(-1 * (height - margin.top - margin.bottom - chartPadding));
        }
        svg.append("g")
            .attr('id', 'yAxis')
            .attr('transform', translate(margin.left - 10, margin.top))
            .call(leftAxis);
        svg.append("g")
            .attr('id', 'xAxis')
            .attr("transform", translate(margin.left, height - margin.bottom))
            .call(bottomAxis);

        // Draw the titles
        let labels = svg.append('g')
            .attr('id', 'labels');

        let xTitle = svg.attr(xTitleAttr);
        labels.append('text')
            .text(xTitle)
            .style('fill', 'black')
            .style('font-size', '0.8rem')
            .attr('id', 'xTitle')
            .attr('text-anchor', 'middle')
            .attr("transform", translate(width / 2 , height - margin.bottom))
            .attr('x', 0)
            .attr('y', +35);

        let yTitle = svg.attr(yTitleAttr);
        let rotateGroup = labels.append('g')
            .attr('id', 'group-yTitle')
            .attr("transform", translate(margin.left , ((height-margin.bottom - margin.top) / 2) + margin.top));

        rotateGroup.append('text')
            .text(yTitle)
            .style('fill', 'black')
            .style('font-size', '0.8rem')
            .attr('id', 'yTitle')
            .attr('text-anchor', 'middle')
            .attr('transform', "rotate(-90)")
            // .attr('x', -10)
            .attr('y', -45);
    }

    // Draw the chart title
    function drawChartTitle(svg) {
        let centerX = width / 2;

        // Make a legend title
        svg.append('text')
            .attr('id', 'chartTitle')
            .text(svg.attr(chartTitleAttr))
            .style('fill', 'black')
            .style('font-size', '1.2rem')
            .attr('text-anchor', 'middle')
            .attr("transform", translate(centerX , 20))
            .attr('x', 0)
            .attr('y', 0);
    }

    // Plot each datapoint as a circle
    function drawCircles(svg, data) {
        let group = svg.append("g")
            .attr('id', 'chart')
            .attr("transform", translate(margin.left, margin.top));
        group.selectAll(".bobaDot")
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'bobaDot')
            .attr('cx', d => xScale(xAccessor(d)))
            .attr('cy', d => yScale(yAccessor(d)))
            .attr('r', d => rScale(rAccessor(d)))
            .style('fill', d => colorAccessor(d))
            .style('opacity', opacity)
            .attr('stroke', 'black');
    }

    // Plot each datapoint as a firework
    function drawFireworks(svg, data) {
        let group = svg.append("g")
            .attr('id', 'fireworkChart')
            .attr("transform", translate(margin.left, margin.top));

        let bobaCounts = data.map(d=>bobaCountScale(rAccessor(d)));
        let rValues = data.map(d=>rScale(rAccessor(d)));
        let xValues = data.map(d=>xScale(xAccessor(d)));
        let yValues = data.map(d=>yScale(yAccessor(d)));
        const cupRadiusForOnePearl = rScale(bobaCountScale.invert(1));

        // Maybe generate colors array to use
        let colors = [];
        let colorOptions = POSSIBLE_COLORS.slice(0,3);
        if (boba_colorize_pearls || boba_colorize_links) {
            let points = zip([xValues, yValues]);
            colors = pickColors(points, colorOptions);
        }

        let pearlRadius;
        let cupRadius;
        let offset = 0;
        let continuedCount = 0;
        for (let i = 0; i< bobaCounts.length; i++) {

            // console.log(`(ratio ${bobaCounts[i] / rValues[i]}) count : ${bobaCounts[i]}, r : ${rValues[i]}`)
            let bobaCount = bobaCounts[i];
            cupRadius = rValues[i] * FIREWORK_CUP_RADIUS_SCALE_FACTOR;

            let fractionalStyle = false
            if (bobaCount < 1) {
                if (displayFractionalNodes) {
                    fractionalStyle = true;
                    bobaCount = 1;
                    cupRadius = cupRadiusForOnePearl * FIREWORK_CUP_RADIUS_SCALE_FACTOR;
                } else {
                    continuedCount += 1;
                    continue;
                }
            }
            bobaCount = Math.round(bobaCount);

            let w = cupRadius * 2

            let newXVal = _ => xValues[i];
            let newYVal = _ => yValues[i];

            pearlRadius = (w * 3) / (9.8 * Math.sqrt(bobaCount));
            let newPearlsData = generatePearlsData(bobaCount, pearlRadius, newXVal, newYVal);

            // Make an invisible center for firework style
            newPearlsData.unshift({
                rad: 0,
                fx : newXVal(),
                fy : newYVal()
            })

            // Decide what color to use for links, pearls
            let key = xValues[i].toString() + " " + yValues[i].toString() + " ";
            let linkColor = boba_colorize_links ? colors[key] : "";
            let pearlColor = boba_colorize_pearls ? colors[key] : "";

            // Create the links
            generateLinks(newPearlsData, group, cupRadius, i, offset, linkColor);

            // Create the pearls in the DOM
            let coordModifier = val => val;
            createPearls(group, newPearlsData, coordModifier, boba_shapeRendering, boba_colorize_pearls, i, 'fireworkPearl', fractionalStyle, pearlColor);

            offset = offset += newPearlsData.length;
        }
        console.log(`continuedCount : ${continuedCount}`);

        // Re-grab the right selections (to include everything made)
        let linksElems = group.selectAll("path.link");
        if (boba_raiseLinks) {
            linksElems.raise();
        } else {
            linksElems.lower();
        }
        let linksData = linksElems.data();
        let pearlsSelection = group.selectAll('circle.fireworkPearl, circle.fractional-fireworkPearl');
        let pearlsData = pearlsSelection.data();

        // Make a FDL simulation: needed to run phyllotaxis layout even if FDL not being used
        let force = d3.forceSimulation().nodes(pearlsData);

        force.force("link", d3.forceLink(linksData)
            .distance(cupRadius * FIREWORK_LINK_DISTANCE_COEFFICIENT)
            .strength(pearlRadius * FIREWORK_LINK_STRENGTH_COEFFICIENT));

        force.velocityDecay(0.6) // A bit more friction/slowing down. Default is 0.4
            .alphaMin(0.01)
            .force("charge", d3.forceManyBody()
                .strength(thing => thing.rad * FIREWORK_CHARGE_STRENGTH_COEFFICIENT)
                .distanceMax(pearlRadius * FIREWORK_CHARGE_DISTMAX_COEFFICIENT))
            .force("collide", d3.forceCollide()
                .radius(thing => thing.rad * FIREWORK_COLLIDE_RADIUS_COEFFICIENT)
                .strength(FIREWORK_COLLIDE_STRENGTH_COEFFICIENT))
        force.on('tick', _ => fireworkTick(pearlsSelection, linksElems));

        pearlsSelection.call(makeDraggable(force));
    }

    function makeDraggable(simulation) {
        function dragStarted(event) {
            if (!event.active) simulation.alphaTarget(0.1).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragEnded(event) {
            if (!event.active) simulation.alphaTarget(0.01);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded);
    }

    // Plot each datapoint as a boba cup
    function drawBoba(svg, data) {
        let group = svg.append("g")
            .attr('id', 'chart')
            .attr("transform", translate(margin.left, margin.top));
        group.selectAll(".bobaDot")
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'bobaCup')
            .each(groupToBoba);
    }

    function makeLegendDivider(svg) {
        let legendDivider = svg.append('g')
            .attr('id', 'legendDividerGroup')
            .attr('transform', translate(width-margin.right,0))
            .attr('height', height);

        legendDivider.append('rect')
            .attr('class', 'legendDivider')
            .attr('height', height)
            .attr('width', margin.right);
    }

    function makeLegendBorder(elem) {
        return elem.append('rect')
            .attr('class', 'legendBorder')
            .attr('transform', translate(0, 0))
            .attr('width', margin.right);
    }

    // Create the legend on the chart
    function drawLegend(svg, data) {
        makeLegendDivider(svg);
        let id = boba_fireworkStyle ? "fireworkLegend" : "legend";

        let legendGroup = svg.append('g')
            .attr('id', id)
            .attr('transform', translate(width - margin.right, margin.top))
            .attr('width', margin.right)
            .attr('height', height - margin.top - margin.bottom);

        let legendBorder = makeLegendBorder(legendGroup);

        // Decide which size circles to make (USING QUANTILES (LIKE MEDIAN))
        // let rData = data.map(rAccessor);
        // let QUANTILES_TO_SAMPLE = [0.25, 0.5, 0.75];
        // let sampleValues = QUANTILES_TO_SAMPLE.map(elem => d3.quantile(rData, elem));
        // let sampleRadii = samplesValues.map(rScale);

        // Decide which size circles to make (USING PLAIN SAMPLING (LIKE PERCENTS OF RADIUS EXTENT))
        let rExtent = d3.extent(data, d => rAccessor(d));
        let rExtentSize = rExtent[1] - rExtent[0];
        let DESIRED_PERCENTS = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];
        let sampleValues = DESIRED_PERCENTS.map(percent => rExtentSize * percent + rExtent[0]);

        // Exclude first value if the radius is 0
        if (rScale(sampleValues[0]) === 0) {sampleValues.shift();}

        // Layout Prep
        let centerX = margin.right / 2;
        let PADDING_BETWEEN_SAMPLES = 10;
        let TEXT_SIZE = 15;
        let labelFormatter = function(input) {
            if (input < 1) {
                return d3.format("4,.2")(input);
            } else {
                return d3.format("4,.2s")(input);
            }
        }

        // Make a legend title
        let TITLE_SIZE = 15;
        let TITLE_TOP_MARGIN = 10;
        legendGroup.append('text')
            .attr('id', 'rTitle')
            .text(svg.attr(rTitleAttr))
            .style('fill', 'black')
            .style('font-size', '0.8rem')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', "hanging")
            .attr("transform", translate(centerX , TITLE_TOP_MARGIN))
            .attr('x', 0)
            .attr('y', 0);
        let height_so_far = TITLE_SIZE + TITLE_TOP_MARGIN;

        // Maybe say how many one pearl represents
        if (boba) {
            legendGroup.append('text')
                .attr('id', 'bobaValue')
                .text(`(1 Pearl = ${labelFormatter(bobaCountScale.invert(1))})`)
                .style('fill', 'black')
                .style('font-size', '0.7rem')
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', "hanging")
                .attr("transform", translate(centerX , TITLE_SIZE + TITLE_TOP_MARGIN))
                .attr('x', 0)
                .attr('y', 0);

            height_so_far += TEXT_SIZE;
        }

        // Make sample circles, labels
        let sampleId = 0;
        const cupRadiusForOnePearl = rScale(bobaCountScale.invert(1));
        for (const value of sampleValues) {
            let thisRadius = rScale(value);
            let sampleHeight = thisRadius;
            if (boba_fireworkStyle) {
                thisRadius *= 0.5;
            }

            // TODO this is lazy, do this right
            if (boba_fireworkStyle) {
                sampleHeight = sampleHeight * FIREWORK_CUP_RADIUS_SCALE_FACTOR;
            }

            let thisBobaCount = bobaCountScale(value);
            let thisDiameter = (sampleHeight * 2);
            let newCenterY = height_so_far + sampleHeight + PADDING_BETWEEN_SAMPLES;
            // console.log(`(ratio ${thisBobaCount / thisRadius}) count : ${thisBobaCount}, r : ${thisRadius} (legend)`)

            if (boba) {
                // Sample boba or fireworks
                let group = legendGroup.append('g')
                let thisFractionalStyle = false;
                if (boba_fireworkStyle && thisBobaCount < 1) {
                    console.log(`Making firework legend sample ${sampleId} with fractional style because bobaCount is less than 0 (${thisBobaCount})`)
                    thisFractionalStyle = true;
                    thisBobaCount = 1;
                    thisRadius = cupRadiusForOnePearl * FIREWORK_CUP_RADIUS_SCALE_FACTOR*2;
                }

                makeBoba(group, thisRadius, thisBobaCount, thisFractionalStyle)
                group.attr("transform", translate(
                    centerX - (group.attr('width')/2),
                    newCenterY - (group.attr('height'))/2));

            } else {
                // Sample Plain circles
                legendGroup.append('circle')
                    .attr('class', 'legendSampleCircle')
                    .attr('id', sampleId)
                    .attr('cx', centerX)
                    .attr('cy', newCenterY)
                    .attr('r', thisRadius)
                    .style('fill', colorAccessor(null))
                    .style('opacity', opacity)
                    .attr('stroke', 'black');
            }


            // Sample label
            legendGroup.append('text')
                .attr('id', sampleId)
                .attr('class', 'legendSampleValue')
                .text(labelFormatter(value))
                .style('fill', 'black')
                .style('font-size', '0.7rem')
                .attr('text-anchor', 'middle')
                .attr('text-anchor', 'middle')
                .attr("transform", translate(centerX, 8))
                .attr('x', 0)
                .attr('y', height_so_far + thisDiameter + TEXT_SIZE);

            sampleId += 1;
            height_so_far += thisDiameter + PADDING_BETWEEN_SAMPLES + TEXT_SIZE;
        }

        // Set the height of the border
        height_so_far += PADDING_BETWEEN_SAMPLES;
        legendBorder.attr('height', height_so_far)

    }

    // Main function to draw the chart for each svg element in selection (will be returned)
    function chart(selection) {

        let rightMarginBackup = margin.right;
        if (!showLegend) {
            margin.right = 10;
        }
        selection.each(function(data) {

            // Sort the data so bigger dots will be below smaller ones
            data.sort(sortFunc(d => rAccessor(d), false));

            // Update the scales' ranges and domains
            updateScales(data);

            // Select the svg element, if it exists.
            let svg = d3.select(this).data([data]);
            svg.attr("width", width)
                .attr("height", height); // Update the outer dimensions (the ones HTML knows about)
            svg.append('rect')
                .attr('class', 'background')
                .attr('width', width)
                .attr('height', height);

            // Draw a title for the chart
            drawChartTitle(svg);

            // Draw axes
            drawAxes(svg);

            // Draw each datapoint
            if (boba && boba_fireworkStyle) {
                drawFireworks(svg, data);
            } else if (boba && !boba_fireworkStyle) {
                 drawBoba(svg, data)
            } else {
                drawCircles(svg, data);
            }

            // Draw the legend
            if (showLegend) {
                drawLegend(svg, data);
            }
        });

        margin.right = rightMarginBackup;
    }

    return chart;
}

// Exporting variables and functions
export { chartMaker };