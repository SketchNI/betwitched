// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

chrome.runtime.onInstalled.addListener(function () {
    console.debug("Extension installed.");
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {hostEquals: "www.twitch.tv"},
                    }),
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()],
            },
        ]);
    });
});

chrome.webNavigation.onCompleted.addListener(() => {
    chrome.storage.sync.get("streamers", function(streamers) {
        let s = JSON.parse(streamers.streamers).streamers
        if (s.length > 0) {
            let twitchers = s;
            for (let i = 0; i < twitchers.length; i++) {
                /* Gosh damn, this was a piece of work.
                 * So, I was using *${twitchers[i]}* to do the comparison
                 * but that is case-sensitive and even calling .toLowerCase()
                 * wasn't making a match because we had already grabbed the
                 * name which could be upper/lower/mixed-case.
                 *
                 * 3 f#@king hours later, I ask myself "why not just grab any
                 * twitch URL and do the match later?"
                 *
                 * Shut up, me.
                 */
                chrome.tabs.query({url: `https://www.twitch.tv/*`}, function (tab) {
                    for (let j = 0; j < tab.length; j++) {
                        /* Does the tabs URL match a badlisted person? */
                        if (tab[j].url.toLowerCase().indexOf('?') !== -1) {
                            let url = tab[j].url.toLowerCase().split('?');
                            if (url[0] === `https://www.twitch.tv/${twitchers[i]}`.toLowerCase()) {
                                /* "YEET THE TAB" - Sketch, when writing this comment. */
                                chrome.tabs.remove(tab[j].id);
                            }
                        } else {
                            if (tab[j].url.toLowerCase() === `https://www.twitch.tv/${twitchers[i]}`.toLowerCase()) {
                                /* "YEET THE TAB" - Sketch, when writing this comment. */
                                chrome.tabs.remove(tab[j].id);
                            }
                        }
                    }
                });
            }
        }
    });
});
