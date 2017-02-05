/*  This comment MUST stay intact for legal use, so don't remove it.
    EnlargeIt! v1.00 - (c) 2008 Timo Sack - http://enlargeit.timos-welt.de
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by the 
    Free Software Foundation, either version 3 of the License, or 
    (at your option) any later version. See LICENSE.TXT for details. */
// modify these
var enl_gifpath = '/design/yab/css/'; // path to graphics (png)
var enl_brdsize = 14; // border thickness
var enl_brdcolor = '#ffffff'; // border color
var enl_brdround = 1 // use rounded borders (Mozilla/Safari only)
var enl_maxstep = 19; // ani steps (10-30)
var enl_speed = 12; // time between steps
var enl_ani = 4; // 0=no,1=fade,2=glide,3=bumpglide,4=smoothglide,5=expglide
var enl_shadow = 1; // shadow under border (0/1)
var enl_shadowsize = 1; // size of shadow right/bottom (0-20)
var enl_shadowintens = 16; // shadow intensity (10-30)
var enl_dark = 0; // darken screen (0=off/1=on/2=keep dark when nav)
var enl_darkprct = 40; // how dark the screen should be (0-100)
var enl_center = 0; // center enlarged pic on screen
var enl_drgdrop = 1; // enable drag&drop for pics
var enl_preload = 1; // preload next/prev pic in grouped sets
var enl_titlebar = 1; // show pic title bar (0/1)
var enl_titletxtcol = '#808080' // color of title bar text
var enl_ajaxcolor = '#dddddd'; // background color for AJAX

// don't modify next line
var enl_buttonurl = new Array(),
    enl_buttontxt = new Array(),
    enl_buttonoff = new Array();

// define your buttons here
var enl_prldimg = new Array(),
    enl_button = new Array();
var enl_butact, enl_btnheight, enl_prldcnt = 0,
    enl_darkened = 0;
var enl_ie = document.all;
var enl_nn6 = document.getElementById && !document.all;
var enl_konq = navigator.appName.indexOf("onqueror") + 1;
var enl_drgmode = false,
    enl_hasmvd = false;
var enl_drgelem, enl_mvcnt = 0,
    enl_closebtn = 0;
var enl_brwsx, enl_brwsy, enl_scrollx, enl_scrolly;
var enl_firstcall = 0,
    enl_inprogress = 0,
    enl_zcnt = 9700;
var enl_iflowcorr = 1,
    enl_request = false,
    enl_keepblack = 0;

function enl_init() {
    if (!enl_firstcall) {
        enl_firstcall = 1;
        if (enl_konq) enl_ani = 0;
        if (enl_buttonurl.length) enl_titlebar = 1;
        var enl_i = 0;
        while (enl_i < enl_buttonurl.length) {
            if (enl_buttonurl[enl_i] == 'close') enl_closebtn = 1;
            enl_i++
        }
        enl_request = false;
        if (window.XMLHttpRequest) {
            enl_request = new XMLHttpRequest()
        } else if (window.ActiveXObject) {
            try {
                enl_request = new ActiveXObject("Msxml2.XMLHTTP")
            } catch (enl_err) {
                try {
                    enl_request = new ActiveXObject("Microsoft.XMLHTTP")
                } catch (enl_err) {}
            }
        }
        if (enl_titlebar) {
            enl_preloadit(enl_gifpath + 'buttons_act.png');
            enl_butact = enl_prldimg[enl_prldcnt];
            enl_preloadit(enl_gifpath + 'buttons_inact.png')
        }
        enl_ldr = enl_mkdiv('enl_ldr');
        enl_ldr.style.zIndex = 9999;
        enl_ldrgif = new Image();
        enl_ldrgif.src = enl_gifpath + 'loader.gif';
        enl_ldrgif.style.borderWidth = '1px';
        enl_ldrgif.style.borderStyle = 'solid';
        enl_ldrgif.style.borderColor = 'black';
        enl_ldr.appendChild(enl_ldrgif);
        enl_brdm = enl_mkdiv('enl_brd');
        enl_brdm.name = 'ajax';
        enl_brdm.style.backgroundColor = enl_brdcolor;
        if (enl_brdround) {
            enl_brdm.style.MozBorderRadius = enl_brdsize + 'px';
            enl_brdm.style.khtmlBorderRadius = enl_brdsize + 'px'
        }
        if (enl_shadow) {
            enl_shdm = enl_mkdiv('enl_shd');
            if (enl_konq) enl_shdm.style.backgroundImage = 'url(' + enl_gifpath + '1pix.png)';
            else {
                enl_shdm.style.backgroundColor = 'black';
                enl_setopa(enl_shdm, enl_shadowintens);
                if (enl_brdround) {
                    enl_shdm.style.MozBorderRadius = eval(enl_brdsize + 1) + 'px';
                    enl_shdm.style.khtmlBorderRadius = eval(enl_brdsize + 1) + 'px'
                }
            }
        }
        if (enl_dark) {
            enl_drk = enl_mkdiv('enl_drk');
            if (enl_konq) enl_drk.style.backgroundImage = 'url(' + enl_gifpath + '1pix.png)';
            else {
                enl_setopa(enl_drk, enl_darkprct);
                enl_drk.style.backgroundColor = 'black'
            }
            enl_drk.style.zIndex = 9670;
            enl_addResize(enl_resize)
        }
        enl_firstcall = 2
    }
}

