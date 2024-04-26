!function () {
    "use strict";
    function e(e) {
        localStorage.measure = e.target.id,
            t.localStorage = localStorage,
            document.getElementById("ms").classList.remove("active"),
            document.getElementById("mh").classList.remove("active"),
            document.getElementById("kh").classList.remove("active"),
            e.target.classList.add("active")
    }
    document.addEventListener("DOMContentLoaded", function (e) {
        if (t.init(),
            localStorage && !localStorage.getItem("userClosedHelpModal"))
            setTimeout(function () { }, 5e3);
        else if (localStorage && localStorage.getItem("userClosedHelpModal")) {
            var n = localStorage.getItem("userClosedHelpModal")
                , o = new Date;
            (o.getTime() - n) / 864e5 > 20 && localStorage.removeItem("userClosedHelpModal")
        }
    });
    var t = {};
    t.cache = {},
        t.opts = {
            maxSpeed: 200
        },
        t.utils = {},
        t.localStorage = localStorage,
        t.showHelp = function () {
            document.getElementById("modal").style.display = "block"
        }
        ,
        t.initBtnClickListners = function () {
            document.getElementById("ms").addEventListener("click", e),
                document.getElementById("mh").addEventListener("click", e),
                document.getElementById("kh").addEventListener("click", e)
        }
        ,
        t.init = function () {
            t.cache.speed = document.getElementById("speed"),
                t.localStorage.measure || (localStorage.measure = "kh",
                    t.localStorage = localStorage),
                t.initBtnClickListners(),
                document.getElementById("installer").style.display = "none",
                t.writeSpeed = function (e) {
                    document.getElementById("error").innerHTML = "",
                        document.getElementById("unit").innerHTML = "meter/second";
                    var n = e.coords.speed;
                    "kh" === t.localStorage.measure && (n = 60 * n * 60,
                        n /= 1e3,
                        document.getElementById("unit").innerHTML = "km/h"),
                        "mh" === t.localStorage.measure && (n = 60 * n * 60,
                            n = .000621371192 * n,
                            document.getElementById("unit").innerHTML = "miles/hour"),
                        n = Math.round(n),
                        t.cache.speed.innerHTML = n
                }
                ,
                navigator.geolocation.watchPosition(function (e) {
                    t.writeSpeed(e);
                    try {
                        ga && ga("send", {
                            hitType: "event",
                            eventCategory: "speed",
                            eventAction: "showSpeed",
                            eventLabel: e.coords.speed
                        })
                    } catch (n) { }
                    document.getElementById("lat").innerHTML = "",
                        document.getElementById("long").innerHTML = "",
                        document.getElementById("info").style.display = "none"
                }, function (e) {
                    document.getElementById("speed").innerHTML = "",
                        document.getElementById("error").innerHTML = "ERROR(" + e.code + "): " + e.message,
                        document.getElementById("lat").innerHTML = "ERROR!!!",
                        document.getElementById("info").style.display = "block";
                    try {
                        ga && ga("send", {
                            hitType: "event",
                            eventCategory: "speed",
                            eventAction: "errorShowSpeed",
                            eventLabel: e.message
                        })
                    } catch (t) { }
                }, {
                    enableHighAccuracy: !0,
                    maximumAge: 0
                })
        }
        ;
    var n = function (e) {
        var t = (e.querySelector(".tooltip"),
            function (t) {
                t.preventDefault(),
                    window.install.prompt().then(function (t) {
                        try {
                            ga && ga("send", "event", "install", t)
                        } catch (n) { }
                        e.classList.remove("available")
                    })["catch"](function (e) {
                        try {
                            ga && ga("send", "event", "install", "errored")
                        } catch (t) { }
                    })
            }
        )
            , n = function () {
                window.install.canPrompt().then(function () {
                    document.getElementById("installer").style.display = "block",
                        e.classList.add("available");
                    try {
                        ga && ga("send", "event", "install", "prompted")
                    } catch (t) { }
                })
            };
        e.addEventListener("click", t.bind(this)),
            e.addEventListener("touchend", t.bind(this)),
            n()
    };
    !function () {
        var e, t, n = !1, o = new Promise(function (e, n) {
            t = e
        }
        );
        window.addEventListener("beforeinstallprompt", function (o) {
            return n = !0,
                o.preventDefault(),
                e = o,
                t(),
                !1
        });
        var a = {};
        Object.defineProperty(a, "isAvailable", {
            get: function () {
                return n
            }
        }),
            a.canPrompt = function () {
                return o
            }
            ,
            a.prompt = function () {
                return new Promise(function (t, o) {
                    n === !1 && o("User Agent decided not to prompt"),
                        e.prompt().then(function () {
                            return e.userChoice
                        }).then(function (e) {
                            t(e.outcome)
                        })["catch"](function (e) {
                            o(e)
                        })
                }
                )
            }
            ,
            window.install = a
    }(),
        window.addEventListener("load", function () {
            var e = document.getElementById("installer");
            new n(e)
        })
}();



