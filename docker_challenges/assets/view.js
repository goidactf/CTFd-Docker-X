CTFd._internal.challenge.data = undefined;

CTFd._internal.challenge.renderer = CTFd._internal.markdown;

CTFd._internal.challenge.preRender = function () {};

CTFd._internal.challenge.render = function (markdown) {
    return CTFd._internal.challenge.renderer.parse(markdown);
};

CTFd._internal.challenge.postRender = function () {
    const containername = CTFd._internal.challenge.data.docker_image;
    get_docker_status(containername);
    createWarningModalBody();
};

function createWarningModalBody() {
    // Creates the Warning Modal placeholder, that will be updated when stuff happens.
    if (CTFd.lib.$("#warningModalBody").length === 0) {
        CTFd.lib.$("body").append('<div id="warningModalBody"></div>');
    }
}

function get_docker_status(container) {
    // Use CTFd.fetch to call the API
    CTFd.fetch("/api/v1/docker_status")
        .then((response) => response.json())
        .then((result) => {
            const globe_svg =
                '<svg width="800px" height="800px" viewBox="0 0 73.768 73.768" xmlns="http://www.w3.org/2000/svg"><path id="Path_10" data-name="Path 10" d="M117.606,385.2a36.884,36.884,0,1,0,36.884,36.884A36.926,36.926,0,0,0,117.606,385.2Zm33.846,35.383H136.366a48.681,48.681,0,0,0-3.047-16.068,36.786,36.786,0,0,0,8.781-5.808A33.752,33.752,0,0,1,151.452,420.586Zm-32.346-31.072a36.534,36.534,0,0,1,6.069,6.387,39.467,39.467,0,0,1,4.176,7.028,33.843,33.843,0,0,1-10.245,2.061Zm3.534-.935a33.762,33.762,0,0,1,17.292,8.051,33.809,33.809,0,0,1-7.772,5.116A41.252,41.252,0,0,0,122.64,388.579ZM110.19,395.9a36.615,36.615,0,0,1,5.916-6.261v15.35a33.789,33.789,0,0,1-10.116-2.013A39.5,39.5,0,0,1,110.19,395.9Zm-7.013,5.906a33.8,33.8,0,0,1-7.9-5.177,33.757,33.757,0,0,1,17.469-8.074A41.244,41.244,0,0,0,103.177,401.807Zm12.929,6.183v12.6H102a45.607,45.607,0,0,1,2.835-14.838A36.83,36.83,0,0,0,116.106,407.99Zm0,15.6v12.386a36.8,36.8,0,0,0-11.018,2.146A42.373,42.373,0,0,1,102,423.587Zm0,15.386v15.252a47.106,47.106,0,0,1-9.792-13.361A33.819,33.819,0,0,1,116.106,438.973Zm-2.86,16.708a33.755,33.755,0,0,1-18.084-8.24,33.786,33.786,0,0,1,8.306-5.426A48.955,48.955,0,0,0,113.246,455.681Zm5.86-1.313v-15.4a33.8,33.8,0,0,1,9.922,1.94A47.081,47.081,0,0,1,119.106,454.368Zm12.762-12.294a33.846,33.846,0,0,1,8.182,5.367,33.759,33.759,0,0,1-17.909,8.217A48.888,48.888,0,0,0,131.868,442.074Zm-12.762-6.1V423.587h14.257a42.352,42.352,0,0,1-3.106,14.582A36.818,36.818,0,0,0,119.106,435.973Zm0-15.386v-12.6a36.806,36.806,0,0,0,11.4-2.291,45.562,45.562,0,0,1,2.854,14.888ZM93.112,398.711a36.8,36.8,0,0,0,8.91,5.871A48.7,48.7,0,0,0,99,420.587H83.76A33.757,33.757,0,0,1,93.112,398.711ZM83.76,423.587H99a45.675,45.675,0,0,0,3.256,15.683A36.807,36.807,0,0,0,93,445.35,33.755,33.755,0,0,1,83.76,423.587Zm58.447,21.764a36.8,36.8,0,0,0-9.122-6.022,45.69,45.69,0,0,0,3.279-15.742h15.088A33.759,33.759,0,0,1,142.207,445.351Z" transform="translate(-80.722 -385.203)" fill="#0c2c67"/></svg>';
            result.data.forEach((item) => {
                if (item.docker_image == container) {
                    // Split the ports and create the data string
                    var ports = String(item.ports).split(",");
                    var data = "";

                    ports.forEach((port) => {
                        port = String(port);
                        data =
                            data +
                            "Host: " +
                            item.host +
                            " Port: " +
                            port +
                            `, <a href='http://${item.host}:${item.port}/'>${globe_svg}</a><br />`;
                    });
                    // Update the DOM with the docker container information
                    CTFd.lib
                        .$("#docker_container")
                        .html(
                            "<pre>Docker Container Information:<br />" +
                                data +
                                '<div class="mt-2" id="' +
                                String(item.instance_id).substring(0, 10) +
                                '_revert_container"></div>'
                        );

                    // Update the DOM with connection info information.
                    // Note that connection info should contain "host" and "port"
                    var $link = CTFd.lib.$(".challenge-connection-info");
                    $link.html($link.html().replace(/host/gi, item.host));
                    $link.html(
                        $link
                            .html()
                            .replace(/port|\b\d{5}\b/gi, ports[0].split("/")[0])
                    );

                    // Check if there are links in there, if not and we use a http[s] address, make it a link
                    CTFd.lib.$(".challenge-connection-info").each(function () {
                        const $span = CTFd.lib.$(this);
                        const html = $span.html();

                        // Skip if already has a link
                        if (html.includes("<a")) {
                            return;
                        }

                        // If it contains "http", try to extract and wrap it
                        const urlMatch = html.match(/(http[s]?:\/\/[^\s<]+)/);

                        if (urlMatch) {
                            const url = urlMatch[0];
                            const linked = html.replace(
                                url,
                                `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
                            );
                            $span.html(linked);
                        }
                    });

                    // Set up the countdown timer
                    var countDownDate = new Date(
                        parseInt(item.revert_time) * 1000
                    ).getTime();
                    var x = setInterval(function () {
                        var now = new Date().getTime();
                        var distance = countDownDate - now;
                        var minutes = Math.floor(
                            (distance % (1000 * 60 * 60)) / (1000 * 60)
                        );
                        var seconds = Math.floor(
                            (distance % (1000 * 60)) / 1000
                        );
                        if (seconds < 10) {
                            seconds = "0" + seconds;
                        }

                        // Update the countdown display
                        CTFd.lib
                            .$(
                                "#" +
                                    String(item.instance_id).substring(0, 10) +
                                    "_revert_container"
                            )
                            .html(
                                "Stop or Revert Available in " +
                                    minutes +
                                    ":" +
                                    seconds
                            );

                        // Check if the countdown is finished and enable the revert button
                        if (distance < 0) {
                            clearInterval(x);
                            CTFd.lib
                                .$(
                                    "#" +
                                        String(item.instance_id).substring(
                                            0,
                                            10
                                        ) +
                                        "_revert_container"
                                )
                                .html(
                                    "<a onclick=\"start_container('" +
                                        item.docker_image +
                                        '\');" class="btn btn-dark">' +
                                        '<small style="color:white;"><i class="fas fa-redo"></i> Revert</small></a> ' +
                                        "<a onclick=\"stop_container('" +
                                        item.docker_image +
                                        '\');" class="btn btn-dark">' +
                                        '<small style="color:white;"><i class="fas fa-redo"></i> Stop</small></a>'
                                );
                        }
                    }, 1000);

                    return false; // Stop once the correct container is found
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching docker status:", error);
        });
    // Display the normal start button, if there is no need for updating
    const NormalStartButtonHTML = `
        <span>
            <a onclick="start_container('${CTFd._internal.challenge.data.docker_image}');" class='btn btn-dark'>
                <small style='color:white;'><i class="fas fa-play"></i>  Start Docker Instance for challenge</small>
            </a>
        </span>`;
    CTFd.lib.$("#docker_container").html(NormalStartButtonHTML);
}

function stop_container(container) {
    if (
        confirm(
            "Are you sure you want to stop the container for: \n" +
                CTFd._internal.challenge.data.name
        )
    ) {
        CTFd.fetch(
            "/api/v1/container?name=" +
                encodeURIComponent(container) +
                "&challenge=" +
                encodeURIComponent(CTFd._internal.challenge.data.name) +
                "&stopcontainer=True",
            {
                method: "GET",
            }
        )
            .then(function (response) {
                return response.json().then(function (json) {
                    if (response.ok) {
                        updateWarningModal({
                            title: "Attention!",
                            warningText:
                                "The Docker container for <br><strong>" +
                                CTFd._internal.challenge.data.name +
                                "</strong><br> was stopped successfully.",
                            buttonText: "Close",
                            onClose: function () {
                                get_docker_status(container); // ← Will be called when modal is closed
                            },
                        });
                    } else {
                        throw new Error(
                            json.message || "Failed to stop container"
                        );
                    }
                });
            })
            .catch(function (error) {
                updateWarningModal({
                    title: "Error",
                    warningText:
                        error.message ||
                        "An unknown error occurred while stopping the container.",
                    buttonText: "Close",
                    onClose: function () {
                        get_docker_status(container); // ← Will be called when modal is closed
                    },
                });
            });
    }
}

function start_container(container) {
    CTFd.lib
        .$("#docker_container")
        .html(
            '<div class="text-center"><i class="fas fa-circle-notch fa-spin fa-1x"></i></div>'
        );
    CTFd.fetch(
        "/api/v1/container?name=" +
            encodeURIComponent(container) +
            "&challenge=" +
            encodeURIComponent(CTFd._internal.challenge.data.name),
        {
            method: "GET",
        }
    )
        .then(function (response) {
            return response.json().then(function (json) {
                if (response.ok) {
                    get_docker_status(container);

                    updateWarningModal({
                        title: "Attention!",
                        warningText:
                            "A Docker container is started for you.<br>Note that you can only revert or stop a container once per 3 minutes!",
                        buttonText: "Got it!",
                    });
                } else {
                    throw new Error(
                        json.message || "Failed to start container"
                    );
                }
            });
        })
        .catch(function (error) {
            // Handle error and notify the user
            updateWarningModal({
                title: "Error!",
                warningText:
                    error.message ||
                    "An unknown error occurred when starting your Docker container.",
                buttonText: "Got it!",
                onClose: function () {
                    get_docker_status(container); // ← Will be called when modal is closed
                },
            });
        });
}

// WE NEED TO CREATE THE MODAL FIRST, and this should be only used to fill it.

function updateWarningModal({ title, warningText, buttonText, onClose } = {}) {
    const background_color =
        document.getElementsByClassName("fa-moon1").length == 1
            ? "#212529"
            : "#dee2e6";
    const border_color =
        document.getElementsByClassName("fa-moon1").length == 1
            ? "#888"
            : "#dee2e6";
    const modalHTML = `
        <div id="warningModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; z-index:9999; background-color:rgba(0,0,0,0.5);">
          <div style="position:relative; margin:10% auto; width:400px; background:white; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.3); overflow:hidden;">
            <div class="modal-header bg-warning text-dark" style="padding:1rem; display:flex; justify-content:space-between; align-items:center;">
              <h5 class="modal-title" style="margin:0;">${title}</h5>
              <button type="button" id="warningCloseBtn" style="border:none; background:none; font-size:1.5rem; line-height:1; cursor:pointer;">&times;</button>
            </div>
            <div class="modal-body" style="padding:1rem; background-color:${background_color};">
              ${warningText}
            </div>
            <div class="modal-footer" style="padding:1rem; text-align:right; border-top:1px solid ${border_color}; background-color:${background_color};">
              <button type="button" class="btn btn-secondary" id="warningOkBtn">${buttonText}</button>
            </div>
          </div>
        </div>
    `;
    CTFd.lib.$("#warningModalBody").html(modalHTML);

    // Show the modal
    CTFd.lib.$("#warningModal").show();

    // Close logic with callback
    const closeModal = () => {
        CTFd.lib.$("#warningModal").hide();
        if (typeof onClose === "function") {
            onClose();
        }
    };

    CTFd.lib.$("#warningCloseBtn").on("click", closeModal);
    CTFd.lib.$("#warningOkBtn").on("click", closeModal);
}

// In order to capture the flag submission, and remove the "Revert" and "Stop" buttons after solving a challenge
// We need to hook that call, and do this manually.
function checkForCorrectFlag() {
    const challengeWindow = document.querySelector("#challenge-window");
    if (
        !challengeWindow ||
        getComputedStyle(challengeWindow).display === "none"
    ) {
        // console.log("❌ Challenge window hidden or closed, stopping check.");
        clearInterval(checkInterval);
        checkInterval = null;
        return;
    }

    const notification = document.querySelector(".notification-row .alert");
    if (!notification) return;

    const strong = notification.querySelector("strong");
    if (!strong) return;

    const message = strong.textContent.trim();

    if (message.includes("Correct")) {
        // console.log("✅ Correct flag detected:", message);
        get_docker_status(CTFd._internal.challenge.data.docker_image);
        clearInterval(checkInterval);
        checkInterval = null;
    }
}

if (!checkInterval) {
    var checkInterval = setInterval(checkForCorrectFlag, 1500);
}
