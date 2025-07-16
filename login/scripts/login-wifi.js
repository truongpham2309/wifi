// Save tracking langding before redirect to langding page. Just ajax submit, don't waiting for response
        function SaveTrackingLangdingPage(goto_running_langding_page) {
            var form = new FormData();
            form.append('login_option_used', _login_option_used);
            form.append('tracking_splash_id', _running_tracking_splash_id);
            form.append('campaign_run', _running_campaign_used);
            form.append('campaign_id', _running_campaign_id);
            form.append('LangdingPageID', _running_langding_page_id);
            form.append('LangdingPage', '');
            form.append('userid', _running_user_id);
            form.append('client_mac', _running_client_mac);
            form.append('display_url', goto_running_langding_page);
            form.append('location_id', _running_location_id);
            form.append('login_option', _running_login_option);
            form.append('template_id', _running_template_id);
            form.append('template_version', _running_template_version);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", _running_action_save_tracking_langding_page, true);
            xhr.timeout = 5000;
            xhr.ontimeout = function () {
                GotoLangdingPage(goto_running_langding_page);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    GotoLangdingPage(goto_running_langding_page);
                }
            }
            xhr.send(form);
        }

        /*
            =============
            LOGIN TO WIFI
            =============
        */

        function LoginToWifi() {
            if(_running_action_portal.indexOf("[loginoption]")!=-1){
                _running_action_portal = _running_action_portal.replace("[loginoption]", _login_option_used);
            }
            document.getElementById('for-process-loading').style.display = 'block';
            document.getElementById('for-process-loading-img').style.display = 'block';
            console.log(">> LoginToWifi() đã được gọi và đang chạy");
            // FORM DATA
            if(_running_post_type==_post_type_form){
                var iframe = document.createElement('iframe');
                iframe.id = "framelogin";
                iframe.name = "framelogin";
                iframe.style.width = "0";
                iframe.style.height = "0";
                iframe.onload = function() {
                    try{
                        var form =  window.frames["framelogin"].document.getElementById("loginwifi");
                        form.setAttribute("action",_running_action_portal);
                        var _running_wifi_login_names_len = _running_wifi_login_names.length;
                        for (var i = 0 ; i < _running_wifi_login_names_len ; i++) {
                            var input = document.createElement("input");
                            input.setAttribute("type","hidden");
                            input.setAttribute("name",_running_wifi_login_names[i]);
                            input.setAttribute("value",
                                _running_wifi_login_values[i].indexOf("$")!=-1 ?
                                GetQueryString(_running_wifi_login_values[i].substring(1)) :
                                _running_wifi_login_values[i]
                            );
                            form.appendChild(input);
                        }
                        if(_running_login_option.indexOf('active_directory_users')!=-1){
                            var uid = document.getElementById('for-login-uid')?document.getElementById('for-login-uid').value:'';
                            var pwd = document.getElementById('for-login-pwd')?document.getElementById('for-login-pwd').value:'';
                            var input1 = document.createElement("input");
                            input1.setAttribute("type","hidden");
                            input1.setAttribute("name","auth_user");
                            input1.setAttribute("value",uid);
                            form.appendChild(input1);

                            var input2 = document.createElement("input");
                            input2.setAttribute("type","hidden");
                            input2.setAttribute("name","auth_pass");
                            input2.setAttribute("value",pwd);
                            form.appendChild(input2);
                        }
                        form.submit();
                    }catch(e){
                        console.log(">> LoginToWifi() -> Exeption (có thể không ảnh hưởng hệ thống). Chi tiết:");
                        console.log(e);
                    }
                    try{
                        document.getElementById('for-login-message').innerHTML= "";
                    }catch(e){}
                    _WaitingForIframeSubmit = setTimeout("WaitingForIframeSubmit()",200);
                };
                iframe.src = _running_frame_login;
                document.body.appendChild(iframe);
            }
            // SERVER JSON DATA RAW (ruckus)
            else if(_running_post_type==_post_type_json_raw){
                var _key_len = _running_wifi_login_names.length;
                var _json_raw_data = "{";
                for(var i=0 ; i < _key_len ; i++){
                    if(_json_raw_data!="{") {
                        _json_raw_data += ",";
                    }
                    _json_raw_data += "\"" + _running_wifi_login_names[i] + "\":";

                    var _jsonValue = _running_wifi_login_values[i].indexOf("$")!=-1 ?                                    
                                      GetQueryString(_running_wifi_login_values[i].substring(1)) :
                                      _running_wifi_login_values[i];
                    _json_raw_data += isNaN(_jsonValue) ? ("\"" + _jsonValue + "\"") : _jsonValue;
                }
                _json_raw_data += "}";

                var form = new FormData();
                form.append('data', _json_raw_data);
                form.append('portal', _running_action_portal);
                var xhr = new XMLHttpRequest();
                xhr.open("POST", _running_action_login_wifi, true);
                xhr.timeout = 30000;
                xhr.ontimeout = function () {
                    //alert("Đã chờ quá 30 giây. Hệ thống hiện tại không khả dụng. Vui lòng bấm OK để reload và thử lại.");
                    window.location.reload();
                }
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        // BeforeGotoLangdingPage();
                        _WaitingForIframeSubmit = setTimeout("WaitingForIframeSubmit()",200);
                    }
                }
                xhr.send(form);
            }
            // CLIENT JSON POST
            else if(_running_post_type==_post_type_client_json_post){
                var _key_len = _running_wifi_login_names.length;
                var _json_raw_data = "{";
                for(var i=0 ; i < _key_len ; i++){
                    if(_json_raw_data!="{") {
                        _json_raw_data += ",";
                    }
                    _json_raw_data += "\"" + _running_wifi_login_names[i] + "\":";

                    var _jsonValue = _running_wifi_login_values[i].indexOf("$")!=-1 ?                                    
                                      GetQueryString(_running_wifi_login_values[i].substring(1)) :
                                      _running_wifi_login_values[i];
                    _json_raw_data += isNaN(_jsonValue) ? ("\"" + _jsonValue + "\"") : _jsonValue;
                }
                _json_raw_data += "}";

                var xhr = new XMLHttpRequest();
                xhr.open("POST", _running_action_portal, true);
                xhr.timeout = 30000;
                xhr.ontimeout = function () {
                    //alert("Đã chờ quá 30 giây. Hệ thống hiện tại không khả dụng. Vui lòng bấm OK để reload và thử lại.");
                    window.location.reload();
                }
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        // BeforeGotoLangdingPage();
                        _WaitingForIframeSubmit = setTimeout("WaitingForIframeSubmit()",200);
                    }
                }
                xhr.send(_json_raw_data);
            }
            // THIRD PARTY URL (openmesh)
            else if(_running_post_type==_post_type_third_party_url){
                var iframe = document.createElement('iframe');
                iframe.name = "framelogin";
                iframe.style.width = "0";
                iframe.style.height = "0";
                iframe.onload = function() {
                };
                iframe.src = _running_openmesh_login;
                document.body.appendChild(iframe);
                _WaitingForIframeSubmit = setTimeout("WaitingForIframeSubmit()",200);
            }
            // GET
            else if(_running_post_type=='4'){
                var iframe = document.createElement('iframe');
                iframe.name = "framelogin";
                iframe.style.width = "0";
                iframe.style.height = "0";
                iframe.onload = function() {
                    _WaitingForIframeSubmit = setTimeout("WaitingForIframeSubmit()",200);
                };
                iframe.src = _running_action_portal;
                document.body.appendChild(iframe);
            }
            // Directly Post
            else if(_running_post_type=='5'){
                var _formLogin = document.createElement('form');
                _formLogin.setAttribute('id','LOGINFORMPOST');
                _formLogin.setAttribute('method','POST');
                _formLogin.setAttribute('action',_running_action_portal);
                _formLogin.setAttribute('style','width:0px;height:0px;position:absolute;z-index:-1;opacity:0');
                var _running_wifi_login_names_len = _running_wifi_login_names.length;
                for (var i = 0 ; i < _running_wifi_login_names_len ; i++) {
                    var _el = document.createElement('input');
                    _el.setAttribute('name',_running_wifi_login_names[i]);
                    _el.setAttribute('value', _running_wifi_login_values[i].indexOf("$")!=-1 ? GetQueryString(_running_wifi_login_values[i].substring(1)) :_running_wifi_login_values[i]);
                    _formLogin.appendChild(_el);
                }
                document.body.appendChild(_formLogin);
                $('#LOGINFORMPOST').submit();
            }
            // Directly Ajax Raw post
            else if(_running_post_type=='6'){
                var rawContent = "";
                var _running_wifi_login_names_len = _running_wifi_login_names.length;
                for (var i = 0 ; i < _running_wifi_login_names_len ; i++) {
                    if(rawContent != '') rawContent +='&';
                    rawContent += _running_wifi_login_names[i] + '=' + (_running_wifi_login_values[i].indexOf("$")!=-1 ? GetQueryString(_running_wifi_login_values[i].substring(1)) :_running_wifi_login_values[i]);
                }

                var http = new XMLHttpRequest();                
                http.open("POST", _running_action_portal, true);
                http.setRequestHeader('Content-Type', 'application/json');
                http.timeout = 30000;
                http.ontimeout = function () {}
                http.onreadystatechange = function () {
                    if (http.readyState == 4 && http.status == 200) {}
                }
                http.send(rawContent);
                _WaitingForIframeSubmit = setTimeout("WaitingForIframeSubmit()",200);
            }
            else{
                console.log(">> Error >> LoginToWifi() >> Hiện tại chỉ hỗ trợ _running_post_type=1,2,3,4,5 >> Hiện tại: "+_running_post_type);
            }
            document.getElementById('for-process-loading').style.display = 'block';
            document.getElementById('for-process-loading-img').style.display = 'block';
        }

        var ReTryLoginC = 0;
        function ReLoginToWifi(){
            ReTryLoginC++;
            var f_id = "framelogin"  + ReTryLoginC;
            var iframe = document.createElement('iframe');
            iframe.id = f_id;
            iframe.name = f_id;
            iframe.style.width = "0";
            iframe.style.height = "0";
            iframe.onload = function() {
                try{
                    var form =  window.frames[f_id].document.getElementById("loginwifi");
                    form.setAttribute("action",_running_action_portal);
                    var _running_wifi_login_names_len = _running_wifi_login_names.length;
                    for (var i = 0 ; i < _running_wifi_login_names_len ; i++) {
                        var input = document.createElement("input");
                        input.setAttribute("type","hidden");
                        input.setAttribute("name",_running_wifi_login_names[i]);
                        input.setAttribute("value",
                            _running_wifi_login_values[i].indexOf("$")!=-1 ?
                            GetQueryString(_running_wifi_login_values[i].substring(1)) :
                            _running_wifi_login_values[i]
                        );
                        form.appendChild(input);
                    }
                    if(_running_login_option.indexOf('active_directory_users')!=-1){
                        var uid = document.getElementById('for-login-uid')?document.getElementById('for-login-uid').value:'';
                        var pwd = document.getElementById('for-login-pwd')?document.getElementById('for-login-pwd').value:'';
                        var input1 = document.createElement("input");
                        input1.setAttribute("type","hidden");
                        input1.setAttribute("name","auth_user");
                        input1.setAttribute("value",uid);
                        form.appendChild(input1);

                        var input2 = document.createElement("input");
                        input2.setAttribute("type","hidden");
                        input2.setAttribute("name","auth_pass");
                        input2.setAttribute("value",pwd);
                        form.appendChild(input2);
                    }
                    form.submit();
                }catch(e){
                    console.log(">> LoginToWifi() -> Exeption (có thể không ảnh hưởng hệ thống). Chi tiết:");
                    console.log(e);
                }
            };
            iframe.src = _running_frame_login;
            document.body.appendChild(iframe);
        }


        /*
            =========================
            REDIRECT TO LANGDING PAGE
            =========================
        */

        // Waiting for iframe submit
        var _WaitingForIframeSubmitFinished = false;
        var _WaitingForIframeSubmit;
        var _WaitingForIframeSubmitCount = 0;
        function WaitingForIframeSubmit(){
            clearTimeout(_WaitingForIframeSubmit);
            _WaitingForIframeSubmitCount++;
            /* Kiểm tra internet */
            URLReachable();
        }
        function URLReachable() {
            console.log(">> Bất đầu kiểm tra INTERNET lần "+_WaitingForIframeSubmitCount);
            var _testIT = new Image();
            _testIT.id ="testIT";
            _testIT.onerror = function(){
                if(_WaitingForIframeSubmitCount==30){
                    SplashError();
                    $('#for-process-loading-img').html('<p style="margin:0 auto;width:90%;max-width:400px;font-size:15px;line-height:1.5">Kết nối internet không thành công. Vui lòng bấm OK và thử lại hoặc liên hệ quản lý. (Unable to connect to internet, please click OK and try again or contact manager.)</p>');
                }else{
                    try{ReLoginToWifi();}catch(e){}
                    setTimeout("WaitingForIframeSubmit()",1000);
                }
            };
            _testIT.onload = function(){
                if(!_WaitingForIframeSubmitFinished){
                    _WaitingForIframeSubmitFinished = true;
                    console.log(">> INTERNET ĐÃ THÔNG ! Chuẩn bị sang LangdingPage");
                    $('#loginok').css('display','block');
                    BeforeGotoLangdingPage();
                }
            };       
            if(_WaitingForIframeSubmitCount % 3 == 0){
                _testIT.src = "https://checkinternet.vntik.com/vnwifilogo.png?rand=" + Math.floor((1 + Math.random()) * 0x10000);
            }
            else if(_WaitingForIframeSubmitCount % 3 == 1){
                _testIT.src = "https://kenh14cdn.com/web_images/sprite-k14.20.png?rand=" + Math.floor((1 + Math.random()) * 0x10000);
            }            
            else{
                _testIT.src = "https://s1.vnecdn.net/vnexpress/restruct/i/v443/v2_2019/pc/graphics/logo.svg?rand=" + Math.floor((1 + Math.random()) * 0x10000);
            }
        }

        // Lỗi trang chào
        function SplashError(){
            var form = new FormData();
            form.append('tracking_splash_id', _running_tracking_splash_id);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", _running_action_save_error, true);
            xhr.timeout = 5000;
            xhr.ontimeout = function () {}
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    console.log("Đã lưu login lỗi trang chào!");
                }
            }
            xhr.send(form);
        }

        // Before redirect to langding page
        function BeforeGotoLangdingPage() {
            console.log(">> Tracking trước khi sang LangdingPage");
            SaveTrackingLangdingPage(_running_langding_page);
        }

        // Rediect to langding page
        function GotoLangdingPage(goto_running_langding_page){
            if(_running_langding_page_tracking=='0'){
                var _url_to_go = '';
                if(window.location.href.indexOf("wifi_landing_redirect")!=-1){
                    var _wifi_landing_redirect = GetQueryString("wifi_landing_redirect");
                    if(_wifi_landing_redirect.length>0){
                        _url_to_go =  _wifi_landing_redirect;
                    }
                    else{
                        _url_to_go = goto_running_langding_page;
                    }
                }
                else{
                    _url_to_go = goto_running_langding_page;
                }
                if(_url_to_go!='#' && _url_to_go!=''){
                    console.log(">> Gọi chuyển hướng LangdingPage: " + _url_to_go);
                    try{
                        document.body.innerHTML = "";
                    } catch(er){}
                    top.location = _url_to_go;
                }else{
                    console.log(">> Đã kết thúc với tùy chọn KHÔNG CHUYỂN HƯỚNG.");
                }
            }else{
                window.location = _running_action_tracking_script;
            }
        }    