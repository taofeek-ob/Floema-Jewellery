/**
 * @fileoverview This file contains the Home class which is used to create a gallery of media elements.
 */

// Importing necessary classes and functions from external libraries
import { Plane, Transform } from "ogl";
import GSAP from "gsap";
import Media from "./media";
import map from "lodash/map";

/**
 * @class Home
 * @classdesc The Home class creates a gallery of media elements using the Media class and provides methods for handling user interactions such as resizing and touch events.
 */
export default class Home {
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

    // Assigning the value of scene to this.scene
    this.scene = scene;
    // Selecting the element with the class name 'home__gallery' and assigning it to
    this.galleryElement = document.querySelector(".home__gallery");
    // Selecting all elements with the class name 'home__gallery__media__image' and assigning them to this.mediasElement
    this.mediasElement = document.querySelectorAll(
      ".home__gallery__media__image"
    );
    this.sizes = sizes;

    // Initializing properties for x axis movement/scrolling
    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    // Initializing properties for y axis movement/scrolling
    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    // Initializing scrollCurrent property for x and y axis
    this.scrollCurrent = {
      x: 0,
      y: 0,
    };

    // Initializing scroll property for x and y axis
    this.scroll = {
      x: 0,
      y: 0,
    };
    // Calling the createGeometry method
    this.createGeometry();
    // Calling the createGallery method
    this.createGallery();

    this.onResize({ sizes: this.sizes });
    // Setting the parent of this.group to scene
    this.group.setParent(this.scene);
    this.show();
  }

  /**
   * @method createGeometry
   * @description This method creates a new Plane object using the ogl library and assigns it to this.geometry.
   */
  createGeometry() {
    this.geometry = new Plane(this.gl, {
      heightSegments: 20,
      widthSegments: 20,
    });
  }

  /**
   * @method createGallery
   * @description This method creates a new Media object for each media element in this.mediasElement and adds it to an array assigned to this.medias.
   */
  createGallery() {
    // Mapping over each media element in mediasElement array and creating a new Media object for each one
    this.medias = map(this.mediasElement, (media, index) => {
      return new Media({
        element: media,
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
    // Getting the bounding rectangle of the gallery element and assigning it to
    this.galleryBounds = this.galleryElement.getBoundingClientRect();
    // Calling the onResize method for each Media object in medias
    this.sizes = event.sizes;
    // Calculating the width and height of the gallery element based on the window size
    this.gallerySizes = {
      width: (this.galleryBounds.width / window.innerWidth) * this.sizes.width,
      height:
        (this.galleryBounds.height / window.innerHeight) * this.sizes.height,
    };

    this.scroll.x = this.x.target = 0;
    this.scroll.y = this.y.target = 0;

    map(this.medias, (media) => media.onResize(event, this.scroll));
  }

  /**
   * @method onTouchDown
   * @description This method sets the scrollCurrent property to the current scroll position when a touch event starts.
   * @param {Object} options - An object containing properties x and y representing touch coordinates.
   */
  onTouchDown({ x, y }) {
    this.speed.target = 1;
    // Setting the x and y properties of scrollCurrent to the x and y properties of scroll
    this.scrollCurrent.x = this.scroll.x;
    this.scrollCurrent.y = this.scroll.y;
  }

  /**
   * @method onTouchMove
   * @description This method updates the target scroll position based on touch movement.
   * @param {Object} options - An object containing properties x and y representing touch coordinates.
   */
  onTouchMove({ x, y }) {
    // Calculating the distance between the start and end points of the touch event
    const xDistance = x.start - x.end;
    const yDistance = y.start - y.end;
    // Setting the target scroll position to the current scroll position minus the distance between the start and end points of the touch event
    this.x.target = this.scrollCurrent.x - xDistance;
    this.y.target = this.scrollCurrent.y - yDistance;
  }

  /**
   * @method onTouchUp
   * @description This method is called when a touch event ends but does not perform any actions.
   * @param {Object} options - An object containing properties x and y representing touch coordinates.
   */
  onTouchUp({ x, y }) {
    this.speed.target = 0;
  }

  /**
   * @method update
   * @description This method updates the current scroll position using GSAP's interpolate utility and calls the update method for each Media object in this.medias with the updated scroll position.
   */

  update() {


    this.speed.current = GSAP.utils.interpolate(this.speed.current, this.speed.target, this.speed.lerp);
    const distance = (this.y.current - this.y.target) * 0.1;

    // Updating this.x.current using GSAP's interpolate utility
    this.x.current = GSAP.utils.interpolate(
      this.x.current,
      this.x.target,
      this.x.lerp
    );

    this.y.target -= 1;
    this.y.target += distance;

    // this.galleryScroll.target += distance;

    // Updating this.y.current using GSAP's interpolate utility
    this.y.current = GSAP.utils.interpolate(
      this.y.current,
      this.y.target,
      this.y.lerp
    );
    // Setting the direction property of this.x to left or right based on the current and target scroll positions
    if (this.scroll.x < this.x.current) {
      this.x.direction = "right";
    } else if (this.scroll.x > this.x.current) {
      this.x.direction = "left";
    }
    if (this.scroll.y < this.y.current) {
      this.y.direction = "top";
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = "bottom";
    }

    // Setting the x and y properties of scroll to the current x and y values
    this.scroll.x = this.x.current;
    this.scroll.y = this.y.current;

    // Calling the update method for each Media object in medias with updated scroll position
    map(this.medias, (media, index) => {
      // Calculating the x position of the media element and adding the gallery width to the extra x property if the direction is left and the x position is less than half the width of the gallery
      if (this.x.direction === "left") {
        const x = media.mesh.position.x + media.mesh.scale.x / 2;

        if (x < -this.sizes.width / 2) {
          media.extra.x += this.gallerySizes.width;
          media.mesh.rotation.z = GSAP.utils.random(
            -Math.PI * 0.03,
            Math.PI * 0.03
          );
        }
      } else if (this.x.direction === "right") {
        const x = media.mesh.position.x - media.mesh.scale.x / 2;

        if (x > this.sizes.width / 2) {
          media.extra.x -= this.gallerySizes.width;
          media.mesh.rotation.z = GSAP.utils.random(
            -Math.PI * 0.02,
            Math.PI * 0.03
          );
        }
      }
      if (this.y.direction === "top") {
        const y = media.mesh.position.y + media.mesh.scale.y / 2;

        if (y < -this.sizes.width / 2) {
          media.extra.y += this.gallerySizes.height;
          media.mesh.rotation.z = GSAP.utils.random(
            -Math.PI * 0.02,
            Math.PI * 0.03
          );
        }
      } else if (this.y.direction === "bottom") {
        const y = media.mesh.position.y - media.mesh.scale.y / 2;

        if (y > this.sizes.width / 2) {
          media.extra.y -= this.gallerySizes.height;
          media.mesh.rotation.z = GSAP.utils.random(
            -Math.PI * 0.02,
            Math.PI * 0.03
          );
        }
      }
      media.update(this.scroll, this.speed.current);

    });
  }

  /**
   * @method onWheel
   * @description This method updates the target scroll position based on the wheel event.
   * @param {Object} options - An object containing properties pixelX and pixelY representing the amount of pixels scrolled horizontally and vertically.
   */
  onWheel({ pixelX, pixelY }) {
    // Adding the pixelX and pixelY values to the target scroll position
    this.x.target += pixelX;
    this.y.target += pixelY;
  }

  destroy() {
    this.scene.removeChild(this.group);
  }

  show() {
    map(this.medias, (media) => media.show());
  }
  hide() {
    map(this.medias, (media) => media.hide());
  }
}