function enl_setpos(enl_obj, enl_posx, enl_posy, enl_w, enl_h) {
    enl_obj.style.left = enl_posx + 'px';
    enl_obj.style.top = enl_posy + 'px';
    if (enl_w) {
        enl_obj.style.width = enl_w + 'px';
        enl_obj.style.height = enl_h + 'px'
    }
}

function enl_setopa(enl_obj, enl_opval) {
    enl_obj.style.opacity = enl_opval / 100;
    enl_obj.style.MozOpacity = enl_opval / 100;
    enl_obj.style.filter = "alpha(opacity=" + enl_opval + ")"
}

function enl_geto(enl_imgid) {
    return document.getElementById(enl_imgid)
}

function enl_preloadit(enl_picpath) {
    enl_prldcnt += 1;
    enl_prldimg[enl_prldcnt] = new Image();
    enl_prldimg[enl_prldcnt].src = enl_picpath
}

function enl_visible(enl_obj) {
    enl_obj.style.visibility = 'visible'
}

function enl_hide(enl_obj) {
    enl_obj.style.visibility = 'hidden'
}

function enl_mkdiv(enl_divname) {
    enl_div = document.createElement("div");
    enl_hide(enl_div);
    enl_div.id = enl_divname;
    enl_div.style.position = 'absolute';
    enl_setpos(enl_div, -5000, 0, 0, 0);
    document.body.appendChild(enl_div);
    return enl_div
}

function enl_getbrwsxy() {
    if (typeof window.innerWidth != 'undefined') {
        enl_brwsx = window.innerWidth - 10;
        enl_brwsy = window.innerHeight
    } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
        enl_brwsx = document.documentElement.clientWidth;
        enl_brwsy = document.documentElement.clientHeight
    } else {
        enl_brwsx = document.getElementsByTagName('body')[0].clientWidth;
        enl_brwsy = document.getElementsByTagName('body')[0].clientHeight
    }
    enl_scrolly = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    enl_scrollx = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
}

function enl_resize() {
    if (enl_darkened) {
        enl_drk = enl_geto('enl_drk');
        enl_setpos(enl_drk, 0, 0, 0, 0);
        enl_getbrwsxy();
        if (window.innerHeight && window.scrollMaxY) enl_darkh = (window.innerHeight + window.scrollMaxY > enl_brwsy) ? window.innerHeight + window.scrollMaxY : enl_brwsy;
        else enl_darkh = (document.body.scrollHeight > document.body.offsetHeight) ? document.body.scrollHeight : document.body.offsetHeight;
        enl_darkh = (enl_brwsy > enl_darkh) ? enl_brwsy : enl_darkh;
        enl_setpos(enl_drk, 0, 0, document.body.scrollWidth, enl_darkh)
    }
}

function enl_coord(enl_el) {
    var enl_values = {
        top: 0,
        left: 0,
        width: 0,
        height: 0
    };
    if (!enl_el) return enl_values;
    else if (typeof enl_el == 'string') enl_el = enl_geto(enl_el);
    if (typeof enl_el != 'object') return enl_values;
    if (typeof enl_el.offsetTop != 'undefined') {
        enl_values.height = enl_el.offsetHeight;
        enl_values.width = enl_el.offsetWidth;
        enl_values.left = enl_el.top = 0;
        while (enl_el && enl_el.tagName != 'BODY') {
            enl_values.top += parseInt(enl_el.offsetTop);
            enl_values.left += parseInt(enl_el.offsetLeft);
            enl_el = enl_el.offsetParent
        }
    }
    return enl_values
}

function enl_darken() {
    if (enl_dark) {
        enl_drk = enl_geto('enl_drk');
        enl_darkened = 1;
        enl_visible(enl_drk);
        enl_resize()
    }
}

function enl_nodark() {
    if (enl_dark && !enl_keepblack) {
        enl_drk = enl_geto('enl_drk');
        enl_hide(enl_drk);
        enl_setpos(enl_drk, -5000, 0, 0, 0);
        enl_darkened = 0
    }
}

function enl_calcfact(enl_facthelp) {
    var enl_factor;
    if (enl_ani == 3) enl_factor = ((-1 * Math.cos(enl_facthelp - 0.2)) + 0.98) * 3.5;
    else if (enl_ani == 4) enl_factor = (Math.sin(1.5 * Math.PI + enl_facthelp * Math.PI) + 1) / 2;
    else if (enl_ani == 5) enl_factor = Math.pow(enl_facthelp, Math.pow(2, 2));
    else enl_factor = enl_facthelp;
    return enl_factor
}

