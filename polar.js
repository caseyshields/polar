
// TODO add heading vector on the blip if data includes velocity?
// TODO apart from drawing blips we might add ameobas using the d3.lineRadial() as a path generator..

/** Factory method which returns a polar plot component.
 * Angle zero points to the right, and angles advance CCW.
 * @param {number[]} [args.center=[250,250]] : Screen position of plot origin [x,y] order
 * @param {number} [args.radius=250] : radius of plot in pixels
 * @param {number} [args.maxRange=256] : Maximum input range
 * @param {number} [args.turns=2*Math.PI] : Units per rotation, defaults to radians
 * @param {number} [args.rotate=-Math.PI/2] : number or radians to rotate the scope display by 
*/
let createPolarPlot = function ( svg, parameters ) {

    // initialized with defaults, then overwrite with user arguments
    let args = {
        center: [250, 250],
        radius: 250,
        maxRange: 256,
        turn: 2*Math.PI,
        rotate: -Math.PI/2,
        maxBlip: 10,
        minPower: -128,
        maxPower: 127,
        rangeTicks: 4,
        angleTicks: 8,
    };
    Object.assign(args, parameters);

    // create scales for the plot axis
    let ranges = d3.scaleLinear()
        .domain([0, args.maxRange])
        .range([0, args.radius])
        .clamp(true);
    let angles = d3.scaleLinear()
        .domain( [0,args.turn] )
        .range( [0, 2*Math.PI] )
        .clamp(false);
    let powers = d3.scaleLinear()
        .domain([args.minPower, args.maxPower])
        .range([0,args.maxBlip])
        .clamp(true);
    
    // create svg groups for the different visual parts of the component
    let group = svg.append('g')
        .attr('class', 'scope');
    let raxis = group.append('g')
        .classed('raxis', true)
        .selectAll('circle');
    let aaxis = group.append('g')
        .classed('aaxis', true)
        .selectAll('line');
    let cross = group.append('circle')
        .classed('crosshair', true);
    let hair = group.append('line')
        .classed('crosshair', true);
    let blips = group.append('g')
        .classed('blips', true)
        .selectAll('circle');
    // TODO these need to be added in an encompassing group!!

    // // default data accessors
    // let getRange = function(d){return d.range;}; // range in screen units
    // let getAngle = function(d){return d.angle;}; // angle in radians, with angle zero in the [0, -1] screen direction
    // let getPower = function(d){return d.power;}; // blip diameter in screen units

    // default event handlers
    let clicked = function(blip, index, selection){}; // this will be added to individual blips on the update phase
    let moved = function(){};
    // TODO I should really just enable mouse events for a circle containing the plot, not the entire SVG...
    // TODO add a mouse wheel event that changes the range axis?

    // array of polar plot blips
    let data = [];

    /** Creates/updates both the blips and grid of the polar plot */
    let plot = function() {
        plot.drawBlips();
        plot.drawGrid(args.rangeTicks, args.angleTicks);
    }

    /** Creates/updates blips on the polar plot. */
    plot.drawBlips = function() {
        blips = blips.data( data );
        blips.exit()
                .remove();
        blips = blips.enter()
            .append('circle')
                //.on('click', clicked) // I don't think this affects performance...
            .merge(blips)
                .each( function(d) {
                    let r = ranges(d.range);//getRange(d));
                    let a = angles(d.angle) + args.rotate;//getAngle(d));
                    let p = powers(d.power);//getPower(d));
                    d3.select(this)
                        .attr('cx', args.center[0] + r * Math.cos(a))
                        .attr('cy', args.center[1] - r * Math.sin(a)) // negate y to account for screen flip... // is there a clearer way?
                        .attr('r', p )
                        .classed(d.class, true);
                });
    }
    // here's a version with keyed, static objects. it's actually noticably slower than everything being dynamic!
    // At A guess, I'd say it's because altering all the SVG attributes instead of changing DOM structure is faster...
    // plot.drawBlips = function() {
    //     blips = blips.data( data, function(d){return d.time;} );
    //     blips.exit()
    //             .remove();
    //     blips = blips.enter()
    //         .append('circle')
    //             .each( function(d) {
    //                 let r = ranges(getRange(d));
    //                 let a = angles(getAngle(d));
    //                 let p = powers(getPower(d));
    //                 d3.select(this)
    //                     .attr('cx', args.center[0] + r * Math.cos(a))
    //                     .attr('cy', args.center[1] - r * Math.sin(a)) // negate y to account for screen flip... // is there a clearer way?
    //                     .attr('r', p )
    //                     .classed(d.class, true);
    //             })
    //             .on('click', clicked)
    //         .merge(blips);
    // }
    
    /** Draws a polar grid
     * @param {Integer} n - Number of range graduations
     * @param {Integer} m - Number of angle graduations */
    plot.drawGrid = function(n,m) {
        // derive incremental range distances
        let distances = [];
        let dn = ranges.domain()[1] / n;
        for (let i=n; i>=1; i--)
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

    /** Draws polar crosshairs if the range is within the configured maxRange, otherwise clears the crosshairs.
     * @param angle : the angle of the crosshair, in the same units used by the data
     * @param range : the distance from the origin, in the same units as the data
    */
    plot.drawCrosshairs = function([angle, range]) {
        if (range < args.maxRange) {
            let distance = ranges(range);
            cross.attr('r', distance)
                .attr('cx', args.center[0])
                .attr('cy', args.center[1]);
            let heading = plot.polar2screen([angle, args.maxRange]);
            hair.attr('x1', args.center[0])
                .attr('x2', heading[0])
                .attr('y1', args.center[1])
                .attr('y2', heading[1]);
        } else {
            cross.attr('r', '0')
                .attr('cx', '0')
                .attr('cy', '0');
            hair.attr('x1', '0')
                .attr('x2', '0')
                .attr('y1', '0')
                .attr('y2', '0');
        } // messing with display messes up the animation timers
    }

    /** @callback d3callback
     * @param {Object} data - the data object
     * @param {number} index - the index of the data
     * @param {Object} selection - the D3 selection
    */

    /** Sets the callback for handling blips being clicked, and returns the plot object for chaining.
     * @param {d3callback} callback - a D3 style event handler
     * @return {plot} */
    plot.click = function( callback ) {
        clicked = callback;
        return plot;
    }

    /** Sets the callback for handling mouse movement, and returns the plot object for chaining.
     * @param {function} callback - A no-argument function to be called. use d3.mouse(this) to obtain the current screen coordinates
     * @return {plot} */
    plot.move = function( callback ) {
        moved = callback;
        svg.on('mousemove', moved);
        return plot;
    }

    /** Convert screen coordinates into the coordinates of the input.
     * @param {number[]} screen - a two element array holding screen coordinates in [x, y] order
     * @return {number[]} */
    plot.screen2polar = function(screen) {
        let x = screen[0]-args.center[0];
        let y = screen[1]-args.center[1];
        let r = Math.sqrt(x*x + y*y);
        let a = Math.atan2(y, x) - args.rotate;
        let range = ranges.invert( r );
        let angle = angles.invert( a );
        return [angle,range];
    }

    /** Convert polar coordinates to screen coordinates.
     * @param {number[]} polar - A two element array holding polar coordinates in [a, r] order. Units are the same as the configured input units. 
     * @return {number[]} */
    plot.polar2screen = function( polar ) {
        let a = angles( polar[0] ) + args.rotate;
        let r = ranges( polar[1] );
        let x = args.center[0] + r * Math.cos(a);
        let y = args.center[1] + r * Math.sin(a);
        return [x, y];
    }

    /** Sets the screen coordinates of the center of the polar plot and returns the plot object for chaining.
     * @param {number[]} point - a point in screen coordinates in [x,y] order.
     * @return {plot} */
    plot.center = function( point ) {
        args.center = point;
        plot();
        return plot;
    }

    /** Adds a blip to the display using only the required fields.
     * @param {string} classy - the CSS class to apply to the blip
     * @param {number} range - the range as a number between 0 and args.maxRange
     * @param {number} angle - the angle as a number between 0 and args.turn
     * @param {number} power - the blips power determines is visual size on the display
     * @return {plot}
    */
    plot.addBlip = function( classy, range, angle, power ) {
        let blip = {
            class: classy,
            range: range,
            angle: angle,
            power: power,
        };
        return plot.add( blip );
    }

    /** Adds the given object to the Blip data. This method does not force a redraw because you may
     * wish to add multiple blips per render frame.*/
    plot.add = function( blip ) {
        data.push(blip);
        return plot;
        // update bounds of the ranges or powers scales?
    }

    //TODO this is inefficient!; figure out a better way to do this, like time bounds or adding an index...
    plot.remove = function( blip ) {
        let index = data.findIndex( (event)=>{return event===blip} );
        if (index!=undefined)
            data = data.slice( index );
    }

    /** Setter/getter for plot data array
     * @param {Object[]} [arr] - sets the plot data to the given array if provided
     * @return the plot data if no array is provided, otherwise returns the plot data for method for chaining
     */
    plot.blips = function( arr ) {
        if(arr) {
            data = arr;
            return plot;
        } else return data;
    }

    plot.clearBlips = function() {
        while (data.length>0)
            data.pop(); // TODO is there a constant time way to do this?
        return map;
    }
    // TODO add time bounded clear methods? used to expire event in a stream

    return plot;
}