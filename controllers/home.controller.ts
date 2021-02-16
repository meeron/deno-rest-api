import { Controller } from "./controller.ts";

class HomeController extends Controller {

  constructor() {
    super();

    this.mapGet("/", this.index);
  }

  index() {
    this.ok({ version: "0.1.0" });
  }
}

const home = new HomeController();

export default home;
