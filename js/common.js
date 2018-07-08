/**
 *   Author zhuhuishao
 *   Name commonValidate
 *   
 *   功能： 配置全局的表单校验,用于校验非空, 电话，邮箱等
 *   描述： --------------------------------------------
 */
var commonValidate = function() {

    var inputValidate = function() {
        var inputList = $('input');
        var validateResult = {
            status: true,
            message: ''
        }

        $.each(inputList, function() {
            // 校验是否为空
            if ($(this).attr('name') == 'required') {
                if ($(this).val() == '') {
                    validateResult.status = false;
                    validateResult.message = $(this).attr('data') + '不能为空';
                    return false;
                }
            }
        });

        return validateResult;
    }

    return {
        inputValidate: function() {
            return inputValidate();
        }
    }
}();





/**
 *   Author zhuhuishao
 *   Name commonPlugins
 *   
 *   功能： 提供全局公共组件 包括Modal Select Button 等
 *   描述： --------------------------------------------
 */
var commonPlugins = function() {

    /**
     * [展开Modal对话框]
     * @param [string] id [modal id]
     * @return [type] name [desc]
     */
    var showModal = function(id, obj) {
        var modalElement = document.getElementById(id);
        if (modalElement && $(modalElement).attr('class') == 'modal') {
            var top = $(modalElement).attr('top') || 100;

            $('body').css('overflow', 'hidden').append('<div class="modal-container"></div>');
            $('.modal-container').append('<div class="modal-content" style="top: ' + top + 'px"></div>');
            $('.modal-content').append('<div class="modal-body"></div>');
            $('.modal-body').append($('#' + id).html());
            $('.modal-body').fadeIn('fast');

            $('.modal-container').click(function(event) {
                var e = e || window.event,
                    target = e.target || e.srcElement;

                if ($(target).attr('class') == 'modal-content' || $(target).attr('class') == 'modal-container') {
                    closeModal();
                }
            });

            if (obj && obj.onOk) {
                $('.onok').on('click', function() {
                    obj.onOk();
                })
            }

            if (obj && obj.onCancel) {
                $('.oncancel').on('click', function() {
                    obj.onCancel();
                })
            }
        }
    }


    /**
     * [关闭Modal对话框]
     * @param [type] name [desc]
     * @return [type] name [desc]
     */
    var closeModal = function() {
        $('body').css('overflow', 'visible').find('.modal-container').remove();
    }


    /**
     * [展开Modal对话框]
     * @param [string] id [modal id]
     * @return [type] name [desc]
     */
    var alertModal = function(obj) {
        var top = obj.top || 150;
        $('body').css('overflow', 'hidden').append('<div class="alert-container"></div>');
        $('.alert-container').append('<div class="alert-content" style="top: ' + top + 'px"></div>');
        $('.alert-content').append('<div class="alert-header"><span>' + (obj.title || '提示') + '</span><a class="alert-close-btn"></a></div>');
        $('.alert-content').append('<div class="alert-body"></div>');
        $('.alert-content').append('<div class="alert-footer"><a class="alert-ok-btn">' + (obj.okTitle || '我知道了') + '</a></div>');
        $('.alert-body').append(obj.template || '');
        $('.alert-content').fadeIn('fast');

        $('.alert-close-btn').on('click', function() {
            closeAlertModal();
        });

        $('.alert-ok-btn').on('click', function() {
            closeAlertModal();
            if (obj && obj.onOk) {
                obj.onOk();
            }
        });
    }


    /**
     * [关闭Modal对话框]
     * @param [type] name [desc]
     * @return [type] name [desc]
     */
    var closeAlertModal = function() {
        $('body').css('overflow', 'visible').find('.alert-container').remove();
    }



    return {
        showModal: function(id, obj) {
            return showModal(id, obj);
        },
        closeModal: function() {
            return closeModal();
        },
        alertModal: function(id, obj) {
            return alertModal(id, obj);
        },
        closeAlertModal: function() {
            return closeAlertModal();
        }
    }
}();