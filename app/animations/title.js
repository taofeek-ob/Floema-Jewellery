import { calculate, split } from "../utils/text";
import each from "lodash/each";
import GSAP from "gsap";

import Animation from "classes/animation";

export default class Title extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });

    split({
      element: this.element,
      expression: "<br>",
    });

    split({
      element: this.element,
      expression: "<br>",
    });

    this.elementLinesSpans = this.element.querySelectorAll("span span");
  }

  animateIn() {
    this.timelineIn = GSAP.timeline({
      delay: 0.5,
    });
    GSAP.to(this.element, {
      autoAlpha: 1,
      duration: 1,
    });

    each(this.elementLinesSpans, (line, index) => {
      this.timelineIn.fromTo(
        line,

        {
          y: "100%",
        },
        {
          delay: index * 0.2,
          duration: 1.5,
          ease: "expo.out",
          y: "0%",
        },
        0
      );
    });
  }

  animateOut() {
    GSAP.set(this.element, {
      autoAlpha: 0,
    });
  }


}
