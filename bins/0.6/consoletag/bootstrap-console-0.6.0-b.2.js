/*
More or less ...

if fwdid: redirect back to Web with all params except fwdid + add fwdidsuccess=fwdid value
change the url to point to /inventory/location (history.replaceState(...))
else import(app) inventory
*/

// const webDomain = "192.168.10.51";
// const webPort = ":8080"; // ""
// const webProtocol = "http";
const webDomain = "tag.spoolease.io";
const webPort="";
const webProtocol = "https";

// Parse URL parameters
function getUrlParams() {
  const url = window.location.href;
  const params = {};

  const questionIndex = url.indexOf("?");
  const hashIndex = url.indexOf("#");

  if (questionIndex !== -1) {
    const end = hashIndex !== -1 ? hashIndex : url.length;
    const qString = url.substring(questionIndex + 1, end);
    qString.split("&").forEach((pair) => {
      if (pair) {
        const [key, value] = pair.split("=");
        if (key) {
          params[key] = decodeURIComponent(value || "");
        }
      }
    });
  }

  if (hashIndex !== -1) {
    const hString = url.substring(hashIndex + 1);
    hString.split("&").forEach((pair) => {
      if (pair) {
        const [key, value] = pair.split("=");
        if (key) {
          params[key] = decodeURIComponent(value || "");
        }
      }
    });
  }

  return params;
}

(async () => {
  let params = getUrlParams();

  const fwdid = params["fwdid"];

  if (fwdid) {
    params["fwdidsuccess"] = fwdid;
    delete params["fwdid"];
    const path = window.location.pathname;
    const url = new URL(`${webProtocol}://${webDomain}${webPort}${path}`);
    url.hash = new URLSearchParams(params).toString();
    const newUrl = url.toString();
    window.location.href = newUrl;
  } else {
    console.log("Loading App");

    // Now load app
    /*await if want to wait and do something after app loads */
    const ver2 = new URL(import.meta.url).searchParams.get("ver2");
    const ver = new URL(import.meta.url).searchParams.get("ver");

    // dynamically load icon
    const iconLink = document.createElement("link");
    iconLink.rel = "icon";
    iconLink.type = "image/png";
    iconLink.sizes = "48x48";
    iconLink.href =
      "https://bin.spoolease.io/bins/0.5/inventory/favicon-48x48.png";
    document.head.appendChild(iconLink);

    // dynamically load stylesheet
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href =
      "https://bin.spoolease.io/bins/${ver2}/consoletag/style-${ver}.css";
    cssLink.crossOrigin = "anonymous";
    document.head.appendChild(cssLink);


    import(`https://bin.spoolease.io/bins/${ver2}/consoletag/consoletag-${ver}.js`);
  }
})();

/* Test localy
http://192.168.10.51:8080/L1/?TG=TEST
*/