function enl_makedraggable(enl_imgid) {
    enl_img = enl_geto(enl_imgid);
    enl_img.onmousedown = enl_buttonpress;
    enl_img.onmouseup = enl_enddrag;
    enl_inprogress = 0;
    if (enl_preload) {
        enl_nextpic = enl_getnext(enl_imgid);
        if (enl_nextpic) {
            enl_pictoget = enl_nextpic.getAttribute('longdesc');
            setTimeout('enl_preloadit("' + enl_pictoget + '")', 30)
        }
        enl_prevpic = enl_getprev(enl_imgid);
        if (enl_prevpic) {
            enl_pictoget = enl_prevpic.getAttribute('longdesc');
            setTimeout('enl_preloadit("' + enl_pictoget + '")', 30)
        }
    }
}

function enl_noevents(enl_obj) {
    enl_obj.onmousedown = null;
    enl_obj.onmouseup = null;
    enl_obj.onclick = null
}

function enl_addLoad(enl_func) {
    var enl_oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = enl_func
    } else {
        window.onload = function () {
            if (enl_oldonload) {
                enl_oldonload()
            }
            enl_func()
        }
    }
}

function enl_addResize(enl_resfunc) {
    var enl_oldonresize = window.onresize;
    if (typeof window.onresize != 'function') window.onresize = enl_resfunc;
    else {
        window.onresize = function () {
            enl_resfunc();
            if (enl_oldonresize) {
                setTimeout('"+enl_oldonresize+"', 25)
            }
        }
    }
}

function enl_ajaxload(enl_obj) {
    enl_ldr = enl_geto('enl_ldr');
    enl_r = enl_coord(enl_obj);
    enl_setpos(enl_ldr, enl_r.left + enl_r.width / 2 - 17, enl_r.top + enl_r.height / 2 - 17);
    enl_visible(enl_ldr)
}

function enl_ajaxldrhide() {
    enl_ldr = enl_geto('enl_ldr');
    enl_hide(enl_ldr);
    enl_setpos(enl_ldr, -5000, 0)
}

function enl_getprev(enl_imgid) {
    enl_oripic = enl_geto(enl_geto(enl_imgid).orig);
    if (enl_oripic.className) {
        var enl_allElm = document.body.getElementsByTagName('img');
        var enl_flag = 0;
        for (var enl_i = enl_allElm.length; enl_i >= 0; enl_i--) {
            if ((enl_flag == 1) && (enl_allElm[enl_i].className == enl_oripic.className) && !enl_allElm[enl_i].orig) {
                enl_flag = 2;
                enl_nextObj = enl_allElm[enl_i]
            }
            if (enl_oripic == enl_allElm[enl_i]) enl_flag = 1
        }
        if (enl_flag == 2 && !enl_nextObj.isenlarged) return enl_nextObj;
        else return null
    }
}

function enl_getnext(enl_imgid) {
    enl_oripic = enl_geto(enl_geto(enl_imgid).orig);
    if (enl_oripic.className) {
        var enl_allElm = document.body.getElementsByTagName('img');
        var enl_flag = 0;
        for (var enl_i = 0; enl_i < enl_allElm.length; enl_i++) {
            if ((enl_flag == 1) && (enl_allElm[enl_i].className == enl_oripic.className) && !enl_allElm[enl_i].orig) {
                enl_flag = 2;
                enl_nextObj = enl_allElm[enl_i]
            }
            if (enl_oripic == enl_allElm[enl_i]) enl_flag = 1
        }
        if (enl_flag == 2 && !enl_nextObj.isenlarged) return enl_nextObj;
        else return null
    }
}

function enl_makebtn(enl_id, enl_offset) {
    enl_tempbtn = document.createElement("a");
    enl_tempbtn.id = enl_id;
    try {
        enl_tempbtn.style.cursor = 'pointer'
    } catch (enl_err) {}
    with(enl_tempbtn.style) {
        height = enl_btnheight + 'px';
        width = enl_btnheight + 'px';
        marginRight = '3px';
        backgroundImage = 'url(' + enl_gifpath + 'buttons_inact.png)';
        backgroundPosition = enl_offset + 'px 0px';
        display = 'block';
        styleFloat = 'left';
        cssFloat = 'left'
    }
    return enl_tempbtn
}

