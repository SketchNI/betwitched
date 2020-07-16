"use strict";

$('button#save').click(e => {
    e.preventDefault();
    let data = $("#streamer").val().trim().split("\n");
    let json = JSON.stringify({"streamers": data.filter(function(el) { return el; })});
    console.log(json);
    chrome.storage.sync.set({
        streamers: json
    })
});

function getStreamers() {
    chrome.storage.sync.get("streamers", function(streamers) {
        let s = JSON.parse(streamers.streamers).streamers
        if (s.length > 0) {
            let twitchers = s;
            for (let i = 0; i < twitchers.length; i++) {
                $("#streamer").append(twitchers[i] + "\n");
            }
        }
    });
    /*fetch(streamers_file).then((res) => {
        res.json().then((streamers) => {
            let twitchers = streamers.streamers;
            for(let i = 0; i < twitchers.length; i++) {
                $("#streamer").append(twitchers[i] + "\n");
            }
        });
    });*/
}

/* Execute for initial population of the list */
getStreamers();