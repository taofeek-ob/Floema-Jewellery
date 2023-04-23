import Media from "./media";
import { Transform } from "ogl";
import map from "lodash/map";
import GSAP from "gsap";
export default class Gallery {
  constructor({ element, geometry, gl, index, scene, sizes }) {
    this.element = element;
    this.geometry = geometry;
    this.elementWrapper = element.querySelector(".about__gallery__wrapper");
    this.gl = gl;
    this.scene = scene;
    this.index = index;
    this.sizes = sizes;
    this.group = new Transform();
    this.galleryScroll = {
      current: 0,
      target: 0,
      start: 0,
      lerp: 0.1,
      velocity: 1,
    };

    this.createMedias();
    this.onResize({
      sizes: this.sizes,
    });
    this.group.setParent(this.scene);
  }

  createMedias() {
    this.mediasElements = this.element.querySelectorAll(
      ".about__gallery__media"
    );
    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        geometry: this.geometry,
        gl: this.gl,
        index,
        scene: this.group,
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
    this.bounds = this.elementWrapper.getBoundingClientRect();
    // Calling the onResize method for each Media object in medias
    this.sizes = event.sizes;
    // Calculating the width and height of the gallery element based on the window size
    this.width = (this.bounds.width / window.innerWidth) * this.sizes.width;
    this.galleryScroll.current = this.galleryScroll.target = 0;
    map(this.medias, (media) =>
      media.onResize(event, this.galleryScroll.current)
    );
  }

  /**
   * @method onTouchDown
   * @description This method sets the scrollCurrent property to the current scroll position when a touch event starts.
   * @param {Object} options - An object containing properties x and y representing touch coordinates.
   */
  onTouchDown({ x, y }) {
    // Setting the x and y properties of scrollCurrent to the x and y properties of scroll
    this.galleryScroll.start = this.galleryScroll.current;
  }

  /**
   * @method onTouchMove
   * @description This method updates the target scroll position based on touch movement.
   * @param {Object} options - An object containing properties x and y representing touch coordinates.
   */
  onTouchMove({ x }) {
    // Calculating the distance between the start and end points of the touch event
    const distance = x.start - x.end;
    // Setting the target scroll position to the current scroll position minus the distance between the start and end points of the touch event
    this.galleryScroll.target = this.galleryScroll.start - distance;
  }

  /**
   * @method onTouchUp
   * @description This method is called when a touch event ends but does not perform any actions.
   * @param {Object} options - An object containing properties x and y representing touch coordinates.
   */
  onTouchUp({ x, y }) {}

  /**
   * @method update
   * @description This method updates the current scroll position using GSAP's interpolate utility and calls the update method for each Media object in this.medias with the updated scroll position.
   */

  update(scroll) {
    if (!this.bounds) return;
    const distance = (scroll.current - scroll.target) * 0.1;
    const y = scroll.current / window.innerHeight;

    if (this.galleryScroll.current < this.galleryScroll.target) {
      this.direction = "right";
      this.galleryScroll.velocity = -1;
    } else if (this.galleryScroll.current > this.galleryScroll.target) {
      this.direction = "left";
      this.galleryScroll.velocity = 1;
    }

    this.galleryScroll.target -= this.galleryScroll.velocity;
    this.galleryScroll.target += distance;

    this.galleryScroll.current = GSAP.utils.interpolate( this.galleryScroll.current, this.galleryScroll.target, this.galleryScroll.lerp ); // prettier-ignore

    // Calling the update method for each Media object in medias with updated scroll position
    map(this.medias, (media, index) => {
      // Calculating the x position of the media element and adding the gallery width to the extra x property if the direction is left and the x position is less than half the width of the gallery
      if (this.direction === "left") {
        const x = media.mesh.position.x + media.mesh.scale.x / 2 + 0.1;

        if (x < -this.sizes.width / 2) {
          media.extra += this.width;
        }
      } else if (this.direction === "right") {
        const x = media.mesh.position.x - media.mesh.scale.x / 2 + 0.1;

        if (x > this.sizes.width / 2) {
          media.extra -= this.width;
        }
      }

      media.update(this.galleryScroll.current);
      // media.mesh.position.y =
      //   Math.cos((media.mesh.position.x / this.width) * Math.PI) * 1 - 1;
    });

    this.group.position.y = y * this.sizes.height;
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
