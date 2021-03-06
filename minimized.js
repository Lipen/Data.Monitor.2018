"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e
}
: function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
}
  , carsArray = []
  , global = {
    data: [],
    slices: []
}
  , webSocket = void 0
  , test = void 0
  , map = void 0
  , _marker = void 0
  , mrkSearch = void 0
  , spbCntr = void 0
  , resizeTimer = void 0
  , mrkOn = new L.LayerGroup
  , mrkOff = new L.LayerGroup
  , options = {}
  , data = new vis.DataSet(options)
  , dataInfo = new vis.DataSet(options)
  , tAr = new vis.DataSet(options);
$(document).ready(function() {
    function e() {
        (webSocket = $.simpleWebSocket({
            url: "wss://ut.kb.gov.spb.ru/wstele1/",
            attempts: 2
        })).listen(function(e) {
            var a = global.data[e.BlockNumber]
              , t = data.get(e.BlockNumber)
              , s = new L.latLng(e.latitude,e.longitude);
            if (void 0 != a && "33" != e.header.type && "34" != e.header.type && void 0 != e.latitude && void 0 != e.longitude && 0 != e.latitude && 0 != e.longitude && 32 != (32 & e.route) && 7179 != e.Version)
                if (null != t) {
                    var i = r(t.sls.unit_time, e.unit_time);
                    o(a, e);
                    (_marker = t.mO)._latlngs.length > 5 && _marker._latlngs.shift(),
                    data.update({
                        id: e.BlockNumber,
                        mO: _marker,
                        sls: e,
                        obj: a,
                        latlon: s
                    }),
                    i >= 1e5 && (8 & t.sls.sensors) / 8 == 1 && Math.round(t.sls.speed) >= 10 && _marker.remove() && _marker.addLatLng(s, i),
                    map.getBounds().contains(s) && (map.getZoom() >= 14 ? (_marker.moveTo(s, i),
                    _marker.start()) : _marker.setLatLng(s, i)),
                    _marker._popup.setContent("<div><b>Тип: </b>" + a.job + "</br><b>Предприятие: </b>" + a.vgn + "</br><b>Автоколонна: </b>" + a.acn + "</br><b>Гаражный номер: </b>" + a.nc + "</br><b>Марка: </b>" + a.bn + "</br><b class='name'>Функция:</b><div class='func'>" + n(a, e.sensors) + "</div></br><b>Скорость: </b>" + Math.round(t.sls.speed) + " км/ч</div>")
                } else {
                    var d = n(a, e.sensors)
                      , l = o(a, e)
                      , c = L.Marker.movingMarker([s, s], [], {
                        title: a.nc,
                        icon: l
                    })
                      , p = "<div><b>Тип: </b>" + a.job + "</br><b>Предприятие: </b>" + a.vgn + "</br><b>Автоколонна: </b>" + a.acn + "</br><b>Гаражный номер: </b>" + a.nc + "</br><b>Марка: </b>" + a.bn + "</br><b class='name'>Функция:</b><div class='func'>" + d + "</div></br><b>Скорость: </b>" + Math.round(e.speed) + " км/ч</div>";
                    (e.sensors & a.GB_MASK) / a.GB_MASK === a.GB_AL && (8 & e.sensors) / 8 == 1 ? mrkOn.addLayer(c) : mrkOff.addLayer(c),
                    data.add([{
                        id: e.BlockNumber,
                        mO: c.bindPopup(p),
                        sls: e,
                        obj: a,
                        latlon: s
                    }])
                }
        })
    }
    function a() {
        scroll(0, 0);
        var e = $(".header:visible")
          , a = $(".footer:visible")
          , t = $(".content:visible")
          , n = $(window).height() - e.outerHeight() - a.outerHeight();
        n -= t.outerHeight() - t.height(),
        t.height(n),
        $("#map_canvas").height(n)
    }
    function t() {
        var e = {
            "max-height": $(".aside").innerHeight() - $(".aside-header").innerHeight() - $(".nav-tabs").innerHeight() - 15 + "px"
        };
        $(".feedEkList").css(e),
        $("#contact").css(e)
    }
    function n(e, a) {
        var t = new Array;
        e = e.car_info || e;
        var n = "";
        return void 0 != c[e.F1_ID] ? t[0] = c[e.F1_ID] : t[0] = "",
        void 0 != c[e.F2_ID] ? t[1] = c[e.F2_ID] : t[1] = "",
        void 0 != c[e.F3_ID] ? t[2] = c[e.F3_ID] : t[2] = "",
        void 0 != c[e.F4_ID] ? t[3] = c[e.F4_ID] : t[3] = "",
        (1024 & a) / 1024 == e.GB_AL && (8 & a) / 8 == 1 ? ((a & e.F1_MASK) / e.F1_MASK == e.F1_AL ? n += "<span style='color:" + p[e.F1_ID] + ";'><b>" + t[0] + "</b></span> <br />" : n += "<span style='color:grey;'><b>" + t[0] + "</b></span>  ",
        (a & e.F2_MASK) / e.F2_MASK == e.F2_AL ? n += "<span style='color:" + p[e.F2_ID] + ";'><b>" + t[1] + "</b></span> <br />" : n += "<span style='color:grey;'><b>" + t[1] + "</b></span>  ",
        (a & e.F3_MASK) / e.F3_MASK == e.F3_AL ? n += "<span style='color:" + p[e.F3_ID] + ";'><b>" + t[2] + "</b></span> <br />" : n += "<span style='color:grey;'><b>" + t[2] + "</b></span>  ",
        (a & e.F4_MASK) / e.F4_MASK == e.F4_AL ? n += "<span style='color:" + p[e.F4_ID] + ";'><b>" + t[3] + "</b></span> <br />" : n += "<span style='color:grey;'><b>" + t[3] + "</b></span>") : n = t[0] + " " + t[1] + " " + t[2] + " " + t[3],
        n
    }
    function o(e, a) {
        var t = void 0;
        return t = "images/car/" + e.imgType + s(a, e) + "_32.png",
        L.icon({
            iconUrl: t,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        })
    }
    function r(e, a) {
        var t = e.replace((new RegExp("-","g"),
        "/"), (new RegExp("T"),
        " "))
          , n = a.replace((new RegExp("-","g"),
        "/"), (new RegExp("T"),
        " "));
        return 1.8 * parseInt(new Date(n).getTime() - new Date(t).getTime())
    }
    function s(e, a) {
        return (e.sensors & a.GB_MASK) / a.GB_MASK === a.GB_AL && (8 & e.sensors) / 8 == 1 ? "" !== a.F1_MASK && (e.sensors & a.F1_MASK) / a.F1_MASK === a.F1_AL ? l[a.F1_ID] : "" !== a.F2_MASK && (e.sensors & a.F2_MASK) / a.F2_MASK === a.F2_AL ? l[a.F2_ID] : "" !== a.F3_MASK && (e.sensors & a.F3_MASK) / a.F3_MASK === a.F3_AL ? l[a.F3_ID] : "" !== a.F4_MASK && (e.sensors & a.F4_MASK) / a.F4_MASK === a.F4_AL ? l[a.F4_ID] : "white" : "grey"
    }
    function i() {
        $("#search_query").autocomplete({
            appendTo: ".col-middle",
            source: function(e, a) {
                $.ajax({
                    url: "https://nominatim.openstreetmap.org",
                    cache: !0,
                    method: "GET",
                    data: {
                        q: "Санкт-Петербург, " + e.term,
                        format: "json",
                        limit: 10
                    }
                }).done(function(e) {
                    a($.map(e, function(e) {
                        return {
                            value: e.display_name.split(",", 6),
                            latitude: e.lat,
                            longitude: e.lon
                        }
                    })),
                    $("#progressbar").hide()
                }).fail(function() {})
            },
            select: function(e, a) {
                var t = a.item.latitude
                  , n = a.item.longitude;
                mrkSearch = {
                    lat: t,
                    lon: n
                },
                map.setView(mrkSearch, 18);
                var o = L.icon({
                    iconUrl: "images/marker_30.png",
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
                  , r = L.marker(mrkSearch, {
                    icon: o
                }).addTo(map);
                $(".closed").click(function() {
                    void 0 != r && (map.removeLayer(r),
                    map.setZoom(10))
                })
            },
            search: function() {
                $("#progressbar").show()
            }
        })
    }
    function d() {
        $("#search_query").autocomplete({
            appendTo: ".col-middle",
            source: function(e, a) {
                var t = $.ui.autocomplete.escapeRegex(e.term)
                  , n = new RegExp(t,"ig");
                a($.grep($.map(carsArray, function(e, a) {
                    return {
                        label: [e.nc + " (" + e.bn + ", " + e.mn + ", " + e.vgn + ", " + e.acn + ")"],
                        value: [e.nc + " (" + e.bn + ", " + e.mn + ", " + e.vgn + ", " + e.acn + ")"],
                        did: e.did
                    }
                }), function(e) {
                    return n.test(e.value)
                })),
                $("#progressbar").hide()
            },
            select: function(e, a) {
                map.setView(data._data[a.item.did].mO._latlng, 18),
                data._data[a.item.did].mO.openPopup(data._data[a.item.did].mO._latlng)
            },
            search: function() {
                $("#progressbar").show()
            }
        })
    }
    var l = []
      , c = []
      , p = [];
    l[1] = "black",
    l[2] = "lilac",
    l[3] = "light_blue",
    l[4] = "red",
    l[5] = "orange",
    l[6] = "blue",
    l[7] = "green",
    l[8] = "light_green",
    l[9] = "light_blue",
    l[10] = "yellow",
    l[11] = "lilac",
    l[12] = "brown",
    l[13] = "yellow",
    l[14] = "lemon",
    l[15] = "violet",
    l[16] = "t",
    c[1] = "Погрузчики",
    c[2] = "Самосвалы и МСК",
    c[3] = "Мусоровозы",
    c[4] = "Распределители твердых реагентов",
    c[5] = "Распределители твердых реагентов с увлажнением",
    c[6] = "Поливомоечное оборудование",
    c[7] = "Подметально-уборочное оборудование (механическое)",
    c[8] = "Вакуумное оборудование",
    c[9] = "Щеточное оборудование (на автомобильном шасси)",
    c[10] = "Плужное оборудование (на автомобильном шасси)",
    c[11] = "Бульдозеры",
    c[12] = "Распределители жидких реагентов",
    c[13] = "Тягач (для уборочной техники)",
    c[15] = "Контроль",
    c[16] = "Ручная уборка",
    p[1] = "black",
    p[2] = "#9B30FF",
    p[3] = "turquoise",
    p[4] = "red",
    p[5] = "orange",
    p[6] = "blue",
    p[7] = "green",
    p[8] = "lime",
    p[9] = "#00D5D5",
    p[10] = "yellow",
    p[11] = "#FF6A00",
    p[12] = "brown",
    p[13] = "yellow",
    p[14] = "C3F266",
    p[15] = "violet",
    p[16] = "grey";
    var m = document.createElement("input");
    return $("#search_clear").append(m),
    $("#search").append("<a href='#' class='closed'><i class='fa fa-times'></i></a>"),
    function(e, a) {
        for (var t in a)
            e.setAttribute(t, a[t])
    }(m, {
        type: "text",
        id: "search_query",
        class: "address clearable",
        placeholder: "Поиск по адресу"
    }),
    $.ajax({
        url: "/info.json",
        dataType: "json"
    }).done(function(a) {
        dataInfo.add(a.result);
        for (var t in dataInfo._data)
            "object" === _typeof(dataInfo._data[t]) && (global.data[dataInfo._data[t].did] = dataInfo._data[t],
            carsArray.push(dataInfo._data[t]));
        e()
    }).fail(function(e, a, t) {}),
    $(function() {
        i();
        var e = $("#search_query");
        $(".button-state").click(function() {
            e.hasClass("address") ? (e.removeClass("address"),
            e.addClass("object"),
            $(window).width() <= 575 ? e.attr("placeholder", "Поиск по б/н") : e.attr("placeholder", "Поиск по бортовому номеру"),
            d()) : (e.removeClass("object"),
            e.addClass("address"),
            e.attr("placeholder", "Поиск по адресу"),
            i())
        }),
        $("form").submit(function() {
            return !1
        })
    }),
    $("#search_query").on("input", function() {
        "" !== $("#search_query").val() && ($(".closed").show(),
        $(".button-state").hide())
    }),
    $(".closed").click(function() {
        $(".button-state").show(),
        $(".closed").hide(),
        $("#search_query").val("")
    }),
    $(window).resize(function() {
        clearTimeout(resizeTimer),
        resizeTimer = setTimeout(a(), 100),
        $(".feedEkList").css("max-height", ""),
        $("#contact").css("max-height", ""),
        t()
    }),
    $(".col-left").click(function() {
        $(window).width() <= 575 && ($("#system-tab").removeClass("active"),
        $(".icon_system").addClass("active"))
    }),
    $(".col-right").click(function() {
        t(),
        $(".aside").hasClass("in") ? $(".aside").asidebar("close") : $(".aside").asidebar("open")
    }),
    $("#news").FeedEk({
        FeedUrl: "http://gov.spb.ru/gov/otrasl/blago/news/rss/",
        MaxCount: 10,
        ShowDesc: !0,
        ShowPubDate: !0,
        DescCharacterLimit: 100
    }),
    $("#progressbar").progressbar({
        value: !1
    }),
    function() {
        return a(),
        function() {
            var e = new L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",{
                detectRetina: !0,
                minZoom: 9
            })
              , a = new L.TileLayer("https://{s}.tile.cloudmade.com/8ee2a50541944fb9bcedded5165f09d9/{styleId}/256/{z}/{x}/{y}.png",{
                styleId: 999
            });
            spbCntr = new L.LatLng(59.930967,30.302636),
            (map = new L.Map("map_canvas",{
                center: spbCntr,
                zoom: 10,
                layers: [e, mrkOn]
            })).setMaxBounds([[59.430967, 29.302636], [60.430967, 31.302636]]),
            L.control.fullscreen({
                position: "topleft"
            }).addTo(map),
            L.control.locate().addTo(map);
            var t = L.control({
                position: "bottomright"
            });
            t.onAdd = function() {
                var e = L.DomUtil.create("div", "info legend legendHide");
                return e.innerHTML = "<div class='row mrg'><div class='col-2'><div class='col-12'><img src='images/car/square_grey_32.png' width='24' height='24' /></div><div class='col-12'><img src='images/car/triangle_grey_32.png' width='24' height='24' /></div><div class='col-12'><img src='images/car/circle_grey_32.png' width='24' height='24' /></div><div class='col-12'><img src='images/car/circle_t_32.png' width='24' height='24' /></div></div><div class='col-10 colHide'><div class='col-12'><p>&nbsp-&nbspМашины для уборки тротуаров</p></div><div class='col-12'><p>&nbsp-&nbspМашины для уборки проезжей части</p></div><div class='col-12'><p>&nbsp-&nbspДругая техника</p></div><div class='col-12'><p>&nbsp-&nbspТрекер&nbsp(для ручной уборки)</p></div></div></div>",
                e
            }
            ,
            t.addTo(map);
            var n = {
                "Карта СПб": e,
                "Карта СПб(ночь)": a
            }
              , o = {
                "На линии": mrkOn,
                "На дежурстве": mrkOff
            }
              , r = new L.Control.Layers(n,o);
            map.addControl(r),
            map.on("zoomend", function() {
                var e = map.getZoom();
                console.log("zoom", e),
                mrkOn.clearLayers(),
                mrkOff.clearLayers(),
                data.forEach(function(e) {
                    var a = e.sls
                      , t = e.obj
                      , n = new L.LatLng(a.latitude,a.longitude);
                    map.getBounds().contains(n) && ((a.sensors & t.GB_MASK) / t.GB_MASK === t.GB_AL && (8 & a.sensors) / 8 == 1 ? mrkOn.addLayer(e.mO) : mrkOff.addLayer(e.mO))
                })
            }),
            map.on("moveend", function() {
                data.forEach(function(e) {
                    var a = e.sls
                      , t = e.obj
                      , n = e.latlon;
                    map.getBounds().contains(n) && ((a.sensors & t.GB_MASK) / t.GB_MASK === t.GB_AL && (8 & a.sensors) / 8 == 1 ? mrkOn.addLayer(e.mO) : mrkOff.addLayer(e.mO))
                })
            }),
            $(".legend").on("mouseover touchstart", function(e) {
                "touchstart" != e.type ? ($(".legend").removeClass("legendHide"),
                e.stopPropagation()) : $(".legend").hasClass("legendHide") ? ($(".legend").removeClass("legendHide"),
                e.stopPropagation()) : ($(".legend").addClass("legendHide"),
                e.stopPropagation())
            }),
            $(".legend").on("mouseout touchstart", function(e) {
                "touchstart" == e.type ? $("#map_canvas").on("touchstart", function(e) {
                    $(".legend").addClass("legendHide"),
                    e.stopPropagation()
                }) : ($(".legend").addClass("legendHide"),
                e.stopPropagation())
            })
        }()
    }()
});
