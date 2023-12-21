This is a project I've wanted to do for a long time, and thanks to the a1k0n blog, I was able to understand the logic behind this famous animation.

Link to the C++ donut blog: https://www.a1k0n.net/2011/07/20/donut-math.html

It's made with vanilla JavaScript, so you just need to clone the repo and run the index.html. There is a bug where the donut only appears if you resize the screen, so when running the index, you need to do a resize (or what I do, open developer mode and close it).

Inside script.js, you have the following important variables:

pixel_width → sets the width of the donut's pixels
pixel_height → sets the height of the donut's pixels
ctx.font (line 58) → sets the size of the characters. THE SIZE OF THE CHARACTERS SHOULD NOT BE LARGER THAN pixel_width AND pixel_height.

All the donut parameters (lines 45-47) → set the total radius, inner radius, and the projection constants K.

theta_spacing → originally had it at 10, but with 5, it looks much better. This sets the angular spacing of the donut when generated.