import "babel-polyfill"
import { PLATFORM } from "aurelia-pal"
import * as Bluebird from "bluebird"
import { AureliaConfiguration } from "aurelia-configuration"
import "./scss/main.scss"

Bluebird.config({ warnings: false })

function configConfigurationPlugin(config) {
    config.setEnvironments({
        development: ["localhost"],
        production: ["busynest.org"],
    })
}

export async function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .plugin(PLATFORM.moduleName("aurelia-configuration"), configConfigurationPlugin)
        .plugin(PLATFORM.moduleName("aurelia-validation"))
        .plugin(PLATFORM.moduleName("plugins/http-client/index"))
        .feature(PLATFORM.moduleName("resources/index"))

    if (process.env.NODE_ENV !== "production") {
        aurelia.use.developmentLogging()
    }

    if (process.env.NODE_ENV === "production") {
        aurelia.use.plugin(PLATFORM.moduleName("aurelia-google-analytics"), (config) => {
            const configInstance = aurelia.container.get(AureliaConfiguration)
            config.init(configInstance.get("googleAnalytics.trackingId"))
            config.attach(configInstance.get("googleAnalytics.config"))
        })
    }

    await aurelia.start()
    await aurelia.setRoot(PLATFORM.moduleName("app"))
}
