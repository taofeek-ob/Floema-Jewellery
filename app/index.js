import Preloader from "components/preloader";
import DetectionManager from "./classes/detection";
import Canvas from "./components/canvas";
import each from "lodash/each";
import { Home, About, Collections, Detail } from "pages";
import Navigation from "./components/navigation";
import NormalizeWheel from "normalize-wheel";
class App {
  constructor() {

     this.y = {
      start: 0,
      distance: 0,
      end: 0,
    };
    this.createContent();

    this.createCanvas();
    this.createpreloader();
    this.createNavigation();
    this.createPages();

    this.addLinkListeners();
    this.addEventListeners();
    this.onResize();

    this.update();
  }

  createpreloader() {
    this.preloader = new Preloader(this.canvas);
    this.preloader.once("completed", this.onPreloaded.bind(this));
  }
  createContent() {
    this.content = document.querySelector(".content");
    this.template = this.content.getAttribute("data-template");
  }
  createPages() {
    this.pages = {
      home: new Home(),
      about: new About(),
      collections: new Collections(),
      detail: new Detail(),
    };

    this.page = this.pages[this.template];
    this.page.create();
  }
  onPreloaded() {

    this.onResize();
    this.canvas.onPreloaded()

    this.page.show();
  }
  onPopState() {
    this.onChange({ url: window.location.pathname, push: false });
  }

  createNavigation() {
    this.navigation = new Navigation({
      template: this.template,
    });
  }

  createCanvas() {
    this.canvas = new Canvas({ template: this.template });
  }
  async onChange({ url, push = true }) {
    this.canvas.onChangeStart(this.template, url);
    await this.page.hide();

    const request = await window.fetch(url);

    if (request.status === 200) {
      const html = await request.text();
      const div = document.createElement("div");
      if (push) {
        window.history.pushState({}, "", url);
      }
      div.innerHTML = html;

      const divContent = div.querySelector(".content");

      this.template = divContent.getAttribute("data-template");

      this.navigation.onChange(this.template);
      this.content.setAttribute("data-template", this.template);
      this.background = divContent.getAttribute("data-background");
      this.content.innerHTML = divContent.innerHTML;
      this.canvas.onChangeEnd(this.template);

      this.page = this.pages[this.template];

      this.page.create();

      this.page.show();
      this.onResize();

      this.addLinkListeners();
    } else {
      console.log("error");
    }
  }

  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize();
    }
    window.requestAnimationFrame((_) => {
      if (this.canvas && this.canvas.onResize) {
        this.canvas.onResize();
      }
    });
  }

  onTouchDown(event) {
     this.isDown = true;
 this.y.start = event.touches ? event.touches[0].clientY : event.clientY;
    const normalizedWheel = NormalizeWheel(event);

    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(event);
    }

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown({y:this.y});
    }
  }

  onTouchMove(event) {
      if (!this.isDown) return;
    const y = event.touches ? event.touches[0].clientY : event.clientY;
  this.y.end = y;


    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(event);
    }
    if (this.page && this.page.onTouchMove) {
      this.page.onTouchMove({y:this.y});
    }
  }

  /**
   * @method onTouchUp
   * @description dispatch touch up event
   * @param {*} event
   */
  onTouchUp(event) {
     this.isDown = false;

      const y = event.changedTouches
      ? event.changedTouches[0].clientY
      : event.clientY;

      this.y.end = y;
    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(event);
    }
    if (this.page && this.page.onTouchUp) {

      this.page.onTouchUp({y: this.y,});
    }
  }

  onWheel(event) {
    const normalizedWheel = NormalizeWheel(event);

    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(normalizedWheel);
    }

    if (this.page && this.page.onWheel) {
      this.page.onWheel(normalizedWheel);
    }
  }

  /**
   * @method addLinkListeners
   * @description add link listeners
   * @param {*} links
   * @param {*} callback
   */
  addLinkListeners() {
    const links = document.querySelectorAll("a");

    each(links, (link) => {
      link.onclick = (event) => {
        event.preventDefault();
        const { href } = link;
        this.onChange({ url: href });
      };
    });
  }

  /**
   * @method update
   * @description update loop
   */
  update() {
    if (this.page && this.page.update) {
      this.page.update();
    }
    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.page.scroll);
    }

    this.frame = window.requestAnimationFrame(this.update.bind(this));
  }

  /** *
   * @method addEventListeners
   * @description add event listeners
   */
  addEventListeners() {
    const isTouchDevice = 'ontouchstart' in window;

    window.addEventListener("popstate", this.onPopState.bind(this));
    window.addEventListener("wheel", this.onWheel.bind(this));

    if (isTouchDevice) {
        window.addEventListener("touchstart", this.onTouchDown.bind(this));
        window.addEventListener("touchmove", this.onTouchMove.bind(this));
      window.addEventListener("touchend", this.onTouchUp.bind(this));

    } else {
        window.addEventListener("mousedown", this.onTouchDown.bind(this));
        window.addEventListener("mousemove", this.onTouchMove.bind(this));
        window.addEventListener("mouseup", this.onTouchUp.bind(this));
    }

    window.addEventListener("resize", this.onResize.bind(this));
  }
}

new App();
