import GSAP from "gsap";
import each from "lodash/each";
import {Texture} from "ogl";

import { split } from "../utils/text";

import Component from "../classes/component";

export default class Preloader extends Component {
  constructor(canvas) {
    super({
      element: ".preloader",
      elements: {
        title: ".preloader__text",
        number: ".preloader__number",
        numberText: ".preloader__number__text",
        images: document.querySelectorAll("img"),
      },
    });

      this.canvas = canvas
    window.TEXTURES = {}


    split({
      element: this.elements.title,
      expression: "<br>",
    });

    split({
      element: this.elements.title,
      expression: "<br>",
    });

    this.elements.titleSpans =
      this.elements.title.querySelectorAll("span span");

    this.length = 0;

    this.createLoader();

  }

  createLoader() {
    each(window.ASSETS, (image) => {
      const texture = new Texture(this.canvas.gl, {
        generateMipmaps: false,
      });

      const media = new window.Image();

      media.crossOrigin = 'anonymous';
      media.src = image;

      media.onload = (_) => {
        texture.image = media;

        this.onAssetLoaded();
      };

      window.TEXTURES[image] = texture;
    });
  }

  onAssetLoaded(image) {
    this.length += 1;

    const percentage = this.length / window.ASSETS.length;

    this.elements.numberText.innerHTML = `${Math.round(percentage * 100)}%`;

    if (percentage === 1) {
      this.onLoaded();
    }
  }

  onLoaded() {
    return new Promise((resolve) => {
      this.emit("completed");
      this.animateOut = GSAP.timeline({
        delay: 1,
      });

      this.animateOut.to(this.elements.titleSpans, {
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.1,
        y: "100%",
      });

      this.animateOut.to(
        this.elements.numberText,
        {
          duration: 1.5,
          ease: "expo.out",
          stagger: 0.1,
          y: "100%",
        },
        "-=1,4"
      );

      this.animateOut.to(
        this.element,
        {
          autoAlpha: 0,
          duration: 1,
        },
      );

      this.animateOut.call(() => {
        this.destroy();
      });
    });
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}
