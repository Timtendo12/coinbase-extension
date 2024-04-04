const span_id = "accounts_portfolio_chart_balance";
let divTotalBalance = null;
let hidden = false;
let innerHTMLBackup = null;
let hideButton = null;

// get span with data attribute "data-synthetic-id" equal to "accounts_portfolio_chart_balance"
waitForElm(`span[data-synthetic-id="${span_id}"]`).then((elm) => {
    divTotalBalance = elm.children[0].children[0];
});

waitForElm(`button[type=button]:has(span.cds-positionRelative-pagbhaq)`).then((elm) => {
    addHideButton(elm);
})

function addHideButton(btnToClone) {
    try {
        hideButton = btnToClone.cloneNode(true);
        hideButton.style.marginRight = "10px";
        hideButton.children[0].children[0].children[0].innerText = "Hide Total";

        // get div with data-test-id="topRight"
        const btnParent = document.querySelector(`div.cds-3-_1ol1258`);

        //append hidebutton as second child
        btnParent.insertBefore(hideButton, btnToClone);

        // remove click event listener
        hideButton.removeEventListener("click", null);

        // add click event listener to hide total
        hideButton.addEventListener("click", ToggleTotal);
    } catch (e) {
        console.error(e)
    }
}

function ToggleTotal() {
    let hidden = localStorage.getItem("hideTotal") ?? false;

    if (!hidden) {
        innerHTMLBackup = divTotalBalance.innerHTML;
        divTotalBalance.innerHTML = "<p>Hidden</p>";
        hideButton.children[0].children[0].children[0].innerText = "Show Total";
        localStorage.setItem("hideTotal", "1");
    } else {
        divTotalBalance.innerHTML = innerHTMLBackup;
        hideButton.children[0].children[0].children[0].innerText = "Hide Total";
        localStorage.removeItem("hideTotal");
    }
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}