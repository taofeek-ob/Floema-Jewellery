import Page from "classes/page";

export default class About extends Page {
  constructor() {
    super({
      id: "about",
      element: ".about",
      elements: {
        wrapper: ".about__wrapper",
        navigation: document.querySelector(".navigation"),
        title: ".about__title",
      },
    });
  }
}
