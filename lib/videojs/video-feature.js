var _barrageList = [];
var _barrageTimer = null;

var myVideoJs = function(id) {
    var _videoQualityArr = [];


    /**
     * [初始化视频]
     * @param [type] name [description] 
     */
    var ready = function(options) {

        $('.video-js').append('<div class="video-barrage"></div>');
        $('.vjs-control-bar').prepend('<section class="video-barrage-control"><span>弹幕</span><div class="video-barrage-btn video-barrage-close"></div></section>');
        $('.vjs-control-bar').prepend('<section class="video-quality"><span class="video-curr-quality"></span><div class="video-quality-select"></div></section>');
        $('.vjs-loading-spinner').append('<div class="video-loading"><i></i><i></i><i></i></div>');
        $('.vjs-control-text').text('视频加载中...');


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
                localStorage.setItem('isOpenBarrage', 'open');
                showBarrage();
            },

            closeBarrage: function() {
                $('.video-barrage').hide();
                $('.video-barrage-btn').addClass('video-barrage-close');
                $('.video-barrage-btn').removeClass('video-barrage-open');
                $('.barrage-word').remove();
                localStorage.setItem('isOpenBarrage', 'close');
            }
        }

        if (options.isOpenBarrage == 'open') {
            barrage.openBarrage();
        } else {
            barrage.closeBarrage();
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
            changeQuality: function(text, value) {
                var itemIsVip = false;
                for (var i = 0; i < _videoQualityArr.length; i++) {
                    if (value == _videoQualityArr[i].value) {
                        itemIsVip = _videoQualityArr[i].isVip;
                    }
                }
                if ((options.userIsVip && itemIsVip) || !itemIsVip) {
                    $('.video-curr-quality').text(text);
                    options && options.selectQuality && options.selectQuality(value);
                    localStorage.setItem('defaultQuality', value);
                } else {
                    options.selectQuality(-1);
                }
            },

            initQualityList: function() {
                _videoQualityArr = (options && options.qualityArr) || [
                    { name: '超清', value: '1', isVip: true },
                    { name: '高清', value: '2', isVip: true },
                    { name: '标清', value: '3', isVip: false }
                ];

                var defaultQuality = _videoQualityArr[_videoQualityArr.length - 1];

                for (var i = 0; i < _videoQualityArr.length; i++) {
                    $('.video-quality-select').append('<div class="quality-select-item" data="' + _videoQualityArr[i].value + '">' + _videoQualityArr[i].name + '</div>');
                    if (_videoQualityArr[i].isVip) {
                        $('.quality-select-item').addClass('quality-select-vip');
                    }

                    if (_videoQualityArr[i].default) {
                        defaultQuality = _videoQualityArr[i];
                    }
                }

                $('.video-curr-quality').text(defaultQuality.name);
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
            quality.changeQuality($(this).text(), $(this).attr('data'));
        });
    }

    var showBarrage = function() {
        if (_barrageTimer) {
            return;
        }
        _barrageTimer = setInterval(function() {
            if (_barrageList.length <= 0) {
                clearInterval(_barrageTimer);
                _barrageTimer = null;
                return;
            }
            var barrageStr = _barrageList.shift();
            if ($('.video-barrage').css('display') != 'none') {
                var randomNum = parseInt(Math.random() * 100000, 10);
                $('.video-barrage').append('<p class="barrage-word barrage-word' + randomNum + '">' + barrageStr + '</p>');
                $('.barrage-word' + randomNum).css('top', parseInt(Math.random() * 460, 10) + 'px');
                var animateTimer = setTimeout(function() {
                    $('.barrage-word' + randomNum).remove();
                    clearTimeout(animateTimer);
                }, 17000);
            }
        }, 1000);
    }

    var setBarrage = function(barrageStr) {
        _barrageList.push(barrageStr);
        if (!_barrageTimer) {
            showBarrage();
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

window.myVideoJs = myVideoJs;