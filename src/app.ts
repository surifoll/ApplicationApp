import { inject } from "aurelia-dependency-injection";
import {
  ValidationControllerFactory,
  ValidationController,
  ValidationRules,
  validateTrigger,
} from "aurelia-validation";
import { BootstrapFormRenderer } from "./resources/bootstrap-form-renderer";
import { MakeAPICall } from "resources/network/http-post";
import { DialogService } from "aurelia-dialog";
import { computedFrom, NewInstance } from "aurelia-framework";
import { Prompt } from "./components/common/prompt";
import { PLATFORM } from "aurelia-pal";
import {
  Router,
  RouterConfiguration,
  RouteConfig,
  NavModel,
} from "aurelia-router";

@inject(ValidationControllerFactory, DialogService, RouterConfiguration, Router)
export class App {
  name = "";
  familyName = "";
  address = "";
  countryOfOrigin = "";
  eMailAddress = "";
  age = 0;
  hired = false;
  controller = null;
  dialogService = null;
  disablingFlag = true;
  formIsNotValid = true;
  router: Router;
  configureRouter(config: RouterConfiguration, router: Router) {
    debugger;
    this.router = router;
    config.title = "Aurelia Router Demo";
    config.map([
      {
        route: ["", "home"],
        name: "home",
        moduleId: PLATFORM.moduleName("components/forms/applicant-form"),
        nav: true,
        title: "Home",
      },
      {
        route: "success",
        name: "success",
        moduleId: PLATFORM.moduleName("components/success/success"),
        nav: true,
        title: "success",
      },
    ]);
  }
}
