"use strict"
let turboPlayer = (initobj) => {
    let fps, TimeArr, initTime, dur_s, init_dur_s, dur_fr, lastDBvalues, currentFrame, W, H, video, Videodata, canvas, ctx, ws, canseek, lastTime, img, dar;
    let targetConfig = '';
    let lastProgress = 0;
    let playerID = parseInt(Math.random() * 10000) + '_' + Date.now() + '_' + parseInt(Math.random() * 10000);
    let audioSwitch = [];
    let muststart = false;
    let lib = {};
    let lastAudioValues = [];
    let speed = 'x1';
    let speedMult = 1

    const allowedSpeeds = ['x0.5', 'x0.75', 'x1', 'x1.5', 'x2', 'x4', 'x8', 'x16']

    const cleanSpeed = (xspeed) => {

        if (!allowedSpeeds.includes(xspeed)) {
            return 'x1'
        } else {
            return xspeed
        }
    }
    const parseSpeed = () => {
        let x = Number(speed.split('x')[1])
        if (x < 1) {
            x = 1
        }
        return x
    }
    const findLevels = (currentTime) => {
        try {
            for (let obj of TimeArr[Math.floor(currentTime)]) {

                if (Number(obj.time) >= Number(currentTime)) {
                    //console.log('found ' + obj.levels + ' at obj.time: ' + Number(obj.time) + ' at currentTime: ' + currentTime)
                    return obj.levels;
                }
            }

        } catch (e) {}

    };
    const build = (e) => {
        return document.createElement(e);
    };
    const qs = (e) => {
        return document.querySelector(e);
    };
    const canplay = () => {
        canseek = true;
        if (muststart) {
            video.play();
            muststart = false;
        }
    }

    function cleanVideoData(data) {


        const cleandata = {}

        cleandata.audioBitRate = Number(data.audioBitRate)
        cleandata.Video = data.Video
        cleandata.audChannels = data.audChannels;
        cleandata.AVstruct = data.AVstruct;
        cleandata.AVtype = data.AVtype;
        cleandata.Streams = data.Streams;
        cleandata.SourcePath = data.SourcePath;
        cleandata.rfps = data.rfps;
        cleandata.dur_s = data.dur_s;
        cleandata.dur_fr = data.dur_fr;
        cleandata.VFR = data.VFR;
        cleandata.rotate = data.rotate;
        cleandata.width = data.width;
        cleandata.height = data.height;
        cleandata.out_s = data.dur_s;
        cleandata.segments = data.segments;
        cleandata.dar = data.dar
        cleandata.Container = data.Container
        cleandata.videoStreamIndex = data.videoStreamIndex


        return cleandata
    }

    function compareArray(arr1, arr2) {
        let p = false;
        let idx = 0;
        if (arr1.length != arr2.length) {
            return true;
        }
        for (let o of arr1) {
            if (o != arr2[idx]) {
                p = true;
            }
            idx++;
        }
        return p;
    }

    function buildPlayer() {
        img = build('img');
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        img.crossOrigin = "anonymous";
        canvas = build('canvas');
        ctx = canvas.getContext('2d');
        video = build('video');
        video.id = "player";
        video.crossOrigin = "anonymous";
        video.width = W;
        video.height = H;
        canvas.width = video.width;
        canvas.height = video.height;

        video.addEventListener('start', () => {
            canseek = false;
            let event = new CustomEvent('message', {
                'detail': "playing..."
            });
            video.dispatchEvent(event);
        });
        video.addEventListener('eddata', () => {
            canseek = true;
            let event = new CustomEvent('message', {
                'detail': "playing..."
            });
            video.dispatchEvent(event);
        });
        video.addEventListener('canplay', () => {
            canseek = true;
            let event = new CustomEvent('message', {
                'detail': "can play"
            });
            video.dispatchEvent(event);
        });
        video.addEventListener('pause', () => {
            let event = new CustomEvent('message', {
                'detail': "pause"
            });
            video.dispatchEvent(event)
        });
        video.addEventListener('play', () => {
            let event = new CustomEvent('message', {
                'detail': "play"
            });
            video.dispatchEvent(event);
        });
        video.addEventListener('seeked', () => {
            let event = new CustomEvent('message', {
                'detail': "seeked"
            });
            video.dispatchEvent(event);
        });
        video.addEventListener('seeking', () => {
            let event = new CustomEvent('message', {
                'detail': "seeking"
            });
            video.dispatchEvent(event);
        });
        lib.video = video;
        lib.img = img;
        lib.canvas = canvas;
        lib.ctx = ctx;
    }

    function setRatio(dar, h, w) {
        if (dar) {
            let darTemp = (dar).split(':');
            let ratio = darTemp[0] / darTemp[1];
            let width = Math.round(h * ratio);
            if (w > width) {
                img.width = width;
                img.height = h;
                let widthImg = Math.floor((w - width) / 2);
                img.setAttribute('style', 'padding-left:' + widthImg + 'px; padding-right:' + widthImg + 'px');
            } else {
                let height = Math.round(w / ratio);
                img.width = w;
                img.height = height;
                let heightImg = Math.floor((h - height) / 2);
                img.setAttribute('style', 'padding-top:' + heightImg + 'px; padding-bottom:' + heightImg + 'px');
            }
        }
    }

    function seekover(targetTime) {
        if (targetTime > dur_s) {
            return false
        }
        if (canseek) {
            let targetFrame = Math.round(fps * targetTime);
            canvas.width = video.width;
            canvas.height = video.height;
            ctx.drawImage(video, 0, 0, video.width, video.height);
            img.src = canvas.toDataURL();
            setRatio(dar, video.height, video.width);
            initTime = targetTime;
            let isplay = true;
            if (video.paused) {
                isplay = false;
            }
            video.src = window.location.protocol + '//' + initobj.endpoint + "/video/" + encodeURIComponent(JSON.stringify(Videodata)) + "?seek=" + targetTime + '&fps=' + fps + "&seekedframes=" + targetFrame + "&w=" + W + "&h=" + H + '&audioswitch=' + JSON.stringify(audioSwitch) + '&playerID=' + playerID + targetConfig + '&speed=' + speed;
            let event4 = new CustomEvent('message', {
                'detail': 'loading_start'
            });
            video.dispatchEvent(event4);
            if (isplay) {

                video.play();
            }
            if (Number(speed.split('x')[1]) >= 1) {
                video.playbackRate = 1
            } else {
                video.playbackRate = Number(speed.split('x')[1])
            }
        }
    }
    const playpause = () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };
    const stop = () => {
        seekover(0);
        video.pause();
    };
    const connectws = (endpoint) => {
        if (!endpoint) {
            endpoint = '/player/' + playerID;
        }
        ws = null;
        ws = new WebSocket(endpoint);

        ws.onmessage = (data) => {
            let msg = JSON.parse(data.data);
            if (msg.name == "levelFrame") {
                if (!isNaN(msg.data.time)) {
                    if (!Array.isArray(TimeArr[Math.floor(msg.data.time)])) {
                        TimeArr[Math.floor(msg.data.time)] = [];
                    }
                    TimeArr[Math.floor(msg.data.time)].push({
                        time: msg.data.time,
                        levels: msg.data.levels
                    });
                }
            }
            if (msg.name == "ffcmd") {
                let ffcmd = new CustomEvent('ffcmd', {
                    detail: msg.data
                });
                video.dispatchEvent(ffcmd);
            }
            if (msg.name == "stats") {
                let stats = new CustomEvent('stats', {
                    detail: msg.data
                });
                video.dispatchEvent(stats);
            }
            if (msg.name == "error") {
                console.log(msg.data);
                let error = new CustomEvent('error', {
                    detail: msg.data
                });
                video.dispatchEvent(error);
            }
            if (msg.name == "exit") {
                console.log(msg)
                let exit = new CustomEvent('exit', {
                    detail: msg.data
                });
                video.dispatchEvent(exit);
            }
        };
        ws.onopen = () => {
            ws.send(JSON.stringify({
                name: 'connect',
                data: 'hello'
            }));
        };
        ws.onclose = () => {
            reconnectws(endpoint);
        };
        ws.onerror = (e) => {
            //console.log(e)
            // switch (e.code) {
            //   case 'ECONNREFUSED':
            //     reconnectws(endpoint)
            //     break;
            //   default:
            //     //console.log(4);
            //     break;
            // }
        };
    };
    const plusone = () => {
        if (!video.paused) {
            video.pause();
        }
        let k = video.currentTime + (1 / fps);
        if (k >= dur_s) {
            k = dur_s;
        }
        video.currentTime = k;
    }
    const minusone = () => {
        if (!video.paused) {
            video.pause();
        }
        let k = video.currentTime - (1 / fps);
        if (k <= 0) {
            k = 0;
        }
        video.currentTime = k;
    };
    const reconnectws = (endpoint) => {
        setTimeout(() => {
            connectws(endpoint);
        }, 5000);
    };
    const init = () => {
        W = initobj.w;
        H = initobj.h;
        buildPlayer();
        if (window.location.protocol == 'https:') {
            connectws('wss://' + initobj.endpoint + '/' + playerID);
        } else {
            connectws('ws://' + initobj.endpoint + '/' + playerID);
        }

        qs(initobj.display).appendChild(video);
        qs(initobj.display).appendChild(img);
        draw();
    };
    init();

    function seekto(targetTime) {
        if (targetTime >= dur_s) {
            targetTime = dur_s;
        }
        if (targetTime <= 0) {
            targetTime = 0;
        }
        seekover(targetTime);
    }

    function getTime(e) {
        let rect = e.currentTarget.getBoundingClientRect();
        let x = e.clientX - rect.left; //x position within the element.
        let percent = ((x / rect.width) * 100).toFixed(2);
        let targetTime = dur_s * (percent / 100);
        if (!isNaN(targetTime)) {
            let event = new CustomEvent('time', {
                detail: targetTime
            });
            video.dispatchEvent(event);
        }

        //return targetTime;  
    }

    function goseek(e) {
        let rect = e.currentTarget.getBoundingClientRect();
        let x = e.clientX - rect.left; //x position within the element.
        let percent = ((x / rect.width) * 100).toFixed(2);
        let targetTime = dur_s * (percent / 100);
        seekover(targetTime);
    }



    function draw() {
        window.requestAnimationFrame(draw);
        try {
            let newtime = (video.currentTime * speedMult) + initTime;
            if (lastTime != newtime) {
                if (!isNaN(newtime)) {
                    let event3 = new CustomEvent('time', {
                        detail: newtime
                    });
                    video.dispatchEvent(event3);
                    lastTime = newtime;
                }
            }
        } catch (e) {
            //console.log(e)
        }




        let percent = ((((video.currentTime * speedMult) + initTime) / dur_s) * 100);
        if (percent > 100) {
            percent = 100;
        }
        if (percent) {
            if (!isNaN(percent)) {
                if (lastProgress != percent) {
                    let event = new CustomEvent('progress', {
                        'detail': percent
                    });
                    video.dispatchEvent(event);
                    lastProgress = percent;
                }
            }

        }

        currentFrame = Math.round(((video.currentTime * speedMult) + initTime) * fps)
            //console.log(((video.currentTime  * speedMult)+ initTime)+'/'+dur_s) 
        if (currentFrame > dur_fr) {
            currentFrame = dur_fr
        }
        if (((video.currentTime * speedMult) + initTime) > dur_s) {

            video.currentTime = (dur_s - initTime) / speedMult

            video.pause()
                /// alert('end of video')
        }

        try {

            // if (!FrameMap.get(currentFrame)) {
            //     try {
            //         FrameMap.set(currentFrame, FrameMap.get(currentFrame - 1))
            //     } catch (e) {

            //     }


            // }
            if (Array.isArray(TimeArr)) {
                //  console.log('try find levels')
                lastDBvalues = findLevels((video.currentTime * speedMult) + initTime) // FrameMap.get(currentFrame)
            }


        } catch (e) {
            console.error(e)
        }
        try {
            let idx = 0
            let audiolevlz = []
            for (let o of lastDBvalues) {

                if (isNaN(o)) {
                    o = -100
                }


                // Math.round(1000000000 * Math.pow(10, Number(o) / 20)) / 10000000; linear value
                let percentage = (100 * Math.log(Math.pow(10, Number(o) / 20) * 150)) / Math.log(150) //log value 
                if (percentage < 0) {
                    percentage = 0
                }
                if (percentage >= 100) {
                    percentage = 100
                }

                audiolevlz.push(percentage)
                idx++

            }
            if (compareArray(audiolevlz, lastAudioValues)) {
                let event = new CustomEvent('audiolevel', {
                    detail: audiolevlz
                })
                video.dispatchEvent(event)
                lastAudioValues.length = 0
                for (let k of audiolevlz) {
                    lastAudioValues.push(k)
                }
            }

        } catch (e) {
            // //console.log(e)
        }


    }

    lib.load = (data, thumb, seekTo, duration, autoPlay) => {
        dar = data.dar;
        muststart = true;
        lastTime = 0;
        initTime = 0;
        let event3 = new CustomEvent('time', {
            detail: 0
        });
        video.dispatchEvent(event3);
        let event = new CustomEvent('message', {
            'detail': 'building stream'
        });
        video.dispatchEvent(event);
        let event4 = new CustomEvent('message', {
            'detail': 'loading_start'
        });
        video.dispatchEvent(event4);
        if (thumb) {
            img.src = thumb;
        }

        Videodata = cleanVideoData(data);
        //FrameMap = new Map();
        if (Array.isArray(TimeArr)) {
            TimeArr.length = 0;
        } else {
            TimeArr = [];
        }
        dur_fr = data.dur_fr;
        fps = data.rfps;
        if (!duration) {
            duration = data.dur_s;
        }
        init_dur_s = duration
        dur_s = duration;

        let trackz = 0;
        let streams;
        if (data.Streams.includes('|')) {
            streams = data.Streams.split('|');
        } else if (data.Streams.includes('-')) {
            streams = data.Streams.split('-');
        } else {
            streams = [data.Streams];
        }

        for (let s of streams) {
            if (s.includes('A')) {
                trackz += Number(s.split('A')[1]);
            }
        }
        // //console.log(trackz)


        audioSwitch.length = 0;
        for (let i = 0; i < trackz; i++) {
            audioSwitch.push(1);
        }
        if (!seekTo) {
            seekTo = 0;
        }

        video.src = window.location.protocol + '//' + initobj.endpoint + '/video/' + encodeURIComponent(JSON.stringify(Videodata)) + "?seek=" + seekTo + '&fps=' + fps + "&w=" + W + "&h=" + H + "&j=" + Date.now() + '&audioswitch=' + JSON.stringify(audioSwitch) + '&playerID=' + playerID + targetConfig + '&speed=' + speed; //+'&noblack=true'
        video.removeEventListener('canplay', canplay);
        if (!autoPlay)
            video.addEventListener('canplay', canplay);
        let event2 = new CustomEvent('gotchannels', {
            detail: trackz
        });
        video.dispatchEvent(event2);
        let event5 = new CustomEvent('message', {
            'detail': 'loading_end'
        });
        video.dispatchEvent(event5);
        let loadClip = new CustomEvent('message', {
            'detail': 'clip_ready'
        });
        video.dispatchEvent(loadClip);
    }

    lib.stopStream = () => {
        canvas.width = video.width;
        canvas.height = video.height;
        ctx.drawImage(video, 0, 0, video.width, video.height);
        img.src = canvas.toDataURL();
        const time = (video.currentTime * speedMult) + initTime;
        video.src = null;
        return {
            currentTime: time
        };
    }
    lib.play = () => {
        //console.log('methode play');
        playpause();
    }
    lib.pause = () => {
        video.pause();
    }
    lib.nextFrame = () => {
        plusone();
    }
    lib.previousFrame = () => {
        minusone();
    }
    lib.seek = (e) => {
        goseek(e);
    }
    lib.getTime = (e) => {
        getTime(e)
    }
    lib.changeSpeed = (newspeed) => {
        let oldspeed = speedMult
            // time management
        video.playbackRate = 1
        dur_s = init_dur_s
            //seekover((video.currentTime  * speedMult)+ initTime);
        speed = cleanSpeed(newspeed)
        if (Number(speed.split('x')[1]) <= 1) {
            console.log('oldspeed', oldspeed, 'new speed', Number(speed.split('x')[1]))

            speedMult = 1
            if (oldspeed > Number(speed.split('x')[1]) && Number(speed.split('x')[1]) === 1) {
                seekover((video.currentTime * oldspeed) + initTime);
            }
            video.playbackRate = Number(speed.split('x')[1])

        } else {
            seekover((video.currentTime * oldspeed) + initTime);
            speedMult = parseSpeed()
            seekover((video.currentTime * speedMult) + initTime);
        }


    }
    lib.setAudio = (audio) => {
        audioSwitch.length = 0;
        audioSwitch.push(...audio);
        seekover((video.currentTime * speedMult) + initTime);
    }
    lib.resize = (obj) => {
        canvas.width = obj.w;
        video.width = obj.w;
        canvas.height = obj.h;
        video.height = obj.h;
        H = obj.h;
        W = obj.w;
        setRatio(dar, video.height, video.width);
        if (!dar) {
            img.width = obj.w;
            img.height = obj.h;
        }
        seekover((video.currentTime * speedMult) + initTime);
    }
    lib.setPoster = (url) => {
        img.src = url;
    }
    lib.stop = () => {
        stop();
    }
    lib.seekTo = (sec) => {
        seekto(sec);
    }

    lib.setTargetConfig = (conf) => {
        targetConfig = '';


        if (conf.codec) {
            targetConfig += '&codec=' + conf.codec;
        }
        if (conf.gop) {
            targetConfig += '&gop=' + parseInt(conf.gop);
        }
        if (conf.preset) {
            targetConfig += '&preset=' + conf.preset;
        }
        if (conf.container) {
            targetConfig += '&container=' + conf.container;
        }
        if (conf.threads) {
            targetConfig += '&threads=' + parseInt(conf.threads);
        }
        if (conf.abr) {
            targetConfig += '&abr=' + conf.abr;
        }
        if (conf.vbr) {
            targetConfig += '&vbr=' + conf.vbr;
        }
        if (conf.cpuUsed) {
            targetConfig += '&cpuUsed=' + parseInt(conf.cpuUsed);
        }
        if (conf.optional) {
            targetConfig += '&optional=' + JSON.stringify(conf.optional);
        }
        if (conf.noblack) {
            targetConfig += '&noblack=' + conf.noblack;
        }
        //////
        if (conf.cmd) {
            targetConfig += '&cmd=' + encodeURIComponent(conf.cmd);
        }
        if (conf.minrate) {
            targetConfig += '&minrate=' + conf.minrate;
        }
        if (conf.maxrate) {
            targetConfig += '&maxrate=' + conf.minrate;
        }
        if (conf.error_resilient) {
            targetConfig += '&error_resilient=' + conf.error_resilient;
        }
        if (conf.keyint_min) {
            targetConfig += '&keyint_min=' + conf.keyint_min;
        }
        if (conf.rc_init_occupancy) {
            targetConfig += '&rc_init_occupancy=' + conf.rc_init_occupancy;
        }
        if (conf.rc_init_occupancy) {
            targetConfig += '&rc_init_occupancy=' + conf.rc_init_occupancy;
        }
        if (conf.tune) {
            targetConfig += '&tune=' + conf.tune;
        }
        if (conf.movflags) {
            targetConfig += '&movflags=' + encodeURIComponent(conf.movflags);
        }
        if (conf.deadline) {
            targetConfig += '&deadline=' + conf.deadline;
        }
        if (conf.acodec) {
            targetConfig += '&acodec=' + conf.acodec;
        }
        if (conf.crf) {
            targetConfig += '&crf=' + conf.crf;
        }

        if (conf.priority) {
            /*
 
    idle: 64 (or "idle")
    below normal: 16384 (or "below normal")
    normal: 32 (or "normal")
    above normal: 32768 (or "above normal")
    high priority: 128 (or "high priority")
    real time: 256 (or "realtime")
  */
            targetConfig += '&priority=' + conf.priority;
        }

    }

    lib.allowedSpeeds = () => {
        return allowedSpeeds
    }

    return lib;
}

export default turboPlayer