import { Aurelia } from "aurelia-framework";
import * as environment from "../config/environment.json";
import { PLATFORM } from "aurelia-pal";
import { I18N, TCustomAttribute } from "aurelia-i18n"; // <------------ 1
import Backend from "i18next-xhr-backend"; // <------------ 2

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName("resources/index"))
    .developmentLogging()
    .plugin(PLATFORM.moduleName("aurelia-validation"))
    .plugin(PLATFORM.moduleName("aurelia-dialog"))
    .plugin(PLATFORM.moduleName("aurelia-i18n"), (instance) => {
      // <------------ 3
      let aliases = ["t", "i18n"]; // <------------ 4
      TCustomAttribute.configureAliases(aliases);
      instance.i18next.use(Backend); // <------------ 5
      return instance.setup({
        fallbackLng: "de", // <------------ 6
        whitelist: ["en", "de"],
        preload: ["en", "ru"], // <------------ 7
        ns: "global", // <------------ 8
        defaultNS: "global",
        fallbackNS: false,
        attributes: aliases, // <------------ 9
        lng: "en", // <------------ 10
        debug: true, // <------------ 11
        backend: {
          loadPath: "./locales/{{lng}}/{{ns}}.json", // <------------ 12
        },
      });
    });

  aurelia.use.developmentLogging(environment.debug ? "debug" : "warn");

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName("aurelia-testing"));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName("app")));
}