function enl_mktitlebar(enl_imgid) {
    if (enl_titlebar) {
        enl_img = enl_geto(enl_imgid);
        enl_btns = enl_mkdiv(enl_imgid + 'btns');
        enl_btns.style.padding = '2px';
        enl_maxwidth = parseInt(enl_img.neww) - enl_buttonurl.length * (enl_btnheight + 3);
        if (enl_maxwidth > 100 && enl_img.alt != '') {
            enl_title = document.createElement('div');
            with(enl_title.style) {
                position = 'relative';
                styleFloat = 'left';
                cssFloat = 'left';
                textAlign = 'center';
                paddingTop = '2px';
                fontFamily = 'Arial,Helvetica,sans-serif';
                fontSize = '10pt';
                color = enl_titletxtcol;
                whiteSpace = 'nowrap'
            }
            enl_gettitle = enl_img.alt;
            if (enl_gettitle.length > Math.round(enl_maxwidth * 0.09)) enl_gettitle = enl_gettitle.substring(0, Math.round(enl_maxwidth * 0.09) - 2) + '...';
            enl_title.innerHTML = enl_gettitle;
            enl_title.style.width = enl_maxwidth + 'px';
            enl_btns.appendChild(enl_title)
        }
        var enl_i = 0;
        while (enl_i < enl_buttonurl.length) {
            if (enl_buttonurl[enl_i] == 'next' && enl_getnext(enl_imgid) == null) {
                enl_i++;
                continue
            } else if (enl_buttonurl[enl_i] == 'prev' && enl_getprev(enl_imgid) == null) {
                enl_i++;
                continue
            }
            enl_button[enl_i] = enl_makebtn(enl_imgid + enl_i, enl_buttonoff[enl_i]);
            enl_button[enl_i].title = enl_buttontxt[enl_i];
            enl_button[enl_i].whichpic = enl_imgid;
            enl_button[enl_i].ajaxurl = enl_buttonurl[enl_i];
            switch (enl_buttonurl[enl_i]) {
            case 'close':
                enl_button[enl_i].onclick = function () {
                    enl_shrink(enl_imgid)
                };
                break;
            case 'pic':
                enl_button[enl_i].onclick = function () {
                    enl_btnpicture(enl_imgid)
                };
                break;
            case 'prev':
                enl_button[enl_i].onclick = function () {
                    enl_prev(enl_imgid)
                };
                break;
            case 'next':
                enl_button[enl_i].onclick = function () {
                    enl_next(enl_imgid)
                };
                break;
            default:
                enl_button[enl_i].onclick = function () {
                    enl_btnajax(this)
                };
                break
            }
            enl_button[enl_i].onmouseover = function () {
                enl_btnmover(this)
            };
            enl_button[enl_i].onmouseout = function () {
                enl_btnmout(this)
            };
            enl_btns.appendChild(enl_button[enl_i]);
            enl_i++
        }
        enl_img.btnw = enl_btns.offsetWidth
    }
}

function enl_next(enl_imgid) {
    enl_nextPic = enl_getnext(enl_imgid);
    if (enl_nextPic) {
        if (enl_dark == 2) enl_keepblack = 1;
        enl_shrink(enl_imgid);
        enlarge(enl_nextPic)
    }
}

function enl_prev(enl_imgid) {
    enl_nextPic = enl_getprev(enl_imgid);
    if (enl_nextPic) {
        if (enl_dark == 2) enl_keepblack = 1;
        enl_shrink(enl_imgid);
        enlarge(enl_nextPic)
    }
}

function enl_btnpicture(enl_imgid) {
    enl_img = enl_geto(enl_imgid);
    enl_geto(enl_imgid + 'brd').innerHTML = '';
    enl_visible(enl_img)
}

function enl_ajax(enl_img, enl_url) {
    enl_brdm = enl_geto(enl_img.id + 'brd');
    enl_brdm.innerHTML = '';
    enl_ajaxload(enl_brdm);
    enl_hide(enl_img);
    try {
        enl_request.open('GET', enl_url, true);
        enl_request.onreadystatechange = function () {
            if (enl_request.readyState == 4) {
                enl_ajaxldrhide();
                enl_answer = enl_request.responseText;
                enl_divh = enl_img.newh - 2;
                enl_divw = enl_img.neww - 2;
                enl_tmphtml = '<div style="width:' + enl_divw + 'px;height:' + enl_divh + 'px;overflow:auto;border-color:#aaaaaa;border-width:1px;border-style:solid;background-color:' + enl_ajaxcolor + ';margin-left:' + enl_brdsize + 'px;margin-bottom:' + enl_brdsize + 'px;margin-right:' + enl_brdsize + 'px;margin-top:';
                enl_tmphtml += (enl_brdsize < enl_btnheight + 4) ? eval(enl_btnheight + 4) : enl_brdsize;
                enl_tmphtml += 'px;">' + enl_answer + '</div>';
                enl_geto(enl_imgid + 'brd').innerHTML = enl_tmphtml
            }
        };
        enl_request.send(null)
    } catch (enl_err) {
        enl_ajaxldrhide();
        enl_geto(enl_imgid + 'brd').innerHTML = "<center><br/><br/><p style='font-size:12px;'>AJAX did not work"
    }
}

function enl_btnajax(enl_obj) {
    enl_img = enl_geto(enl_obj.whichpic);
    enl_imgid = enl_img.id;
    enl_geturl = enl_obj.ajaxurl;
    if (enl_img.getAttribute('name')) enl_geturl += enl_img.getAttribute('name');
    enl_geturl += (enl_geturl.indexOf("?") < 0) ? "?enl_img=" + enl_imgid : "&enl_img=" + enl_imgid;
    enl_ajax(enl_img, enl_geturl)
}

