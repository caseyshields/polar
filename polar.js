
// TODO add headings and rings? radar polygons? Ameobas?
// TODO add heading vector on the blip?

/** Factory method which returns a polar plot component
 * @param {number} args.centerx - Horizontal screen position of plot origin
 * @param {number} args.centery - Vertical screen position of plot origin
 * @param {number} args.radius - radius of plot in pixels
 * @param {D3 continuous scale} args.ranges
*/
let createPolarPlot = function ( svg, parameters ) {

    // initialized with defaults, then overwrite with user arguments
    let args = {
        center: [250,250],
        radius: 250,
        maxRange: 256,
        turn: 360,
        maxBlip: 10,
        minPower: -128,
        maxPower: 127,
    };
    Object.assign(args, parameters);

    // create scales for the plot axis
    let ranges = d3.scaleLinear()
        .domain([0, args.maxRange])
        .range([0, args.radius])
        .clamp(true);
    let angles = d3.scaleLinear()
        .domain([0,args.turn])
        .range([0,2*Math.PI])
        .clamp(false);
    let powers = d3.scaleSqrt()
        .domain([args.minPower, args.maxPower])
        .range([0,args.maxBlip])
        .clamp(true);
    
    let grid = svg.append('g').classed('grid', true)
        .selectAll('path');

    let blips = svg.append('g').classed('blips', true)
        .selectAll('circle');

    let clicked = function(blip, index, selection){}; // default blip click handler
    let getRange = function(d){return d.range;}; // range in screen units
    let getAngle = function(d){return d.angle;}; // angle in radians, with angle zero in the [0, -1] screen direction
    let getPower = function(d){return d.power;}; // blip diameter in screen units

    let data = [];

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
                .attr('r', function(d){return powers(getPower(d));} )
                .each( function(d) {
                    let r = ranges(getRange(d));
                    let a = angles(getAngle(d));
                    d3.select(this)
                        .attr('cx', args.center[0] + r * Math.cos(a))
                        .attr('cy', args.center[1] + r * Math.sin(a));
                });
    }

    let drawGrid = new function() {
        // update the grid svg
    }

    plot.click = function( callback ) {
        clicked = callback;
        return plot;
    }

    plot.center = function( point ) {
        args.center = point;
        plot();
        return plot;
    }

    /** Adds a blip to the display using only the required fields. */
    plot.addBlip = function( classy, range, angle, power ) {
        let blip = {
            class: classy,
            range: range,
            angle: angle,
            power: power,
        };
        console.log(blip);
        data.push(blip);
        plot();
        return plot;
        // update bounds of the ranges or powers scales?
    }

    // TODO
    // plot.screen2polar(point) {
    // }

    return plot;
}