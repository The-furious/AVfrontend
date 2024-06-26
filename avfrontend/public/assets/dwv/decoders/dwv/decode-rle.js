/* eslint-disable no-restricted-globals */
/**
 * RLE decoder worker.
 */
// Do not warn if these variables were not defined before.

/* global importScripts,self, JpxImage, dwv */

importScripts('rle.js');

// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', function (event) {

    // decode DICOM buffer
    var decoder = new dwv.decoder.RleDecoder();
    // post decoded data
    self.postMessage([decoder.decode(
        event.data.buffer,
        event.data.meta.bitsAllocated,
        event.data.meta.isSigned,
        event.data.meta.sliceSize,
        event.data.meta.samplesPerPixel,
        event.data.meta.planarConfiguration )]);

}, false);
