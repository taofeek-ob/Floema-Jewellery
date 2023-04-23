/**
 * @fileoverview This file contains the Home class which is used to create a gallery of media elements.
 */

// Importing necessary classes and functions from external libraries
import { Plane, Transform } from "ogl";

import Gallery from "./gallery";
import map from "lodash/map";

/**
 * @class Home
 * @classdesc The Home class creates a gallery of media elements using the Media class and provides methods for handling user interactions such as resizing and touch events.
 */
export default class About {
  /**
   * @constructor
   * @param {Object} options - An object containing properties gl, scene and sizes.
   * @param {WebGLRenderingContext} options.gl - The WebGL rendering context.
   * @param {Object} options.scene - The scene object to which the gallery will be added.
   * @param {Object} options.sizes - An object containing size information for the gallery.
   */
  constructor({ gl, scene, sizes }) {
    // Assigning the value of gl to this.gl
    this.gl = gl;
    // Creating a new Transform object and assigning it to this.group
    this.group = new Transform();

    this.sizes = sizes;
    // Calling the createGeometry method
    this.createGeometry();
    // Calling the createGallery method
    this.createGalleries();

    this.onResize({ sizes: this.sizes })
    // Setting the parent of this.group to scene
    this.group.setParent(scene);

    this.show();
  }

  /**
   * @method createGeometry
   * @description This method creates a new Plane object using the ogl library and assigns it to this.geometry.
   */
  createGeometry() {
    const width = 1; // set to desired width
    const height = 1; // set to desired heig
    this.geometry = new Plane(this.gl, { width, height });
  }

  /**
   * @method createGallery
   * @description This method creates a new Media object for each media element in this.mediasElement and adds it to an array assigned to this.medias.
   */
  createGalleries() {

    this.galleriesElement = document.querySelectorAll(".about__gallery");

    this.galleries = map(this.galleriesElement, (element, index) => {
      return new Gallery({
        element,
        geometry: this.geometry,
        index,
        scene: this.group,
        gl: this.gl,
        sizes: this.sizes,
      });
    });
  }

  /**
   * @method onResize
   * @description This method calls the onResize method for each Media object in this.medias.
   * @param {Event} event - The resize event object.
   */
  onResize(event) {
    map(this.galleries, (gallery) => gallery.onResize(event));
  }

  /**
   * @method onTouchDown
   * @description This method sets the scrollCurrent property to the current scroll position when a touch event starts.
   * @param {Object} options - An object containing properties x and y representing touch coordinates.
   */
  onTouchDown(event) {
    map(this.galleries, (gallery) => gallery.onTouchDown(event));
  }

  /**
   * @method onTouchMove
   * @description This method updates the target scroll position based on touch movement.
   * @param {Object} options - An object containing properties x and y representing touch coordinates.
   */
  onTouchMove(event) {
    map(this.galleries, (gallery) => gallery.onTouchMove(event));
  }

  /**
   * @method onTouchUp
   * @description This method is called when a touch event ends but does not perform any actions.
   * @param {Object} options - An object containing properties x and y representing touch coordinates.
   */
  onTouchUp(event) {
    map(this.galleries, (gallery) => gallery.onTouchUp(event));
  }

  /**
   * @method update
   * @description This method updates the current scroll position using GSAP's interpolate utility and calls the update method for each Media object in this.medias with the updated scroll position.
   */
  update(scroll) {
    map(this.galleries, (gallery) => gallery.update(scroll));
  }

  onWheel() {}

  destroy() {
    map(this.galleries, (gallery) => gallery.destroy());
  }


  show() {
    map(this.galleries, (gallery) => gallery.show());
  }
  hide() {
    map(this.galleries, (gallery) => gallery.hide());
  }
}