function enl_ajaxfollow(enl_obj) {
    enl_link = enl_obj.name;
    enl_imgid = enl_link.split("enl_img=")[1];
    if (enl_imgid.indexOf("&")) enl_imgid = enl_imgid.split("&")[0];
    enl_img = enl_geto(enl_imgid);
    enl_ajax(enl_img, enl_link)
}

function enl_btnmover(enl_obj) {
    enl_obj.style.backgroundImage = 'url(' + enl_gifpath + 'buttons_act.png)'
}

function enl_btnmout(enl_obj) {
    enl_obj.style.backgroundImage = 'url(' + enl_gifpath + 'buttons_inact.png)'
}

function enl_showbtn(enl_imgid) {
    if (enl_titlebar) {
        enl_btns = enl_geto(enl_imgid + 'btns');
        enl_img = enl_geto(enl_imgid);
        enl_tmpl = parseInt(enl_img.style.left) + enl_img.neww - enl_img.btnw + 5;
        enl_tmpt = (enl_titlebar && enl_brdsize < enl_btnheight + 4) ? parseInt(enl_img.style.top) - (enl_btnheight + 4) : parseInt(enl_img.style.top) - enl_brdsize;
        enl_setpos(enl_btns, enl_tmpl, enl_tmpt);
        enl_btns.style.zIndex = enl_zcnt + 1;
        enl_visible(enl_btns)
    }
}

function enl_hidebtn(enl_imgid) {
    if (enl_titlebar) {
        enl_btns = enl_geto(enl_imgid + 'btns');
        enl_hide(enl_btns);
        enl_setpos(enl_btns, -5000, 0)
    }
}

function enl_dropshadow(enl_imgid) {
    enl_img = enl_geto(enl_imgid);
    enl_shdclone1 = enl_geto(enl_imgid + "shd1");
    enl_shdclone2 = enl_geto(enl_imgid + "shd2");
    enl_tmpw = enl_img.neww + enl_shadowsize + enl_brdsize * 2 + 2;
    if (enl_titlebar && enl_brdsize < enl_btnheight + 4) {
        enl_tmph = enl_img.newh + enl_shadowsize + enl_brdsize * 2 + 6 + enl_btnheight - enl_brdsize;
        enl_tmpt = enl_img.newt - enl_brdsize - 1 - (enl_btnheight + 4) + enl_brdsize
    } else {
        enl_tmph = enl_img.newh + enl_shadowsize + enl_brdsize * 2 + 2;
        enl_tmpt = enl_img.newt - enl_brdsize - 1
    }
    enl_setpos(enl_shdclone1, enl_img.newl - enl_brdsize - 1, enl_tmpt, enl_tmpw, enl_tmph);
    enl_shdclone1.style.zIndex = enl_zcnt - 2;
    enl_visible(enl_shdclone1);
    enl_setpos(enl_shdclone2, enl_img.newl - enl_brdsize - 2, enl_tmpt - 1, enl_tmpw + 2, enl_tmph + 2);
    enl_shdclone2.style.zIndex = enl_zcnt - 2;
    enl_visible(enl_shdclone2)
}

function enl_delshadow(enl_imgid) {
    enl_shd1 = enl_geto(enl_imgid + "shd1");
    enl_shd2 = enl_geto(enl_imgid + "shd2");
    enl_hide(enl_shd1);
    enl_setpos(enl_shd1, -5000, 0);
    enl_hide(enl_shd2);
    enl_setpos(enl_shd2, -5000, 0)
}

function enl_mkborder(enl_imgid) {
    enl_img = enl_geto(enl_imgid);
    enl_brdclone = enl_geto(enl_imgid + "brd");
    if (enl_titlebar && enl_brdsize < enl_btnheight + 4) {
        enl_tmph = enl_img.newh + enl_brdsize + enl_btnheight + 4;
        enl_tmpt = enl_img.newt - enl_brdsize - (enl_btnheight + 4) + enl_brdsize
    } else {
        enl_tmph = enl_img.newh + enl_brdsize * 2;
        enl_tmpt = enl_img.newt - enl_brdsize
    }
    enl_setpos(enl_brdclone, enl_img.newl - enl_brdsize, enl_tmpt);
    with(enl_brdclone.style) {
        width = eval(enl_img.neww + enl_brdsize * 2) + 'px';
        height = enl_tmph + 'px';
        visibility = 'visible';
        zIndex = enl_zcnt - 1
    }
    if (enl_shadow) setTimeout('enl_dropshadow("' + enl_imgid + '")', 10)
}

function enl_delborder(enl_imgid) {
    enl_brdm = enl_geto(enl_imgid + "brd");
    enl_hide(enl_brdm);
    enl_setpos(enl_brdm, -5000, 0);
    if (enl_shadow) enl_delshadow(enl_imgid)
}

