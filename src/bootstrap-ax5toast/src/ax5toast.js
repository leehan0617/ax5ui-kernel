// ax5.ui.toast
(function (root, _SUPER_) {
    
    /**
     * @class ax5.ui.toast
     * @classdesc
     * @version v0.0.1
     * @author tom@axisj.com
     * @logs
     * 2014-06-17 tom : 시작
     * @example
     * ```
     * var my_toast = new ax5.ui.toast();
     * ```
     */
    
    var U = ax5.util;
    
    //== UI Class
    var axClass = function () {
        var
            self = this,
            cfg;
        
        // 클래스 생성자
        this.main = (function () {
            if (_SUPER_) _SUPER_.call(this); // 부모호출
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
                theme: 'default',
                width: 300,
                icon: '',
                msg: '',
                lang: {
                    "ok": "ok", "cancel": "cancel"
                },
                displayTime: 3000,
                animateTime: 200
            };
        }).apply(this, arguments);
        
        this.toastContainer = null;
        this.queue = [];
        cfg = this.config;
        
        /**
         * Preferences of toast UI
         * @method ax5.ui.toast.set_config
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.toast}
         * @example
         * ```
         * ```
         */
            //== class body start
        this.init = function () {
            // after set_config();
            var containerId = ax5.getGuid();
            jQuery(document.body).append('<div class="ax5-ui-toast-container" data-toast-container="' +
                '' + containerId + '"></div>');
            this.toastContainer = jQuery('[data-toast-container="' + containerId + '"]');
        };
        
        this.push = function (opts, callBack) {
            if (U.isString(opts)) {
                opts = {
                    title: cfg.title,
                    msg: opts
                }
            }
            opts.toastType = "push";

            self.dialogConfig = {};
            jQuery.extend(true, self.dialogConfig, cfg);
            jQuery.extend(true, self.dialogConfig, opts);
            opts = self.dialogConfig;

            this.open(opts, callBack);
            return this;
        };
        
        this.confirm = function (opts, callBack) {
            if (U.isString(opts)) {
                opts = {
                    title: cfg.title,
                    msg: opts
                }
            }
            opts.toastType = "confirm";

            self.dialogConfig = {};
            jQuery.extend(true, self.dialogConfig, cfg);
            jQuery.extend(true, self.dialogConfig, opts);
            opts = self.dialogConfig;

            if (typeof opts.btns === "undefined") {
                opts.btns = {
                    ok: {label: cfg.lang["ok"], theme: opts.theme}
                };
            }
            this.open(opts, callBack);
            return this;
        };
        
        this.getContent = function (toastId, opts) {
            var po = [];
            po.push('<div id="' + toastId + '" data-ax5-ui="toast" class="ax5-ui-toast ' + opts.theme + '">');
            po.push('<div class="ax-toast-icon">');
            po.push((opts.icon || cfg.icon || ""));
            po.push('</div>');
            po.push('<div class="ax-toast-body">');
            po.push((opts.msg || cfg.msg || "").replace(/\n/g, "<br/>"));
            po.push('</div>');

            if (opts.btns) {
                po.push('<div class="ax-toast-buttons">');
                po.push('<div class="ax-button-wrap">');
                U.each(opts.btns, function (k, v) {
                    po.push('<button type="button" data-ax-toast-btn="' + k + '" class="btn btn-' + (this.theme||"default") + '">' + this.label + '</button>');
                });
                po.push('</div>');
                po.push('</div>');
            }
            
            po.push('<div style="clear:both;"></div>');
            po.push('</div>');
            return po.join('');
        };
        
        this.open = function (opts, callBack) {
            var
                toastBox;
            
            opts.id = 'ax5-toast-' + this.queue.length;
            box = {
                width: opts.width || cfg.width
            };
            this.toastContainer.prepend(this.getContent(opts.id, opts));
            toastBox = jQuery('#' + opts.id);
            toastBox.css({width: box.width});
            opts.toastBox = toastBox;
            this.queue.push(opts);
            
            if (opts.toastType === "push") {
                // 자동 제거 타이머 시작
                setTimeout((function () {
                    this.close(opts, toastBox, callBack);
                }).bind(this), cfg.displayTime);
            }
            else if (opts.toastType === "confirm") {
                toastBox.find("[data-ax-toast-btn]").on(cfg.clickEventName, (function (e) {
                    this.btnOnClick(e || window.event, opts, toastBox, callBack);
                }).bind(this));
            }

            // bind key event
            jQuery(window).bind("keydown.ax-toast", (function (e) {
                this.onKeyup(e || window.event, opts, callBack);
            }).bind(this));
        };
        
        this.btnOnClick = function (e, opts, toastBox, callBack, target, k) {

            target = U.findParentNode(e.target, function (target) {
                if (target.getAttribute("data-ax-toast-btn")) {
                    return true;
                }
            });

            if (target) {
                k = target.getAttribute("data-ax-toast-btn");

                var that = {
                    key: k, value: opts.btns[k],
                    toastId: opts.id,
                    btn_target: target
                };
                
                if (opts.btns[k].onClick) {
                    opts.btns[k].onClick.call(that, k);
                }
                else if (opts.toastType === "confirm") {
                    if (callBack) callBack.call(that, k);
                    this.close(opts, toastBox);
                }
            }
        };
        
        // todo : confirm 타입 토스트일 때 키보드 이벤트 추가 할 수 있음.
        this.onKeyup = function (e, opts, callBack, target, k) {
            if (e.keyCode == ax5.info.event_keys.ESC) {
                this.close();
            }
        };
        
        /**
         * close the toast
         * @method ax5.ui.toast.close
         * @returns {ax5.ui.toast}
         * @example
         * ```
         * my_toast.close();
         * ```
         */
        this.close = function (opts, toastBox, callBack) {
            if (typeof toastBox === "undefined") {
                opts = U.last(this.queue);
                toastBox = opts.toastBox;
            }
            var that = {
                toastId: opts.id
            };

            jQuery(window).unbind("keydown.ax-toast");

            toastBox.addClass( (opts.toastType == "push") ? "removed" : "destroy" );
            this.queue = U.filter(this.queue, function () {
                return opts.id != this.id;
            });
            setTimeout(function () {
                toastBox.remove();
                if (callBack) callBack.call(that);

                if (opts && opts.onStateChanged) {
                    that = {
                        state: "close",
                        toastId: that.toastId
                    };
                    opts.onStateChanged.call(that, that);
                }
            }, cfg.animateTime);
            return this;
        }
    };
    //== UI Class
    
    //== ui class 공통 처리 구문
    if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
    root.toast = axClass; // ax5.ui에 연결
    //== ui class 공통 처리 구문
    
})(ax5.ui, ax5.ui.root);