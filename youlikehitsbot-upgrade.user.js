// ==UserScript==
// @name         YouLikeHits Bot Upgrade
// @namespace    https://github.com/tapirintheshell/youlikehitsbot-upgrade
// @version      0.5.1t
// @description  Interacts with YLH automatically whereever possible.
// @author       gekkedev
// @updateURL    https://github.com/tapirintheshell/youlikehitsbot-upgrade
// @downloadURL  https://github.com/tapirintheshell/youlikehitsbot-upgrade
// @match        *://*.youlikehits.com/*
// @match        https://www.youtube.com/watch*
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://cdn.jsdelivr.net/gh/naptha/tesseract.js/dist/tesseract.min.js
// @run-at       document-end
// ==/UserScript==

(() => {
    
    const J = jQuery.noConflict(true);
    const globalInterval = 2000;

    // Yeni eklenen global değişkenler
    let windowList = []; // Tüm açılan pencereleri sakla



    'use strict';


    if (window.location.hostname.indexOf("youtube.com") !== -1) {
        function initAutoClose() {
            // Öncelikle video bilgilerini GM.getValue ile alıyoruz.
            GM.getValue("currentVideoInfo", null)
                .then(data => {
                let timeout_ms;
                if (data) {
                    let videoInfo = JSON.parse(data);
                    console.log("Get video data:", videoInfo);
                    // videoInfo.duration saniye cinsinden geliyor varsayalım ( + 10 ile, tedbir için 10 saniye ek fazladan süre veriyoruz)
                    timeout_ms = (parseInt(videoInfo.duration, 10) + 10) * 1000;
                } else {
                    console.log("Video data not found. Set default timeout.");
                    timeout_ms = 15 * 60 * 1000; // Varsayılan 15 dakika
                }
                console.log("Auto-close timeout (ms): " + timeout_ms);
                let endTime = Date.now() + timeout_ms;

                // Ekranın sağ alt köşesine, geri sayımı gösterecek bir div oluşturuyoruz
                let countdownDiv = document.createElement('div');
                countdownDiv.id = "autoCloseCountdownDiv";
                countdownDiv.style.position = 'fixed';
                countdownDiv.style.top = '100px';
                countdownDiv.style.right = '20px';
                countdownDiv.style.backgroundColor = 'rgba(255,0,0,0.7)';
                countdownDiv.style.color = '#fff';
                countdownDiv.style.padding = '30px 30px';
                countdownDiv.style.fontSize = '20px';
                countdownDiv.style.zIndex = 9999;
                countdownDiv.style.borderRadius = '4px';
                countdownDiv.style.boxShadow = '0 0 8px rgba(0,0,0,0.5)';
                countdownDiv.innerHTML = "Loading...<br><br><br>";
                document.body.appendChild(countdownDiv);

                // Güncelleme fonksiyonu: Her saniye kalan süreyi hesaplayıp ekrana yazar
                let intervalId = setInterval(function() {
                    let remaining = endTime - Date.now();
                    console.log("Update: remaining ms = " + remaining);
                    if (remaining <= 0) {
                        clearInterval(intervalId);
                        countdownDiv.innerHTML = "Kapanıyor...";
                        console.log("Süre doldu, pencere kapanıyor.");
                        window.close();
                    } else {
                        let totalSec = Math.floor(remaining / 1000);
                        let m = Math.floor(totalSec / 60);
                        let s = totalSec % 60;
                        countdownDiv.innerHTML = "Window closed in " + m + " minute " + (s < 10 ? "0" : "") + s + " seconds sonra kapanacak.";
                    }
                }, 1000);

                console.log("Auto-close timer started.");
            })
                .catch(err => {
                console.error("Data read error:", err);
            });
        }

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            initAutoClose();
        } else {
            document.addEventListener('DOMContentLoaded', initAutoClose);
        }
    }




    // Bu fonksiyon, followbutton linkinin onclick attribute’sundan video bilgilerini yakalar.
    function captureVideoInfo() {
        // Eğer followbutton varsa
        if (J(".followbutton").length) {
            let followBtn = J(".followbutton").first();
            let onclickAttr = followBtn.attr("onclick");
            if (onclickAttr) {
                // Örnek onclick: imageWin(3919260,'XtWPIKr9ATo','45','7d581c02541d3765b63b8d204e4abdd95f9c1cdf3614cf1c3b9485b68a9bd814');
                let match = onclickAttr.match(/imageWin\((\d+),\s*'([^']+)',\s*'(\d+)'/);
                if (match && match.length >= 4) {
                    let videoId = match[1]; // Örn: "3919260"
                    let duration = parseInt(match[3], 10); // Örn: 45 saniye
                    let videoInfo = {
                        videoId: videoId,
                        duration: duration, // Toplam video süresi
                        capturedAt: Date.now() // Bilginin yakalandığı zaman (timestamp)
                    };
                    //localStorage.setItem("currentVideoInfo", JSON.stringify(videoInfo));
                    //console.log("Video bilgileri yakalandı ve localStorage'a yazıldı:", videoInfo);
                    // Video bilgilerini saklamak (asenkron API)
                    GM.setValue("currentVideoInfo", JSON.stringify(videoInfo))
                        .then(() => {
                        console.log("Video data set.");
                    })
                        .catch(err => {
                        console.error("Video data set error:", err);
                    });

                    console.log("Video data set and write to GM_setValue:", videoInfo);
                } else {
                    console.log("Onclick attribute dont catch:", onclickAttr);
                }
            }
        }
    }







    solveCaptcha = (imageEl, outputEl, captchaIdentifier, callback = () => {}) => {
        if (window[captchaIdentifier] == undefined) {
            window[captchaIdentifier] = true; //solving takes some time, so we'll lock a duplicate solver instance out
            let note = attachNotification(imageEl, "Please wait while your captcha is being solved. Don't worry if the code does not seem to match; that's because a new captcha image has been generated!");
            Tesseract.recognize(J(imageEl).attr("src")).then(equation => {
                var formula = equation.text;
                if (formula.length = 3) {//the exact length of the fomula
                    if (formula.substr(1, 1) == 7) { //2-1 gets recognized as 271
                        formula = formula.substr(0, 1) + "-" + formula.substr(2);
                    }
                    formula = formula.replace(/x/g, "*"); //x is just the human version of *
                    formula = formula.replace(/[} ]/g, ""); //a random char being the result of misinterpretation; occasionally happening on the login form
                    //console.log(formula); //re-enable this to debug how the captchasolving is doing so far
                    outputEl.val(eval(formula));
                    window[captchaIdentifier] = false; //not really necessary IF directly triggering a classic non-ajax post request
                    removeNotification(note);
                    callback()
                }
            });
        }
    }

    const attachNotification = (identifier, notification) => {
        //IDEA: turn it into a nice(r) GUI with an ID to check more efficiently for duplicates
        const el = "<p style='color: red;'>Bot says: <i>" + notification + "</i></p>";
        const prevEl = J(identifier).prev()[0];
        if (prevEl == undefined || !prevEl.innerText.includes(notification))
           return J(el).insertBefore(identifier);
    }

    const removeNotification = (el) => {
        if (el != undefined)
            el.remove()
    }

    /** input seconds, receive milliseconds */
    const randomSeconds = (from, to) => {
        return Math.floor(Math.random() * (to - from + 1) + from) * 1000
    }

    const alertOnce = (message, identifier) => {
        localIdentifier = (identifier != undefined) ? identifier : message;
        if (shownWarnings.indexOf(localIdentifier) == -1) {
            shownWarnings.push(localIdentifier);
            alert(message)
        }
    }

    //runtime vars
    let previousVideo = "";
    /** indicates if a warning/message has already been shown. Happens once per window. Use alertOnce() */
    let shownWarnings = [];

    //loop over the website to find out which subpage we are on and take the appropriate actions IDEA: refactor the loop into a singleton
    const mainLoop = setInterval(() => {
        if (J("*:contains('503 Service Unavailable')").length) {
            console.log("Server Error! reloading...");
            location.reload();
        } else if (J("*:contains('not logged in!')").length) {
            window.location.href = "login.php"
        } else if (J("*:contains('Failed. You did not successfully solve the problem.')").length) {
            J("a:contains('Try Again')")[0].click()
        } else {
                switch (document.location.pathname) {
                    case "/login.php":
                        if (!J("#password").val().length) attachNotification("#username", "Consider storing your login data in your browser.")
                        const captcha = J("img[alt='Enter The Numbers']");
                        if (captcha.length)
                            solveCaptcha(captcha[0], J("input[name='postcaptcha']"), "ylh_login_captchasolving");
                        break;
                    case "/bonuspoints.php":
                        if (J("body:contains('You have made ')").length && J("body:contains(' Hits out of ')").length) {
                            const reloadDelay = randomSeconds(60, 60 * 5);
                            attachNotification(".maintable", "Not enough points. Reloading the website in " + Math.round(reloadDelay / 1000 / 60) + " minutes to check again...");
                            setTimeout(() => location.reload(), reloadDelay);
                            clearInterval(mainLoop); //no further checks since we gotta reload anyway
                        } else if (J(".buybutton").length) J(".buybutton")[0].click()
                        break;
                    case "/soundcloudplays.php":
                         //no timer visible / no song currently playing?
                        if (!J(".maintable span[id*='count']").attr("style").includes("display:none;")) return attachNotification(".maintable", "Music already playing..."); //TODO: detect timers that do not update
                        if (J(".followbutton").length) {
                            J(".followbutton").first().click();
                        } else alert("no followbutton, fix this pls");

                        break;



                    // ******************************************
                    // ******************************************


case "/youtubenew2.php":
	if (J('body:contains("failed")').length) location.reload(); //captcha failed?
	if (J(".followbutton").length) { //if false, there is likely a captcha waiting to be solved
		let vidID = () => { return J(".followbutton").first().parent().children("span[id*='count']").attr("id") };
		let patienceKiller = (prev) => { setTimeout( () => { if (vidID() == prev) { J(".followbutton").parent().children("a:contains('Skip')").click(); newWin.close(); }}, 1000 * 135)}; //max time: 120s + 15s grace time (max length: http://prntscr.com/q4o75o)
		//console.log(previousVideo + " " + vidID() + (previousVideo != vidID() ? " true": " false"));
		if (vidID() != previousVideo) { //has a new video has been provided yet? This will overcome slow network connections causing the same video to be played over and over
			previousVideo = vidID();

             captureVideoInfo(); // <--- Burada video bilgileri localStorage'a yazılır.

			if (window.eval("typeof(window.newWin) !== 'undefined'")) {
				if (newWin.closed) {
					console.log("if (newWin.closed) Watching one Video!");
					J(".followbutton")[0].click();
					patienceKiller(previousVideo)
				}
			} else {
				console.log("else Watching one Video!");
				J(".followbutton")[0].click();
				patienceKiller(previousVideo)
			}
		} //else do nothing and wait (until the video gets replaced or our patience thread tears)
	} else {
		captcha = J("img[src*='captchayt']");
		if (captcha.length) //captcha? no problemo, amigo.
			solveCaptcha(captcha[0], J("input[name='answer']"), "ylh_yt_traffic_captchasolving", () => J("input[value='Submit']").first().click());
	}
	break;









                        // ******************************************
                        // ******************************************


                }
            GM.getValue("ylh_traffic_tab_open", false).then(state => {
                switch (document.location.pathname) {
                    case "/websites.php":
                        if (J("*:contains('There are no Websites currently visitable for Points')").length) {
                            alertOnce("All websites were visited. Revisit/reload the page to start surfing again.")
                        } else {
                            if (!state && window.eval("typeof(window.childWindow) !== 'undefined'")) {
                                if (!childWindow.closed)
                                    childWindow.close();
                            } else if (state && window.eval("typeof(window.childWindow) == 'undefined'")) {
                                console.log("no child window is actually open. let's create a new tab as if we came here for the very first time!");
                                state = false;
                            }
                            var buttons = J(".followbutton:visible");
                            if (buttons.length) {
                                if (!state) {
                                    console.log("setting the tabstate to true...");
                                    GM.setValue('ylh_traffic_tab_open', true).then(() => {
                                        console.log("Visiting a new page...");
                                        buttons[0].onclick();
                                    });
                                } else {
                                }
                            } else {
                                console.log("We ran out of buttons! requesting more...");
                                //GM.getValue("ylh_traffic_reloadlimit", false).then(rlimit => {
                                if (window.eval("typeof(window.childWindow) !== 'undefined'") && childWindow.closed) //without this we would not wait for the last link of the page to be visited successfully
                                    location.reload();
                                //J("a[title='Refresh']")[0].click();
                            }
                        }
                        break;
                    case "/viewwebsite.php":
                        if (!J("*:contains('been logged out of YouLikeHits')").length) {
                            if (
                              J(".alert:visible:contains('You got'):contains('Points')").length
                              || J('body:contains("We couldn\'t locate the website you\'re attempting to visit.")').length
                              || J('body:contains("You have successfully reported")').length
                            ) {
                                console.log("setting the tabstate to false...");
                                GM.setValue('ylh_traffic_tab_open', false).then(() => { //free the way for a new tab
                                    /*window.close(); //might not always work in FF
                                    setTimeout (window.close, 1000);*/
                                });
                            } else if (J("*:contains('viewing websites too quickly! Please wait')").length) location.reload();
                        } else alert("Please reload the website list, and make sure you are still logged in.");
                        break;
                }
            });
        }
    }, globalInterval);


// Açık pencereleri düzenli olarak temizle
setInterval(() => {
  windowList = windowList.filter(win => {
    try {
      return win && !win.closed;
    } catch (e) {
      return false;
    }
  });
}, 30000);


})();