function enl_mousemv(enl_el) {
    if (enl_drgmode && enl_drgdrop) {
        enl_tmpl = enl_nn6 ? enl_tx + enl_el.clientX - enl_x : enl_tx + event.clientX - enl_x;
        enl_tmpt = enl_nn6 ? enl_ty + enl_el.clientY - enl_y : enl_ty + event.clientY - enl_y;
        enl_setpos(enl_drgelem, enl_tmpl, enl_tmpt);
        if (enl_titlebar && enl_brdsize < enl_btnheight + 4) enl_setpos(enl_geto(enl_drgelem.id + "brd"), enl_tmpl - enl_brdsize, enl_tmpt - (enl_btnheight + 4));
        else enl_setpos(enl_geto(enl_drgelem.id + "brd"), enl_tmpl - enl_brdsize, enl_tmpt - enl_brdsize);
        enl_showbtn(enl_drgelem.id);
        enl_mvcnt++;
        if (enl_mvcnt > 3) enl_hasmvd = true;
        return false
    }
}

function enl_buttonpress(enl_el) {
    enl_drgelem = enl_nn6 ? enl_el.target : event.srcElement;
    var topenl_el = enl_nn6 ? "HTML" : "BODY";
    enl_hasmvd = false;
    while (enl_drgelem.tagName != topenl_el && !enl_drgelem.newh) {
        enl_drgelem = enl_nn6 ? enl_drgelem.parentNode : enl_drgelem.parentElement
    }
    enl_drgmode = true;
    enl_zcnt += 3;
    enl_drgid = enl_drgelem.id;
    if (enl_titlebar) enl_geto(enl_drgid + 'btns').style.zIndex = enl_zcnt + 1;
    enl_drgelem.style.zIndex = enl_zcnt;
    if (enl_shadow) enl_delshadow(enl_drgid);
    enl_geto(enl_drgid + "brd").style.zIndex = enl_zcnt - 1;
    enl_tx = parseInt(enl_drgelem.style.left + 0);
    enl_ty = parseInt(enl_drgelem.style.top + 0);
    enl_x = enl_nn6 ? enl_el.clientX : event.clientX;
    enl_y = enl_nn6 ? enl_el.clientY : event.clientY;
    enl_mvcnt = 0;
    enl_drgelem.onmousemove = enl_mousemv;
    return false
}

function enl_enddrag() {
    enl_drgelem.newt = parseInt(enl_drgelem.style.top);
    enl_drgelem.newl = parseInt(enl_drgelem.style.left);
    enl_drgid = enl_drgelem.id;
    if (enl_shadow) enl_dropshadow(enl_drgid);
    enl_noevents(enl_drgelem);
    enl_drgmode = false;
    if (enl_hasmvd == true || (enl_closebtn && enl_titlebar)) {
        enl_mkborder(enl_drgid);
        enl_showbtn(enl_drgid);
        enl_hasmvd = false;
        setTimeout('enl_makedraggable("' + enl_drgid + '")', 100)
    } else enl_shrink(enl_drgid)
}

function enlarge(enl_img) {
    try {
        enl_img.blur()
    } catch (enl_err) {}
    if (!enl_firstcall) enl_init();
    if (enl_firstcall == 1) return false;
    if (enl_inprogress) return false;
    enl_inprogress = 1;
    enl_img.isenlarged = 1;
    if (typeof realcopyspeed != 'undefined') copyspeed = 0;
    enl_preloadit(enl_img.getAttribute('longdesc'));
    enl_imgid = enl_img.getAttribute('id');
    setTimeout('enl_chckready("' + enl_imgid + '")', 5)
}

function enl_chckready(enl_imgid) {
    enl_img = enl_geto(enl_imgid);
    enl_ldr = enl_geto("enl_ldr");
    if (!enl_prldimg[enl_prldcnt].complete) {
        enl_ajaxload(enl_img);
        enl_visible(enl_ldr);
        setTimeout('enl_chckready("' + enl_imgid + '")', 100)
    } else {
        enl_zcnt += 3;
        enl_ajaxldrhide();
        enl_clone = enl_img.cloneNode(true);
        enl_setpos(enl_clone, -5000, 0);
        with(enl_clone) {
            id = enl_img.id + "clone";
            style.visibility = 'hidden';
            style.position = 'absolute';
            style.borderWidth = '0px';
            style.outlineWidth = '0px';
            style.margin = '0px';
            style.padding = '0px'
        }
        enl_clone.orig = enl_img.id;
        enl_fullwidth = parseInt(enl_prldimg[enl_prldcnt].width);
        enl_fullheight = parseInt(enl_prldimg[enl_prldcnt].height);
        document.body.appendChild(enl_clone);
        enl_brddiv = enl_geto("enl_brd");
        enl_brdclone = enl_brddiv.cloneNode(true);
        enl_brdclone.id = enl_imgid + "clonebrd";
        enl_brdclone.style.zIndex = enl_zcnt - 1;
        if (enl_shadow) {
            enl_shddiv = enl_geto("enl_shd");
            enl_shdclone = enl_shddiv.cloneNode(true);
            enl_shdclone.id = enl_clone.id + "shd1";
            enl_shdclone2 = enl_shddiv.cloneNode(true);
            enl_shdclone2.id = enl_clone.id + "shd2";
            document.body.appendChild(enl_shdclone);
            document.body.appendChild(enl_shdclone2)
        }
        document.body.appendChild(enl_brdclone);
        if (typeof realcopyspeed != 'undefined') copyspeed = realcopyspeed;
        setTimeout('enl_doenlarge("' + enl_clone.id + '")', 25)
    }
}

