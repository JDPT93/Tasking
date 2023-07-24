import * as React from "react";

export interface LocaleContext {
    actions: {
        [action: string]: string
    },
    application: {
        name: string
    },
    components: {
        [component: string]: {
            [label: string]: string
        }
    },
    enumerations: {
        [enumeration: string]: {
            singular: string,
            plural: string,
            constants: {
                [property: string]: string
            }
        }
    },
    schemas: {
        [schema: string]: {
            singular: string,
            plural: string,
            properties: {
                [property: string]: string
            }
        }
    }
}

const locale = require("../locales/es.json");

export default React.createContext<LocaleContext>(locale as LocaleContext);