function generateRandomSlug(length) {
    const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    let slug = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      slug += charset[randomIndex];
    }
    return slug;
  }
  
  function deleteRec(key) {
// Remove the item associated with the specified key
localStorage.removeItem(key);

// Redirect to the specified URL
window.location.href = "/";
}   


var autoInputInterval;
    var autoInputActive = false;

    function toggleAutoInput() {
        if (autoInputActive) {
            document.getElementById("startstop").innerHTML= "Record"
            stopAutoInput();
            olddata();
            document.getElementById("inputList").innerHTML=""
        } else {
            document.getElementById("startstop").innerHTML= "Stop"

            startAutoInput();
        }
    }

    function startAutoInput() {
        var speed = document.getElementById("speed").innerHTML
        console.log(speed)
        autoInputActive = true;
        var slug = generateRandomSlug(10)
        console.log(slug)
        autoInputInterval = setInterval(function() {
            var input = speed
            var inputData = {
                s: input,
                t: new Date().toLocaleString()
            };
            var inputs = JSON.parse(localStorage.getItem(slug)) || [];
            inputs.push(inputData);
            localStorage.setItem(slug, JSON.stringify(inputs));
            displayInputs(slug);
        }, 1000);
        }

    function stopAutoInput() {
        autoInputActive = false;
        clearInterval(autoInputInterval);
        document.querySelector("button").textContent = "Start Auto Input";
    }

    function displayInputs(slug) {
        var inputs = JSON.parse(localStorage.getItem(slug)) || [];
        var inputList = document.getElementById("inputList");
        inputList.innerHTML = "";
        inputs.forEach(function(item) {
            var li = document.createElement("li");
            li.classList.add("inputItem");
            li.textContent = item.s + " - " + item.t;
            inputList.appendChild(li);
        });
    }
    function olddata() {
    if (typeof(Storage) !== "undefined") {
        var keys = Object.keys(localStorage);
        var sortedKeys = [];
        keys.forEach(function(key) {
            if (key !== "measure") {
                var value = localStorage.getItem(key);
                if (value) {
                    value = JSON.parse(value);
                    sortedKeys.push({ key: key, date: new Date(value[0].t) });
                }
            }
        });

        sortedKeys.sort(function(a, b) {
            return a.date - b.date;
        });
        console.log(sortedKeys)
        var olddatalist = document.getElementById("olddatalist");
        olddatalist.innerHTML = ``;
        sortedKeys.forEach(function(item) {
            var li = document.createElement("li");
            li.classList.add("inputItem");
            li.textContent =item.date.toLocaleString();
            li.innerHTML =`<span onclick="loadrecord('${item.key}')">${item.date.toLocaleString()}</span>`
            olddatalist.appendChild(li);
        });
    } else {
        console.log("Use Latest Version of Browsers");
    }
}


function loadrecord(slug){
    var inputs = JSON.parse(localStorage.getItem(slug)) || [];
        var maindiv = document.createElement("div")
        maindiv.setAttribute("class","od_div2")
        var inputList = document.createElement("ul")
        var h33 = document.createElement("h3")
        var empty = document.createElement("div")
        empty.setAttribute("id","emp")
        h33.innerHTML = `Record Details`
        maindiv.append(h33)
        inputList.innerHTML = "";
        inputs.forEach(function(item) {
            var li = document.createElement("li");
            li.textContent = item.s + " - " + item.t;
            inputList.appendChild(li);
        });
        maindiv.append(inputList)
        document.getElementById("main").innerHTML = ``
                document.getElementById("main").append(maindiv)
                document.getElementById("main").append(empty)
                document.getElementById("emp").innerHTML = `<a href="/" class="button extrall">Back</a><button class="button extrall" onclick="deleteRec('${slug}')" style="color:red;">Delete Record</button>`
            
}

    displayInputs();
    olddata();