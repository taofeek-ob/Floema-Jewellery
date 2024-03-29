import GSAP from 'gsap';
import Button from 'classes/button';
import Page from 'classes/page';

export default class Detail extends Page {
  constructor() {
    super({

      id: 'detail',
      element: '.detail',
      elements: {
        wrapper: ".detail__wrapper",
        button: '.detail__button',
      },
    });
  }

  create() {
    super.create();

    this.link = new Button({
      element: this.elements.button,
    });
  }

  show() {
    const timeline = GSAP.timeline({
      delay: 2,
    });

    timeline.fromTo(
      this.element,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
      }
    );

    super.show(timeline);
  }

  destroy() {
    super.destroy();

    this.link.removeEventListeners();
  }
}
