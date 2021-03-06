import {Socket} from "phoenix"
import NProgress from "nprogress"
import {LiveSocket} from "phoenix_live_view"
import * as d3 from "d3"
import "d3-graphviz"
window.d3 = d3

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}})

// Show progress bar on live navigation and form submits
window.addEventListener("phx:page-loading-start", info => NProgress.start())
window.addEventListener("phx:page-loading-stop", info => NProgress.done())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

fetch('/dot', {})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(text => {
    const graphEl = document.getElementById('graph');
    if (graphEl) {
      const graphviz = d3.select("#graph").graphviz()

      graphviz
        .transition(function() {
          return d3.transition()
                  .delay(100)
                  .duration(1000);
        })
        .renderDot(text)
    }
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });
