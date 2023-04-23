import Page from "classes/page";

export default class Collections extends Page {
  constructor() {
    super({
      id: "collections",
      element: ".collections",
      elements: {
        hi: "lol",
      },
    });
  }
}
