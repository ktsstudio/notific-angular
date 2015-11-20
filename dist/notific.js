/*! 
* notific - v0.0.2 - 2015-11-20
* https://github.com/gbiryukov/notific-angular
* Copyright (c) 2015 George Biryukov
* Licensed MIT 
*/

angular.module('notific', [])
.factory('notific',['$timeout',
    function($timeout){
        'use strict';

        var notific = {
            _guid: 0,
            _scope: {},
            _default: {
                title: 'Notification',
                text: '',
                type: 'default',
                timeout: false
            },
            _params: {
                css: {
                    body:           'body',
                    top:            'notific_top',
                    bottom:         'notific_bottom',

                    notification:   'notific__alert',
                    default:        'notific__alert_info',
                    error:          'notific__alert_danger',
                    success:        'notific__alert_success',
                    warning:        'notific__alert_warning',

                    close:          'notific__close'
                },
                width: 360,
                position: 'bottom',
                bootstrap: false
            },
            _types: {
                default: true,
                error: true,
                success: true,
                warning: true
            },
            _verifyNotificationType: function (type) {
                if (!this._types.hasOwnProperty(type)) {
                    return 'default';
                } else {
                    return type;
                }
            },
            _scrollToBottom: function () {
                var container = document.getElementById('notific');
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            },
            _styleBootstrap: function () {
                this.config({
                    css: {
                        notification: 'alert',
                        default:      'alert-info',
                        error:        'alert-danger',
                        success:      'alert-success',
                        warning:      'alert-warning',
                        close:        'close'
                    }
                });
            },
            config: function(params){
                this._extendDeep(this._params, params);
                this._scope.position = this._params.position;
            },
            show: function (opts) {

                if (this._params.bootstrap) {
                    this._styleBootstrap();
                }

                var notification = {};
                this._extendDeep(notification, this._default, opts);

                notification.type = this._verifyNotificationType(notification.type);
                notification.id = this._guid++;

                this._scope.notifications.push(notification);

                if (notification.timeout) {
                    var self = this;
                    $timeout(function () {
                        self.close(notification);
                    }, notification.timeout);
                }

                return notification;
            },
            _extendDeep: function(dst) {
                var self = this;

                angular.forEach(arguments, function(obj) {
                    if (obj !== dst) {
                        angular.forEach(obj, function(value, key) {
                            if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                                self._extendDeep(dst[key], value);
                            } else {
                                dst[key] = value;
                            }
                        });
                    }
                });
                return dst;
            },
            _setContainerScope: function(scope){
                this._scope = scope;
                this.config({});
            },
            error: function (opts) {
                return this.show(this._extendDeep(opts, {type: 'error'}));
            },
            success: function (opts) {
                return this.show(this._extendDeep(opts, {type: 'success'}));
            },
            warning: function (opts) {
                return this.show(this._extendDeep(opts, {type: 'warning'}));
            },
            close: function (notification) {
                for (var i in this._scope.notifications){
                    if (this._scope.notifications[i].id === notification.id) {
                        this._scope.notifications.splice(i, 1);
                        return;
                    }
                }
            }
        };

        return notific;
    }
])
.directive('notifications',['notific', function(notific){
    'use strict';

    return {
        restrict: 'AE',
        /* jshint multistr: true */
        template:  '<div id="notific" class="notific" ng-class="getPosition()" ng-style="getWidth()"> \
                        <div ng-repeat="notific in notifications" ng-class="getType(notific)" on-finish-render="scroll"> \
                            <button type="button" ng-class="getCloseClass(notific)" ng-click="dismiss(notific)">×</button> \
                            <h4 class="notific__title">{{notific.title}}</h4> \
                            <p class="notific__text">{{notific.text}}</p> \
                        </div> \
                    </div>',
        compile: function CompilingFunction() {

            //$templateElement.replaceWith(this.template);

            return function LinkingFunction(scope) {
                scope.notifications = [];

                scope.dismiss = function(notification){
                    notific.close(notification);
                };

                scope.getPosition = function(){
                    return notific._params.css[notific._params.position];
                };

                scope.getCloseClass = function(){
                    return notific._params.css.close;
                };

                scope.getType = function(notification){
                    return notific._params.css.notification + ' ' + notific._params.css[notification.type];
                };

                scope.getWidth = function(){
                    return {width: notific._params.width + 'px'};
                };

                scope.$on('scroll', function(){
                    notific._scrollToBottom();
                });

                notific._setContainerScope(scope);
            };
        }
    };
}])
.directive('onFinishRender', function ($timeout) {
    'use strict';

    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    };
});
