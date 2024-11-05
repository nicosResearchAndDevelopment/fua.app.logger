import {is, assert, props, create} from "./lib/core.mjs";
import GUI from './lib/gui.mjs';

const default_config = {
    backgroundColor: "#eee",
    textColor:       "#555",
    borderColor:     "#aaa",
    gridGap:         "8px",
    fontSize:        "14px",
    minWidth:        "200px",
    urlColor:        "#a00",
    versionColor:    "#0aa",
    timestampColor:  "#aaa",
    maxEntries:      100
};

const timestampFormat = new Intl.DateTimeFormat(undefined, {
    year:                   'numeric',
    month:                  '2-digit',
    day:                    '2-digit',
    hour:                   '2-digit',
    hour12:                 false,
    minute:                 '2-digit',
    second:                 '2-digit',
    fractionalSecondDigits: 3,
    timeZoneName:           'longOffset'
});

export default class RequestLog extends GUI {

    constructor(parentElem, config = {}) {

        props.integrate(config, default_config);
        super(parentElem, config);

        this.style({
            "":                               {
                "background-color":      config.backgroundColor,
                "color":                 config.textColor,
                "overflow-y":            "auto",
                "display":               "grid",
                "grid-gap":              config.gridGap,
                "padding":               config.gridGap,
                "grid-template-columns": "100%",
                "align-content":         "start",
                "overflow-wrap":         "break-word",
                "font-family":           "monospace",
                "font-size":             config.fontSize,
                "line-height":           "1.3em"
            },
            "> .request-log":                 {
                "padding": config.gridGap,
                "border":  "1px solid " + config.borderColor
            },
            "> .request-log .timestamp":      {
                "color":         config.timestampColor,
                "margin-bottom": ".3em"
            },
            "> .request-log .title":          {
                "margin-bottom": ".3em"
            },
            "> .request-log .title .method":  {
                "font-weight": "bold"
            },
            "> .request-log .title .url":     {
                "color": config.urlColor
            },
            "> .request-log .title .version": {
                "color": config.versionColor
            },
            "> .request-log .header":         {
                "white-space": "bold"
            },
            "> .request-log .header .name":   {
                "font-weight": "bold"
            },
            "> .request-log .body":           {
                "margin-top":    "1em"
            }
        });

        this.data.entries = [];

    }

    reset() {
        this.data.entries        = [];
        this.container.innerHTML = "";
        this.data.emit("reset");
        return this;
    }

    /**
     * @param {{
     *     timestamp: string,
     *     version: string,
     *     method: string,
     *     url: string,
     *     headers: Record<string, string | string[]>
     *     body: string | null
     * }} request
     * @returns {this}
     */
    addRequest(request) {
        const logEntry = create.htmlElement('div', null, 'request-log');

        const entryTimestamp     = logEntry.appendChild(create.htmlElement('div', null, 'timestamp'));
        entryTimestamp.innerText = timestampFormat.format(new Date(request.timestamp))

        const entryTitle = logEntry.appendChild(create.htmlElement('div', null, 'title'));

        const entryMethod     = entryTitle.appendChild(create.htmlElement('span', null, 'method'));
        entryMethod.innerText = request.method.toUpperCase();

        entryTitle.append(" ");

        const entryUrl     = entryTitle.appendChild(create.htmlElement('span', null, 'url'));
        entryUrl.innerText = request.url;

        entryTitle.append(" ");

        const entryVersion     = entryTitle.appendChild(create.htmlElement('span', null, 'version'));
        entryVersion.innerText = 'HTTP/' + request.version;

        for (let name of Object.keys(request.headers).sort()) {
            for (let value of Array.isArray(request.headers[name]) ? request.headers[name] : [request.headers[name]]) {
                const entryHeader = logEntry.appendChild(create.htmlElement('div', null, 'header'));

                const entryHeaderName     = entryHeader.appendChild(create.htmlElement('span', null, 'name'));
                entryHeaderName.innerText = name.replace(/\b\w/g, val => val.toUpperCase());

                entryHeader.append(": ");

                const entryHeaderValue     = entryHeader.appendChild(create.htmlElement('span', null, 'value'));
                entryHeaderValue.innerText = value;
            }
        }

        if (is.string(request.body)) {
            const entryBody     = logEntry.appendChild(create.htmlElement('div', null, 'body'));
            entryBody.innerText = request.body;
        }

        this.container.prepend(logEntry);
        this.data.entries.push(logEntry);
        if (this.data.entries.length > this.config.maxEntries) {
            const firstEntry = this.data.entries.shift();
            this.container.remove(firstEntry);
        }

        return this
    }

}