function enl_doenlarge(enl_imgid) {
    enl_zcnt += 3;
    enl_getbrwsxy();
    enl_btnheight = parseInt(enl_butact.height);
    document.onselectstart = function () {
        return false
    };
    enl_img = enl_geto(enl_imgid);
    enl_orig = enl_geto(enl_img.orig);
    enl_noevents(enl_img);
    enl_noevents(enl_orig);
    enl_fullimg = enl_img.getAttribute('longdesc');
    enl_r = enl_coord(enl_orig);
    enl_img.style.zIndex = enl_zcnt;
    enl_img.oldt = enl_r.top;
    enl_img.oldl = enl_r.left;
    enl_img.oldh = parseInt(enl_r.height / enl_iflowcorr);
    enl_img.oldw = enl_r.width;
    enl_img.neww = parseInt(enl_prldimg[enl_prldcnt].width);
    enl_img.newh = parseInt(enl_prldimg[enl_prldcnt].height);
    if (enl_img.neww > enl_brwsx - 100) {
        enl_img.newh = Math.round(enl_img.newh * (enl_brwsx - 100) / enl_img.neww);
        enl_img.neww = enl_brwsx - 100
    }
    if (enl_img.newh > enl_brwsy - 80) {
        enl_img.neww = Math.round(enl_img.neww * (enl_brwsy - 80) / enl_img.newh);
        enl_img.newh = enl_brwsy - 80
    }
    enl_img.newl = Math.round(enl_img.oldl - (enl_img.neww - enl_img.oldw) / 2);
    enl_img.newt = Math.round(enl_img.oldt - (enl_img.newh - enl_img.oldh) / 2);
    if (!enl_center) {
        if (enl_img.newl < (50 + enl_scrollx)) enl_img.newl = 50 + enl_scrollx;
        if (enl_img.newt < (40 + enl_scrolly)) enl_img.newt = 40 + enl_scrolly;
        if (enl_img.newl + enl_img.neww > enl_brwsx + enl_scrollx - 50) enl_img.newl = enl_brwsx + enl_scrollx - 50 - enl_img.neww;
        if (enl_img.newt + enl_img.newh > enl_brwsy + enl_scrolly - 40) enl_img.newt = enl_brwsy + enl_scrolly - 40 - enl_img.newh
    } else {
        enl_img.newl = Math.round(enl_brwsx / 2 + enl_scrollx - enl_img.neww / 2);
        enl_img.newt = Math.round(enl_brwsy / 2 + enl_scrolly - enl_img.newh / 2)
    }
    enl_img.steps = 0;
    enl_img.thumbpic = enl_img.src;
    enl_mktitlebar(enl_imgid);
    if (enl_drgdrop) enl_img.style.cursor = 'move';
    if (enl_ani == 1) {
        setTimeout('enl_dofadein("' + enl_imgid + '")', 20)
    } else if (!enl_ani) {
        setTimeout('enl_donoani("' + enl_imgid + '")', 20)
    } else {
        setTimeout('enl_doglidein("' + enl_imgid + '")', 20)
    }
}

function enl_doglidein(enl_imgid) {
    enl_img = enl_geto(enl_imgid);
    enl_img.steps++;
    if (enl_img.steps == enl_maxstep) {
        enl_setpos(enl_img, enl_img.newl, enl_img.newt, enl_img.neww, enl_img.newh);
        enl_img.steps = 0;
        setTimeout('enl_mkborder("' + enl_imgid + '")', enl_speed);
        setTimeout('enl_darken()', enl_speed * 3);
        setTimeout('enl_makedraggable("' + enl_imgid + '")', enl_speed * 4);
        enl_showbtn(enl_imgid)
    } else {
        if (enl_img.steps == 1) {
            enl_img.src = enl_fullimg;
            enl_img.style.position = 'absolute';
            enl_visible(enl_img);
            enl_hide(enl_geto(enl_img.orig))
        }
        var enl_factor = enl_calcfact(enl_img.steps / enl_maxstep);
        enl_tmpw = Math.round(enl_factor * (enl_img.neww - enl_img.oldw) + enl_img.oldw);
        enl_tmph = Math.round(enl_factor * (enl_img.newh - enl_img.oldh) + enl_img.oldh);
        enl_tmpt = Math.round(enl_img.oldt + (enl_img.newt - enl_img.oldt) * enl_factor);
        enl_tmpl = Math.round(enl_img.oldl + (enl_img.newl - enl_img.oldl) * enl_factor);
        if (enl_tmpw < 0) enl_tmpw = 0;
        if (enl_tmph < 0) enl_tmph = 0;
        enl_setpos(enl_img, enl_tmpl, enl_tmpt, enl_tmpw, enl_tmph);
        setTimeout('enl_doglidein("' + enl_imgid + '")', enl_speed)
    }
}

