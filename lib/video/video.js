var videoJs = function(id) {

    var _mouseMoveTimer = null;
    var _currVolume = 1;
    var _currVoiceProgress = 54;

    /**
     * [初始化音频]
     * @param [type] name [description] 
     */
    var ready = function(options) {

        // UI初始化
        var parentDiv = document.createElement("div");
        $('#' + id).wrap('<div class="videojs-layout"></div>');

        $('.videojs-layout').append('<div class="video-play-big-btn"></div>' +
            '<div class="video-barrage"></div>' +
            '<div class="video-control-bar">' +
            // '<section class="video-progress-bar"></section>' +
            '<section class="video-play-btn video-pause"></section>' +
            '<section class="video-volume">' +
            '<div class="video-voice video-voice-on"></div>' +
            '<div class="video-voice-bar">' +
            '<div class="video-voice-progress">' +
            '<div class="video-voice-point"></div>' +
            '</div></div></section > ' +
            '<section class="video-quality">' +
            '<span class="video-curr-quality"></span>' +
            '<div class="video-quality-select"></div></section>' +
            '<section class="video-barrage-btn video-barrage-close"></section>' +
            '<section class="video-fullscreen-btn video-not-fullscreen"></section>' +
            '</div>');


        /** 
         *  全屏控制
         *  requestFullScreen: 展开全屏
         *  exitFull: 关闭全屏
         *  checkFull: 判断全屏状态
         */
        var fullscreen = {
            requestFullScreen: function(element) {
                // 判断各种浏览器，找到正确的方法
                var requestMethod = element.requestFullScreen || //W3C
                    element.webkitRequestFullScreen || //FireFox
                    element.mozRequestFullScreen || //Chrome等
                    element.msRequestFullScreen; //IE11
                if (requestMethod) {
                    requestMethod.call(element);
                } else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
                    var wscript = new ActiveXObject("WScript.Shell");
                    if (wscript !== null) {
                        wscript.SendKeys("{F11}");
                    }
                }

                $('body').css('overflow', 'hidden');
                $('.videojs').addClass('videojs-fullscreen');
                $('.videojs-layout').addClass('videojs-fullscreen');
                $('.video-fullscreen-btn').addClass('video-is-fullscreen');
                $('.video-fullscreen-btn').removeClass('video-not-fullscreen');
            },

            exitFull: function() {
                // 判断各种浏览器，找到正确的方法
                var exitMethod = document.exitFullscreen || //W3C
                    document.mozCancelFullScreen || //FireFox
                    document.webkitExitFullscreen || //Chrome等
                    document.webkitExitFullscreen; //IE11
                if (exitMethod) {
                    exitMethod.call(document);
                } else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
                    var wscript = new ActiveXObject("WScript.Shell");
                    if (wscript !== null) {
                        wscript.SendKeys("{F11}");
                    }
                }

                $('body').css('overflow', 'visible');
                $('.videojs').removeClass('videojs-fullscreen');
                $('.videojs-layout').removeClass('videojs-fullscreen');
                $('.video-fullscreen-btn').addClass('video-not-fullscreen');
                $('.video-fullscreen-btn').removeClass('video-is-fullscreen');
            },

            checkFull: function() {
                var fullscreenElement = document.fullscreenEnabled || document.mozFullscreenElement || document.webkitFullscreenElement;
                if (fullscreenElement == null || fullscreenElement === undefined) {
                    return false;
                } else {
                    return true;
                }
            }
        }

        $('.video-fullscreen-btn').on('click', function() {
            if (fullscreen.checkFull()) {
                fullscreen.exitFull();
            } else {
                fullscreen.requestFullScreen(document.documentElement);
            }
        });

        window.onresize = function() {
            if (!fullscreen.checkFull()) {
                fullscreen.exitFull();
            }
        }



        /** 
         *  播放控制
         *  playVideo: 播放视频
         *  pauseVideo: 暂停视频
         */
        var videoPlay = {
            playVideo: function() {
                document.getElementById(id).play();
                $('.video-play-btn').addClass('video-play');
                $('.video-play-btn').removeClass('video-pause');
            },

            pauseVideo: function() {
                document.getElementById(id).pause();
                $('.video-play-btn').addClass('video-pause');
                $('.video-play-btn').removeClass('video-play');
            }
        }

        $('.video-play-btn').click(function() {
            if (document.getElementById(id).paused) {
                videoPlay.playVideo();
            } else {
                videoPlay.pauseVideo();
            }
        });

        document.getElementById(id).addEventListener('ended', function() {
            videoPlay.pauseVideo();
        });



        /** 
         *  弹幕控制
         *  openBarrage: 开启弹幕
         *  closeBarrage: 关闭弹幕
         *  makeBarrage: 生成弹幕
         */
        var barrage = {
            openBarrage: function() {
                $('.video-barrage').show();
                $('.video-barrage-btn').addClass('video-barrage-open');
                $('.video-barrage-btn').removeClass('video-barrage-close');
            },

            closeBarrage: function() {
                $('.video-barrage').hide();
                $('.video-barrage-btn').addClass('video-barrage-close');
                $('.video-barrage-btn').removeClass('video-barrage-open');
                $('.barrage-word').remove();
            },
        }

        $('.video-barrage-btn').click(function() {
            if ($('.video-barrage').css('display') == 'none') {
                barrage.openBarrage();
            } else {
                barrage.closeBarrage();
            }
        });



        /** 
         *  清晰度控制
         *  changeQuality: 修改清晰度
         *  initQualityList: 初始化清晰度列表
         */
        var quality = {
            changeQuality: function(type, arr, callback) {

            },

            initQualityList: function() {
                var arr = (options && options.qualityArr) || [
                    { name: '超清', value: '1', isVip: true },
                    { name: '高清', value: '2', isVip: true },
                    { name: '标清', value: '3', isVip: false }
                ];

                for (var i = 0; i < arr.length; i++) {
                    $('.video-quality-select').append('<div class="quality-select-item" data="' + arr[i].value + '">' + arr[i].name + '</div>');
                    if (arr[i].isVip) {
                        $('.quality-select-item').addClass('quality-select-vip');
                    }
                }
                $('.video-curr-quality').text(arr[arr.length - 1].name);
            }
        }

        quality.initQualityList();
        $('.video-quality').click(function() {
            $('.video-quality-select').show();
        });

        $(document).click(function(event) {
            var e = e || window.event,
                target = e.target || e.srcElement;
            if ($(target).attr('class') != 'video-quality' && $(target).attr('class') != 'video-curr-quality') {
                $('.video-quality-select').hide();
            } else {
                $('.video-quality-select').show();
            }
        });

        $('.quality-select-item').click(function() {
            var selectValue = $(this).attr('data');
            $('.video-curr-quality').text($(this).text());
            options && options.selectQuality && options.selectQuality(selectValue);
        });



        /** 
         *  声音控制
         *  changeVoice: 改变声音大小
         *  muteVoice: 静音
         *  openVoice: 取消静音
         */
        var voice = {
            changeVoice: function(volume) {
                document.getElementById(id).volume = volume;
            },

            muteVoice: function() {
                document.getElementById(id).muted = true;
                $('.video-voice').addClass('video-voice-off');
                $('.video-voice').removeClass('video-voice-on');
                document.getElementById(id).volume = 0;
                $('.video-voice-progress').width(0);
            },

            openVoice: function() {
                document.getElementById(id).muted = false;
                $('.video-voice').addClass('video-voice-on');
                $('.video-voice').removeClass('video-voice-off');
                document.getElementById(id).volume = _currVolume;
                $('.video-voice-progress').width(_currVoiceProgress);
            }
        }

        $('.video-voice-point').mousedown(function(e) {
            e = e ? e : window.event;
            e.preventDefault()
            var moveXstart = e.pageX;
            var startWidth = $('.video-voice-progress').width();
            $('.video-control-bar').mousemove(function(move) {
                var moveXend = move.pageX;
                var tx = moveXend - moveXstart;
                var adjustWidth = startWidth + tx;
                _currVoiceProgress = adjustWidth <= 0 ? 0 : adjustWidth >= 54 ? 54 : adjustWidth;

                $('.video-voice-progress').width(_currVoiceProgress);
                _currVolume = _currVoiceProgress / $('.video-voice-bar').width();
                voice.changeVoice(_currVolume);
            });

            $(document).mouseup(function(move) {
                $('.video-control-bar').unbind('mousemove');
            });
        });


        $('.video-voice').click(function() {
            document.getElementById(id).muted ? voice.openVoice() : voice.muteVoice();
        });

        $('.video-voice-bar').click(function(e) {
            console.log(e.offsetX);
            _currVoiceProgress = e.offsetX;
            $('.video-voice-progress').width(_currVoiceProgress);
            _currVolume = _currVoiceProgress / $('.video-voice-bar').width();
            voice.changeVoice(_currVolume);
        });



        /** 
         *  工具栏控制
         *  showToolBar: 工具栏显示
         *  hideToolBar: 工具栏隐藏
         */
        var toolBar = {
            showToolBar: function() {
                $('.video-control-bar').show();
            },

            hideToolBar: function() {
                $('.video-control-bar').fadeOut('slow');
            }
        }

        setTimeout(function() {
            toolBar.hideToolBar();
        }, 2500);

        $('.videojs-layout').mousemove(function() {
            toolBar.showToolBar();
            clearTimeout(_mouseMoveTimer);
            _mouseMoveTimer = setTimeout(function() {
                toolBar.hideToolBar();
            }, 2500);
        });
    }

    var setBarrage = function(barrageStr) {
        if ($('.video-barrage').css('display') != 'none') {
            var randomNum = parseInt(Math.random() * 100000, 10);
            $('.video-barrage').append('<p class="barrage-word barrage-word' + randomNum + '">' + barrageStr + '</p>');
            $('.barrage-word' + randomNum).css('top', parseInt(Math.random() * 200, 10) + 'px');
            setTimeout(function() {
                $('.barrage-word' + randomNum).remove();
            }, 17000);
        }
    }

    return {
        ready: function(options) {
            return ready(options);
        },

        setBarrage: function(barrageStr) {
            return setBarrage(barrageStr);
        }
    }
};

window.videoJs = videoJs;