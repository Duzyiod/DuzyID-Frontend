/**********************************************************************************
 *
 * Duzy iOD, LLC CONFIDENTIAL
 * __________________
 *
 * Copyright Duzy iOD, LLC. All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property
 * of Duzy iOD, LLC unless otherwise noted.
 *
 * The intellectual and technical concepts contained herein are proprietary
 * to Duzy iOD, LLC and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 *
 * Dissemination of this information or reproduction of this material is strictly
 * forbidden unless prior written permission is obtained from Duzy iOD, LLC.
 * This file is subject to the full terms and conditions defined
 *
 * ***********************************************************************************
 * System Component: Duzy ID
 * Module Name: Duzy ID
 * Original Author: Andrii Sokoltsov
 *
 * Description: DuzyID FrontEnd code to enable Duzy products and checkout functionality over video player.
 *
 ************************************************************************ */

'use strict';

var DUZYID_API_VERSION = '';
var DUZYID_API_URL = 'http://codeit.pro/sokoltsov/' + DUZYID_API_VERSION + 'duzy-id-data/';
var ANIMATION_DELAY = '500';
var ERROR_MSG = 'Something went wrong please try again';

function DuzyID(ecommerceEl, buttonEl) {
    this._buttonWrapper = buttonEl || ecommerceEl;
    this._ecommerceWrapper = ecommerceEl;
    this._subscribers = {};
    this._onReady = false;
}

DuzyID.prototype.load = function (queryParams, callback) {
    if(this._onReady){ return }

    callback(this);
    $trigger.call(this, 'onBeforeLoad');
    load.call(this, queryParams);
};

DuzyID.prototype.start = function() {
    if(this._onReady){ return }

    $trigger.call(this, 'onBeforeStart');

    window.addEventListener('message', ecommerceEvents.bind(this), false);

    createECommerce.call(this);

    this._button.addEventListener('click', this.show.bind(this), false);
};

DuzyID.prototype.show = function() {
    if(!this._onReady){ return }

    $trigger.call(this, 'onBeforeShow');
    this._eCommerce.style.right = '0';

    var _this = this;
    setTimeout(function() {
        $trigger.call(_this, 'onAfterShow');
    }, ANIMATION_DELAY);
};

DuzyID.prototype.hide = function() {
    if(!this._onReady){ return }

    $trigger.call(this, 'onBeforeHide');

    this._eCommerce.style.right = '-105%';

    var _this = this;
    setTimeout(function() {
        $trigger.call(_this, 'onAfterHide');
    }, ANIMATION_DELAY);
};

DuzyID.prototype.subscribe = function(event, handler) {
    if (!this._subscribers[event]) {
        this._subscribers[event] = [];
    }
    this._subscribers[event].push({callback: handler});
};

DuzyID.prototype.unsubscribe = function(event, handler) {
    var eventSubscribers = this._subscribers[event];
    if (!Array.isArray(eventSubscribers)) return;

    this._subscribers[event] = eventSubscribers.filter(function (subscriber) {
        return handler !== subscriber.callback;
    });
};

DuzyID.prototype.unsubscribeAll = function() {
    this._subscribers = {};
};


/* Utils */
function load(queryParams) {
    var _this = this,
        http = new XMLHttpRequest();

    http.open('POST', DUZYID_API_URL, true);
    http.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    http.onload = function() {
        if(http.readyState === 4) {
            if(http.status === 200) {
                try {
                    _this._duzyIdData = JSON.parse(http.responseText);
                    $trigger.call(_this, 'onSuccessLoaded');
                } catch(e) {
                    $trigger.call(_this, 'onErrorLoaded', ERROR_MSG);
                }
            } else {
                $trigger.call(_this, 'onErrorLoaded', http.statusText ? http.statusText : ERROR_MSG);
            }
        }
    };
    http.onerror = function() {
        $trigger.call(this, 'onErrorLoaded', http.statusText ? http.statusText : ERROR_MSG);
    };

    http.send(JSON.stringify(queryParams));

}

function createElementInEl(parent, tagName, id, className) {
    var nEl = document.createElement(tagName);
    if (id) nEl.id = id;
    if (className) nEl.className = className;

    if(parent && (parent instanceof HTMLElement)) {
        parent.appendChild(nEl);
    }
    return nEl;
}

function createIframe(parent, url) {
    var nEl = document.createElement('iframe');
    nEl.src = url || 'about:blank';
    nEl.marginWidth = '0';
    nEl.marginHeight = '0';
    nEl.frameBorder = '0';
    nEl.width = '100%';
    nEl.height = '100%';

    nEl.setAttribute('scrolling','no');

    return nEl;
}

function ecommerceEvents(event) {
    if(event.data && event.data.type && event.data.event === 'DUZY_ID') {
        switch (event.data.type) {
            case 'ready':
                this._onReady = true;
                $trigger.call(this, 'onAfterStart');
                break;
            case 'hide':
                this.hide();
                break;
        }
    }
}

function createECommerce() {
    if(this._duzyIdData && this._duzyIdData.ecommerce && this._duzyIdData.button) {
        createECommerceBtn.call(this);
        createECommerceIframe.call(this);
    }
}

function createECommerceBtn() {
    var button = createElementInEl(this._buttonWrapper, 'button'),
        btnImage = createElementInEl(button, 'img');

    this._button = setDuzyIdBtnStyle(button, btnImage, this._duzyIdData.button.src);
}

function createECommerceIframe() {
    var eCommerceWrap = createElementInEl(this._ecommerceWrapper, 'div', null, 'eCommerceWrapper'),
        iframe = createIframe(eCommerceWrap, this._duzyIdData.ecommerce.src);

    eCommerceWrap.appendChild(iframe);
    this._eCommerce = setDuzyIdECommerceStyle(eCommerceWrap);
}

function setDuzyIdBtnStyle (btn, img, imgSrc) {
    btn.style.position = 'absolute';
    btn.style.top = '10px';
    btn.style.right = '10px';
    btn.style.outline = 'none';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.width = '130px';
    btn.style.height = '40px';
    btn.style.cursor = 'pointer';

    img.setAttribute('src', imgSrc);
    img.style.border = 'none';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.display = 'block';

    return btn;
}

function setDuzyIdECommerceStyle (eCommerceWrap) {
    eCommerceWrap.style.position = 'absolute';
    eCommerceWrap.style.right = '-105%';
    eCommerceWrap.style.top = '0';
    eCommerceWrap.style.width = '100%';
    eCommerceWrap.style.height = '100%';
    eCommerceWrap.style.transition = 'all ' + ANIMATION_DELAY + 'ms linear';

    return eCommerceWrap;
}

function $trigger(event, msg) {
    var subscribers = this._subscribers[event] || [];
    subscribers.forEach(function(handlers) {
        handlers.callback(msg);
    });
}
