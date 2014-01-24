Twitter Love-Hate Meter
========================

Node.js application that collects streaming tweets containing the words Love and Hate, spits them onto a webpage via WebSocket connection, and broadcasts tweets-per-second to an arduino via serialport. 

The Arduino file is rigged to receive those values and accordingly activate two digitally addressable LED strips as if they were a meter oscillating between 0 and 100 (tweets/second).

Many thanks to Stephen Bratisch for developing an easy-to-use [module](https://github.com/braitsch/node-leds/blob/master/modules/serial_node.js) with the serialport npm package.

![ScreenShot](https://raw.github.com/miketeix/LoveHate-Meter/master/public/img/loveHate.jpg) (https://vimeo.com/77535786)
