async function fetchReferenceMatches() {
    const matchesUrl = "/reference" + window.location.pathname + "/matches";
    const response = await fetch(matchesUrl);
    const json = await response.json();
    Object.entries(json).sort().reverse().forEach(([matcher, matches]) => {
        const template = document.querySelector("#js-" + matcher + "-link");

        Object.entries(matches).forEach(([doi, links]) => {
            const referenceElement = document.querySelector(".refbody[data-doi='" + doi + "'] .js-references");
            if (template !== null && referenceElement !== null) {
                links.forEach(link => {
                    const element = template.content.cloneNode(true).querySelector("a");
                    element.setAttribute("href", link);
                    referenceElement.prepend(element, ' ');
                });
            }
        });
    });
}

function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(fetchReferenceMatches);
