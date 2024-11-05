import {is, assert, props, create} from "./lib/core.mjs";
import GUI from './lib/gui.mjs';

const default_config = {
    backgroundColor: "#eee",
    textColor:       "#000",
    borderColor:     "#ccc",
    gridGap:         "8px",
    minWidth:        "200px"
};

export default class RequestLog extends GUI {

    constructor(parentElem, config = {}) {

        props.integrate(config, default_config);
        super(parentElem, config);

        this.style({
            "":               {
                "background-color":      config.backgroundColor,
                "color":                 config.textColor,
                "overflow-y":            "auto",
                "display":               "grid",
                "grid-gap":              config.gridGap,
                "grid-template-columns": "100%",
                "align-content":         "start",
                "overflow-wrap":         "break-word"
            },
            "> *":            {
                "min-width": config.minWidth,
                "margin":    "0 " + config.gridGap
            },
            "> *:last-child": {
                "margin-bottom": config.gridGap + " !important"
            },
            "> .request-log": {}
        });

    }

    reset() {
        this.container.innerHTML = "";
        this.data.emit("reset");
        return this;
    }

    /**
     * @param {{
     *     timestamp?: string,
     *     method: string,
     *     url: string,
     *     httpVersion?: string,
     *     headers?: Record<string, string | string[]>
     *     body?: string | null
     * }} request
     * @returns {this}
     */
    addRequest(request) {
        const logEntry = create.htmlElement('div', null, 'request-log');
        // TODO
        console.log(request);
        return this
    }

}
