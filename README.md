## Functions

<dl>
<dt><a href="#createPolarPlot">createPolarPlot()</a></dt>
<dd><p>Factory method which returns a polar plot component.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#d3callback">d3callback</a> : <code>function</code></dt>
<dd></dd>
</dl>

<a name="createPolarPlot"></a>

## createPolarPlot()
Factory method which returns a polar plot component.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| args.center | <code>Array.&lt;number&gt;</code> |  | Screen position of plot originin [x,y] order |
| [args.radius] | <code>number</code> | <code>250</code> | radius of plot in pixels |
| [args.maxRange] | <code>number</code> | <code>256</code> | Maximum input range |


* [createPolarPlot()](#createPolarPlot)
    * [~plot()](#createPolarPlot..plot)
        * [.drawBlips()](#createPolarPlot..plot.drawBlips)
        * [.drawGrid(n, m)](#createPolarPlot..plot.drawGrid)
        * [.drawCrosshairs()](#createPolarPlot..plot.drawCrosshairs)
        * [.click(callback)](#createPolarPlot..plot.click) ΓçÆ <code>plot</code>
        * [.move(callback)](#createPolarPlot..plot.move) ΓçÆ <code>plot</code>
        * [.screen2polar(screen)](#createPolarPlot..plot.screen2polar) ΓçÆ <code>Array.&lt;number&gt;</code>
        * [.polar2screen(polar)](#createPolarPlot..plot.polar2screen) ΓçÆ <code>Array.&lt;number&gt;</code>
        * [.center(point)](#createPolarPlot..plot.center) ΓçÆ <code>plot</code>
        * [.addBlip(classy, range, angle, power)](#createPolarPlot..plot.addBlip) ΓçÆ <code>plot</code>

<a name="createPolarPlot..plot"></a>

### createPolarPlot~plot()
Creates/updates both the blips and grid of the polar plot

**Kind**: inner method of [<code>createPolarPlot</code>](#createPolarPlot)  

* [~plot()](#createPolarPlot..plot)
    * [.drawBlips()](#createPolarPlot..plot.drawBlips)
    * [.drawGrid(n, m)](#createPolarPlot..plot.drawGrid)
    * [.drawCrosshairs()](#createPolarPlot..plot.drawCrosshairs)
    * [.click(callback)](#createPolarPlot..plot.click) ΓçÆ <code>plot</code>
    * [.move(callback)](#createPolarPlot..plot.move) ΓçÆ <code>plot</code>
    * [.screen2polar(screen)](#createPolarPlot..plot.screen2polar) ΓçÆ <code>Array.&lt;number&gt;</code>
    * [.polar2screen(polar)](#createPolarPlot..plot.polar2screen) ΓçÆ <code>Array.&lt;number&gt;</code>
    * [.center(point)](#createPolarPlot..plot.center) ΓçÆ <code>plot</code>
    * [.addBlip(classy, range, angle, power)](#createPolarPlot..plot.addBlip) ΓçÆ <code>plot</code>

<a name="createPolarPlot..plot.drawBlips"></a>

#### plot.drawBlips()
Creates/updates blips on the polar plot.

**Kind**: static method of [<code>plot</code>](#createPolarPlot..plot)  
<a name="createPolarPlot..plot.drawGrid"></a>

#### plot.drawGrid(n, m)
Draws a polar grid

**Kind**: static method of [<code>plot</code>](#createPolarPlot..plot)  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>Integer</code> | Number of range graduations |
| m | <code>Integer</code> | Number of angle graduations |

<a name="createPolarPlot..plot.drawCrosshairs"></a>

#### plot.drawCrosshairs()
Draws polar crosshairs if the range is within the configured maxRange, otherwise clears the crosshairs.

**Kind**: static method of [<code>plot</code>](#createPolarPlot..plot)  
<a name="createPolarPlot..plot.click"></a>

#### plot.click(callback) ΓçÆ <code>plot</code>
Sets the callback for handling blips being clicked, and returns the plot object for chaining.

**Kind**: static method of [<code>plot</code>](#createPolarPlot..plot)  

| Param | Type | Description |
| --- | --- | --- |
| callback | [<code>d3callback</code>](#d3callback) | a D3 style event handler |

<a name="createPolarPlot..plot.move"></a>

#### plot.move(callback) ΓçÆ <code>plot</code>
Sets the callback for handling mouse movement, and returns the plot object for chaining.

**Kind**: static method of [<code>plot</code>](#createPolarPlot..plot)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | A no-argument function to be called. use d3.mouse(this) to obtain the current screen coordinates |

<a name="createPolarPlot..plot.screen2polar"></a>

#### plot.screen2polar(screen) ΓçÆ <code>Array.&lt;number&gt;</code>
Convert screen coordinates into the coordinates of the input.

**Kind**: static method of [<code>plot</code>](#createPolarPlot..plot)  

| Param | Type | Description |
| --- | --- | --- |
| screen | <code>Array.&lt;number&gt;</code> | a two element array holding screen coordinates in [x, y] order |

<a name="createPolarPlot..plot.polar2screen"></a>

#### plot.polar2screen(polar) ΓçÆ <code>Array.&lt;number&gt;</code>
Convert polar coordinates to screen coordinates.

**Kind**: static method of [<code>plot</code>](#createPolarPlot..plot)  

| Param | Type | Description |
| --- | --- | --- |
| polar | <code>Array.&lt;number&gt;</code> | A two element array holding polar coordinates in [a, r] order. Units are the same as the configured input units. |

<a name="createPolarPlot..plot.center"></a>

#### plot.center(point) ΓçÆ <code>plot</code>
Sets the screen coordinates of the center of the polar plot and returns the plot object for chaining.

**Kind**: static method of [<code>plot</code>](#createPolarPlot..plot)  

| Param | Type | Description |
| --- | --- | --- |
| point | <code>Array.&lt;number&gt;</code> | a point in screen coordinates in [x,y] order. |

<a name="createPolarPlot..plot.addBlip"></a>

#### plot.addBlip(classy, range, angle, power) ΓçÆ <code>plot</code>
Adds a blip to the display using only the required fields.

**Kind**: static method of [<code>plot</code>](#createPolarPlot..plot)  

| Param | Type | Description |
| --- | --- | --- |
| classy | <code>string</code> | the CSS class to apply to the blip |
| range | <code>number</code> | the range as a number between 0 and args.maxRange |
| angle | <code>number</code> | the angle as a number between 0 and args.turn |
| power | <code>number</code> | the blips power determines is visual size on the display |

<a name="d3callback"></a>

## d3callback : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | the data object |
| index | <code>number</code> | the index of the data |
| selection | <code>Object</code> | the D3 selection |

