// Basing this off of this post and example file
// https://bost.ocks.org/mike/chart/
// https://bost.ocks.org/mike/chart/time-series-chart.js

import { chartMaker } from './resources/chartMaker.js';

let makeBobas = true;
let makebooks = true;
let makeMovies = true;
let makeSyntetic = true;

// Prep the chart "stamp" object
let bobaChart = chartMaker()
    .xAccessor(d => d.x)
    .yAccessor(d => d.y)
    .rAccessor(d => d.size)
    // .xTitleAttr("xTitle")
    // .yTitleAttr("yTitle")
    // .rTitleAttr("rTitle")
    // .chartTitleAttr("chartTitle")
    // .colorAccessor(d=> "orange")
    // .opacity(1)
    // .radiusRange([0,15])
    // .margin({top:20, right:20, bottom:50, left:40})
    .width(500)
    .height(400)
    .boba(true)
    .radiusRange([0, 20])
    .bobaCountRange([0, 20])
    .boba_pearlFDL(true)
    .boba_pearlArrangement('phyllotaxis');

let fireworkChart = chartMaker()
    .xAccessor(d => d.x)
    .yAccessor(d => d.y)
    .rAccessor(d => d.size)
    // .xTitleAttr("xTitle")
    // .yTitleAttr("yTitle")
    // .rTitleAttr("rTitle")
    // .chartTitleAttr("chartTitle")
    // .colorAccessor(d=> "orange")
    // .opacity(1)
    // .radiusRange([0,15])
    // .margin({top:20, right:20, bottom:50, left:40})
    .width(500)
    .height(400)
    .boba(true)
    .radiusRange([0, 40])
    .bobaCountRange([0, 20])
    .boba_pearlFDL(true)
    .boba_pearlArrangement('phyllotaxis')
    .boba_drawCup(false)
    .boba_fireworkStyle(true)
    .boba_raiseLinks(true)
    // .boba_colorize_pearls(true)
    .boba_colorize_links(true);

// Load the books data and make a chart
const MIN_RATINGS_COUNT = 706522;
function booksRowConverter(element) {    // Function to convert, filter elements of data

    // Filter the books to only include those with at least MIN_RATINGS_COUNT
    if (+element['ratings_count'] < MIN_RATINGS_COUNT) {
        return null;
    }

    // Convert number properties to actual numbers
    element.y = +element['average_rating'];
    element.x = +element["  num_pages"];
    element.size = +element['ratings_count'];

    return element;

}
d3.csv("../Real Dataset Investigation/Books/books.csv", booksRowConverter)
    .then(function (data) {
        if (makebooks) {
            d3.select("#booksVis")
                .attr('xTitle', 'Page Count')
                .attr('yTitle', 'Average Rating')
                .attr('rTitle', 'Ratings Count')
                .attr('chartTitle', 'Books Dataset')
                .datum(data)
            .call(fireworkChart);
            if (makeBobas) {
                d3.select("#booksVisA")
                    .attr('xTitle', 'Page Count')
                    .attr('yTitle', 'Average Rating')
                    .attr('rTitle', 'Ratings Count')
                    .attr('chartTitle', 'Books Dataset')
                    .datum(data)
                    .call(bobaChart);
                }
            }
});

// Load the movies data and make a chart
const MIN_POPULARITY = 39;
const MIN_VOTE_AVERAGE = 4;
function moviesRowConverter(element) {    // Function to convert, filter elements of data

    // Filter the movies to only include those with at least MIN_POPULARITY
    if (+element['popularity'] < MIN_POPULARITY) {
        return null;
    }

    // Filter the movies to only include those with at least MIN_VOTE_AVERAGE
    if (+element['vote_average'] < MIN_VOTE_AVERAGE) {
        return null;
    }

    // Convert number properties to actual numbers
    element.y = +element['vote_average'];
    element.x = +element["budget"] / 1000000;
    element.size = +element['vote_count'];

    return element;

}
d3.csv("../Real Dataset Investigation/Movies/movies_metadata.csv", moviesRowConverter)
    .then(function(data) {
        if (makeMovies) {
            d3.select("#moviesVis")
                .attr('xTitle', 'Budget (in millions of dollars)')
                .attr('yTitle', 'Vote Average')
                .attr('rTitle', 'Vote Count')
                .attr('chartTitle', 'Movies Dataset')
                .datum(data)
                .call(fireworkChart);
            if (makeBobas) {
                d3.select("#moviesVisA")
                    .attr('xTitle', 'Budget (in millions of dollars)')
                    .attr('yTitle', 'Vote Average')
                    .attr('rTitle', 'Vote Count')
                    .attr('chartTitle', 'Movies Dataset')
                    .datum(data)
                .call(bobaChart);
            }
        }
    });

// Load the synthetic data and make a chart
function syntheticRowConverter(element) {    // Function to convert, filter elements of data

    // Convert number properties to actual numbers
    element.y = +element['y'];
    element.x = +element["x"];
    element.size = +element['r'];

    return element;

}
d3.csv("../resources/synthetic6.csv", syntheticRowConverter)
    .then(function(data) {
        if (makeSyntetic) {
            d3.select("#syntheticVis")
                .attr('xTitle', 'X')
                .attr('yTitle', 'Y')
                .attr('rTitle', 'Size')
                .attr('chartTitle', 'Synthesized Dataset')
                .datum(data)
                .call(fireworkChart);

            if (makeBobas) {
                d3.select("#syntheticVisA")
                    .attr('xTitle', 'X')
                    .attr('yTitle', 'Y')
                    .attr('rTitle', 'Size')
                    .attr('chartTitle', 'Synthesized Dataset')
                    .datum(data)
                    .call(bobaChart);
            }
        }
    });
