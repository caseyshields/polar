
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
        rangeTicks: 4,
        angleTicks: 8,
        angleOffset: -Math.PI,
    };
    Object.assign(args, parameters);

    // create scales for the plot axis
    let ranges = d3.scaleLinear()
        .domain([0, args.maxRange])
        .range([0, args.radius])
        .clamp(true);
    let angles = d3.scaleLinear()
        .domain([0,args.turn])
        .range([ args.angleOffset/2.0, 2*Math.PI + args.angleOffset/2.0 ])
        .clamp(false);
    let powers = d3.scaleSqrt()
        .domain([args.minPower, args.maxPower])
        .range([0,args.maxBlip])
        .clamp(true);
    
    let raxis = svg.append('g')
        .classed('raxis', true)
        .selectAll('circle');
    let aaxis = svg.append('g')
        .classed('aaxis', true)
        .selectAll('line');

    let blips = svg.append('g').classed('blips', true)
        .selectAll('circle');

    // default data accessors
    let getRange = function(d){return d.range;}; // range in screen units
    let getAngle = function(d){return d.angle;}; // angle in radians, with angle zero in the [0, -1] screen direction
    let getPower = function(d){return d.power;}; // blip diameter in screen units

    // default event handlers
    let clicked = function(blip, index, selection){}; // this will be added to individual blips on the update phase
    let moved = function(){};
    svg.on('mousemove', moved);
    // TODO add a mouse wheel event that changes the range axis?

    // array of polar plot blips
    let data = [];

    /** redraw the polar plot in the selected SVG */
    let plot = function() {
        plot.drawBlips();
        plot.drawGrid(args.rangeTicks, args.angleTicks);
    }

    plot.drawBlips = function() {
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

    plot.drawGrid = function(n,m) {
        // derive incremental range distances
        let distances = [];
        let dn = ranges.domain()[1] / n;
        for (let i=1; i<=n; i++)
            distances.push( i*dn );
        // let ticks = ranges.ticks(n).slice(1);

        raxis = raxis.data(distances);
        raxis.exit().remove();
        raxis = raxis.enter()
            .append('circle')
            .merge( raxis )
                .attr('cx', args.center[0])
                .attr('cy', args.center[1])
                .attr('r', function(d){return ranges(d);});
        
        // also mark headings
        let headings = [];
        let dm = args.turn/m;
        for (let j=0; j<m; j++)
            headings.push( [Math.cos(angles(j*dm)), Math.sin(angles(j*dm))] );
        // let headings = angles.ticks(m-1)
        //     .map( function(t){return [Math.cos(t), Math.sin(t)];} );
        
        let Rmin = ranges(distances[0]);
        let Rmax = ranges(distances[n-1]);
        aaxis = aaxis.data( headings );
        aaxis.exit().remove();
        aaxis = aaxis.enter()
            .append('line')
            .merge(aaxis)
                .attr('x1', function(d){return Rmin*d[0]+args.center[0];})
                .attr('x2', function(d){return Rmax*d[0]+args.center[0];})
                .attr('y1', function(d){return Rmin*d[1]+args.center[1];})
                .attr('y2', function(d){return Rmax*d[1]+args.center[1];})
    }

    plot.click = function( callback ) {
        clicked = callback;
        return plot;
    }

    plot.move = function( callback ) {
        moved = callback;
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
        // console.log(blip);
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