import GSAP from "gsap";

import Animation from "classes/animation";

export default class Label extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });


  }

  animateIn() {
    this.timelineIn = GSAP.timeline({
      delay: 0.5,
    });
    GSAP.to(this.element, {
      autoAlpha: 1,
      duration: 1,
    });
  }

  animateOut() {
    GSAP.set(this.element, {
      autoAlpha: 0,
    });
  }


}
