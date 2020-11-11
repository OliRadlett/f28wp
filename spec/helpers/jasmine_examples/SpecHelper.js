// jsdom would be a more elegant and lightweight solution but I couldn't make it work
const {
    Document,
    SVGElement
} = require('nodom');
global.document = new Document();
global.SVGElement = new SVGElement();
const {
    el,
    mount,
} = require('redom');

// TODO Load and parse the actual index.html page into the mock DOM
mount(document.body, el("#background"));
mount(document.body, el("#player"));
mount(document.body, el("#playerId"));