function enl_donoani(enl_imgid) {
    enl_img = enl_geto(enl_imgid);
    enl_setpos(enl_img, enl_img.newl, enl_img.newt, enl_img.neww, enl_img.newh);
    enl_img.src = enl_fullimg;
    enl_img.style.position = 'absolute';
    enl_visible(enl_img);
    enl_img.steps = 0;
    enl_mkborder(enl_imgid);
    enl_showbtn(enl_imgid);
    enl_darken();
    setTimeout('enl_makedraggable("' + enl_imgid + '")', 80)
}

function enl_dofadein(enl_imgid) {
    enl_brddiv = enl_geto(enl_imgid + "brd");
    enl_img = enl_geto(enl_imgid);
    enl_img.steps++;
    if (enl_img.steps == 1) {
        enl_setpos(enl_img, enl_img.newl, enl_img.newt, enl_img.neww, enl_img.newh);
        enl_setopa(enl_img, 0);
        enl_img.src = enl_fullimg;
        enl_img.style.position = 'absolute';
        enl_visible(enl_img)
    }
    if (enl_img.steps == enl_maxstep) {
        enl_setopa(enl_img, 100);
        enl_img.steps = 0;
        enl_mkborder(enl_imgid);
        enl_showbtn(enl_imgid);
        enl_darken();
        setTimeout('enl_makedraggable("' + enl_imgid + '")', 80)
    } else {
        enl_setopa(enl_img, enl_img.steps / enl_maxstep * 100);
        setTimeout('enl_dofadein("' + enl_imgid + '")', enl_speed)
    }
}

function enl_enable(enl_imgid) {
    enl_img = enl_geto(enl_imgid);
    enl_orig = enl_geto(enl_img.orig);
    if (enl_titlebar) document.body.removeChild(enl_geto(enl_imgid + "btns"));
    document.body.removeChild(enl_geto(enl_imgid + "brd"));
    if (enl_shadow) {
        document.body.removeChild(enl_geto(enl_imgid + "shd1"));
        document.body.removeChild(enl_geto(enl_imgid + "shd2"))
    }
    enl_orig.onclick = function () {
        enlarge(this)
    };
    document.body.removeChild(enl_img)
}

function enl_noaniremove(enl_imgid) {
    enl_hide(enl_geto(enl_imgid));
    setTimeout('enl_enable("' + enl_imgid + '")', 10)
}

function enl_shrink(enl_imgid) {
    enl_img = enl_geto(enl_imgid);
    enl_visible(enl_img);
    enl_geto(enl_img.orig).isenlarged = null;
    enl_img.style.cursor = 'default';
    enl_delborder(enl_imgid);
    if (enl_titlebar) enl_hidebtn(enl_imgid);
    if (enl_dark) enl_nodark();
    enl_keepblack = 0;
    if (!enl_ani) setTimeout('enl_noaniremove("' + enl_imgid + '")', 1);
    else if (enl_ani == 1) setTimeout('enl_dofadeout("' + enl_imgid + '")', 1);
    else setTimeout('enl_doglideout("' + enl_imgid + '")', 1)
}

function enl_dofadeout(enl_imgid) {
    enl_img = enl_geto(enl_imgid);
    enl_mvcnt = 0;
    enl_img.steps++;
    if (enl_img.steps == enl_maxstep) {
        enl_img.steps = 0;
        enl_hide(enl_img);
        setTimeout('enl_enable("' + enl_imgid + '")', 100)
    } else {
        enl_setopa(enl_img, (1 - enl_img.steps / enl_maxstep) * 100);
        setTimeout('enl_dofadeout("' + enl_imgid + '")', enl_speed)
    }
}

function enl_doglideout(enl_imgid) {
    enl_img = enl_geto(enl_imgid);
    enl_mvcnt = 0;
    enl_img.steps++;
    if (enl_img.steps == enl_maxstep) {
        enl_hide(enl_img);
        enl_img.steps = 0;
        enl_visible(enl_geto(enl_img.orig));
        setTimeout('enl_enable("' + enl_imgid + '")', 100)
    } else {
        var enl_factor = enl_calcfact((enl_maxstep - enl_img.steps) / enl_maxstep);
        enl_tmpw = Math.round(enl_factor * (enl_img.neww - enl_img.oldw) + enl_img.oldw);
        enl_tmph = Math.round(enl_factor * (enl_img.newh - enl_img.oldh) + enl_img.oldh);
        enl_tmpt = Math.round(enl_img.oldt + (enl_img.newt - enl_img.oldt) * enl_factor);
        enl_tmpl = Math.round(enl_img.oldl + (enl_img.newl - enl_img.oldl) * enl_factor);
        if (enl_tmpw < 0) enl_tmpw = 0;
        if (enl_tmph < 0) enl_tmph = 0;
        enl_setpos(enl_img, enl_tmpl, enl_tmpt, enl_tmpw, enl_tmph);
        setTimeout('enl_doglideout("' + enl_imgid + '")', enl_speed)
    }
}
enl_addLoad(enl_init);