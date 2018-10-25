
/** Factory method which returns a polar plot component */
let createPolarPlot = function ( svg, width, height ) {
    //maxRange?
    // angle conversion factor?
    // range conversion factor?
    let radius = Math.min(width, height) / 2.0;

    let mScale = d3.scaleLinear()
        .domain([-128, 127])
        .range([1,10])
        // our measurements expressed as a decimal logarithm
    //TODO should size or color be tied to the data? both?
    
    let rScale = d3.scaleSqrt()//scaleLinear()
        .domain([0,256])
        .range([0, radius]);
        // a typical range

    let aScale = d3.scaleLinear()
        .domain([0,360])
        .range([0, 2*Math.PI]);
        // our input is in degrees

    let grid = svg.append('g').classed('grid', true)
        .selectAll('path');

    let blips = svg.append('g').classed('blips', true)
        .selectAll('circle');

    let data = [];
    //TODO add headings and rings? radar polygons? Ameobas?

    let clicked = function(blip, index, selection){}; // default blip click handler

    /** redraw the polar plot in the selected SVG */
    let plot = function() {
        blips = blips.data( data );
        blips.exit()
                .remove();
        blips = blips.enter()
            .append('circle')
                .attr('class', function(d){return d.class;} )
                .on('click', clicked)
            .merge(blips)
                .attr('r', function(d){return mScale(d.mag);} )
                .each( function(d) {
                    let r = rScale(d.range);
                    let a = aScale(d.angle);
                    d3.select(this)
                        .attr('cx', radius + r * Math.cos(a))
                        .attr('cy', radius + r * Math.sin(a));
                });
    }

    plot.click = function( callback ) {
        clicked = callback;
        return plot;
    }

    /** Adds a blip to the display using only the required fields. */
    plot.addBlip = function( classy, range, angle, mag ) {
        let blip = {
            range: range,
            angle: angle,
            class: classy,
            mag: mag,
        };
        console.log(blip);
        data.push(blip);
        plot();
        return plot;
    }

    // TODO
    // plot.screen2polar(point) {
    // }

    return plot;
}