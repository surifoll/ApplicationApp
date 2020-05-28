import { inject } from "aurelia-dependency-injection";
import {
  ValidationControllerFactory,
  ValidationRules,
} from "aurelia-validation";
import { BootstrapFormRenderer } from "../../resources/bootstrap-form-renderer";
import { MakeAPICall } from "resources/network/http-post";
import { DialogService } from "aurelia-dialog";
import { Prompt } from "../common/prompt";
import { Router, RouterConfiguration } from "aurelia-router";

@inject(ValidationControllerFactory, DialogService, RouterConfiguration, Router)
export class ApplicaantForm {
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
  router = null;
  errors = [];
  constructor(controllerFactory, dialogService: DialogService, router) {
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.addRenderer(new BootstrapFormRenderer());
    this.dialogService = dialogService;
    this.router = router;
    ValidationRules.ensure((a: ApplicaantForm) => a.eMailAddress)
      .required()
      .email()
      .ensure((a) => a.name)
      .satisfies((x, obj) => x.length >= 5)
      .withMessage("Lenght of Name must be at least 5")
      .ensure((a) => a.familyName)
      .satisfies((x) => x.length >= 5)
      .withMessage("Lenght of Family Name must be at least 5")
      .ensure((a) => a.countryOfOrigin)
      .required()
      .ensure((a) => a.address)
      .required()
      .satisfies((x) => x.length >= 10)
      .withMessage("Lenght of Address must be at least 5")
      .ensure((a) => a.hired)
      .required()
      .ensure((a) => a.age)
      .satisfies((x) => x >= 20 && x <= 60)
      .withMessage("Age range is 20 and 60")
      .on(ApplicaantForm);
  }

  public message: string = "";

  refreshSignal() {
    if (
      this.name == "" &&
      this.address == "" &&
      this.age == 0 &&
      this.countryOfOrigin == "" &&
      this.eMailAddress == "" &&
      this.familyName == ""
    ) {
      this.disablingFlag = true;
    } else {
      this.disablingFlag = false;
    }

    if (
      this.name == "" ||
      this.address == "" ||
      this.age == 0 ||
      this.countryOfOrigin == "" ||
      this.eMailAddress == "" ||
      this.familyName == ""
    ) {
      this.formIsNotValid = true;
    } else {
      this.formIsNotValid = false;
    }
  }
  validateMe() {
    this.controller.validate().then(async (v) => {
      if (v.valid) {
        this.message = "All is good!";
        var payload = v.results[0].object;
        payload.age = parseInt(payload.age);
        var req = new MakeAPICall();
        var response = await req.post(
          "https://localhost:44393/api/Applicants",
          this.simpleStringify(payload)
        );
        if (response.id) {
          location.href = "http://localhost:8080/#/success";
        } else {
          let items = Object.entries(response.errors);
          items.map((item) => {
            let key = item[0];
            let value = item[1][0];
            this.errors = [];
            this.errors.push({ key, value });
          });

          this.dialogService.open({
            viewModel: Prompt,
            model: response.title,
            lock: false,
          });
        }
      } else this.message = "You have errors!";
    });
  }

  reset() {
    this.dialogService
      .open({
        viewModel: Prompt,
        model: "Are you sure you want to reset all data?",
        lock: false,
      })
      .whenClosed((response) => {
        if (!response.wasCancelled) {
          this.name = "";
          this.address = "";
          this.age = 0;
          this.countryOfOrigin = "";
          this.eMailAddress = "";
          this.hired = false;
          this.familyName = "";
          this.errors = [];
        }
        console.log(response.output);
      });
  }
  simpleStringify(object) {
    var simpleObject = {};
    for (var prop in object) {
      if (!object.hasOwnProperty(prop)) {
        continue;
      }
      if (typeof object[prop] == "object") {
        continue;
      }
      if (typeof object[prop] == "function") {
        continue;
      }
      simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
  }
}
