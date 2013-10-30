$(document).ready(function() {
if (window.app == undefined) {
        window.app = { };
} else {
        window.app.destruct();
        window.app = { };
}

window.app = $.extend(window.app, {
        ttObj: null,
        
        dj: function() {
                window.app.socket({
                        api: 'room.add_dj',
                        roomid: window.app.ttObj.roomId
                });
        },
        
        listener: function(d) {
                if (d.command == 'speak') {
                        if (d.text == 'GO! SPOTS ARE AVAILABLE TO GRAB! FIGHT TO THE DEATH!' && d.userid == '50e6f02aaaa5cd33869945cb') {
                                window.app.dj();
                                window.app.destruct();
                        }
                        return;
                }
                if (d.command == 'rem_dj') {
                        //if (!d.user[0].userid == turntable.user.id) {
                                window.app.dj();
                                window.app.destruct();
                        //}
                }
        },
        socket: function (c, a) {
                if (c.api == "room.now") {
                        return;
                }
                c.msgid = turntable.messageId;
                turntable.messageId += 1;
                c.clientid = turntable.clientId;
                if (turntable.user.id && !c.userid) {
                        c.userid = turntable.user.id;
                        c.userauth = turntable.user.auth;
                }
                var d = JSON.stringify(c);
                if (turntable.socketVerbose) {
                        LOG(util.nowStr() + " Preparing message " + d);
                }
                var b = $.Deferred();
                turntable.whenSocketConnected(function () {
                        if (turntable.socketVerbose) {
                                LOG(util.nowStr() + " Sending message " + c.msgid + " to " + turntable.socket.host);
                        }
                        if (turntable.socket.transport.type == "websocket") {
                                turntable.socketLog(turntable.socket.transport.sockets[0].id + ":<" + c.msgid);
                        }
                        turntable.socket.send(d);
                        turntable.socketKeepAlive(true);
                        turntable.pendingCalls.push({
                                msgid: c.msgid,
                                handler: a,
                                deferred: b,
                                time: util.now()
                        });
                });
                return b.promise();
        },
        init: function() {
                window.app.ttObj = window.turntable.buddyList.room;
                if (window.app.ttObj === null) {
                        alert('Could not find turntable.fm objects. You should refresh your page and try again.');
                        return;
                    }
                
                window.app.botMessage = $('<div id="bot-message"> Dr Wubs Auto DJ<span style="font-style: italic;"></span> <a href="#" style="text-decoration: none; color: red; font-weight: bold;">Turn off</a></div>');
                window.app.botMessage.css({
                        position: 'absolute',
                        left: '68px',
                        top: '-17px',
                        width: '100%',
                        color: 'white',
                        zIndex: '5000',
                        textAlign: 'left',
                        paddingLeft: '2px',
                        paddingTop: '2px',
                        paddingRight: '3px',
                        paddingBottom: '2px',
                        fontSize: '10px',
                        fontFace: 'Verdana'
                });
                
                $('.header-content').first().append(window.app.botMessage);
                window.app.botMessage.find('a').click(function(e) {
                        e.preventDefault();
                        window.app.destruct();
                });
                turntable.addEventListener("message", window.app.listener);
        },
        destruct: function() {
                window.app.botMessage.remove();
                window.turntable.removeEventListener("message", window.app.listener);
                window.app = null;
        }
});

window.app.init();
});
