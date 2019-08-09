(function () {
    'use strict';

    class ScoreBoard extends Laya.Scene {
        constructor(mode,overCallback) {
            super();
            this.overCallback=overCallback;
            this.mode = mode;
            console.log(this);
            this.loadScene("Component/ScoreBoard.scene");
        }
        onEnable() {
            this.players = ['0', '1'];
            this.gameTimes = -1;
            this.times = 0;
            this.x = Laya.stage.width - this.width - 30;
            this.y = Laya.stage.height / 2 - this.height / 2;
            this.zOrder=1;
            this.initScoreBoard();
        }
        changeMode(mode) {
            this.mode = mode;
            this.initScoreBoard();
        }
        initScoreBoard() {
            this.resultLabel.visible = false;
            switch (this.mode) {
                case 0:
                this.visible=true;
                    this.gameTimes = 1;
                    this.generateCheckBox();
                    break
                case 1:
                this.visible=true;
                    this.gameTimes = 3;
                    this.generateCheckBox(3);
                    break
                case 2:
                this.visible=true;
                    this.gameTimes = 5;
                    this.generateCheckBox(5);
                    break
                default:
                    this.gameTimes = -1;
                    // this.generateCheckBox(5)
                    this.visible=false;
                    break
            }
        }

        generateCheckBox(count = 1) {
            this.players.forEach((playerIndex) => {
                let list = [];
                for (let index = 0; index < count; index++) {
                    let checkbox = new Laya.CheckBox;
                    checkbox.skin = 'comp/checkbox.png';
                    checkbox.scaleX = .5;
                    checkbox.scaleY = .5;
                    checkbox.disabled = true;
                    checkbox.x = index * 40;
                    list.push(checkbox);
                }
                this.getChildByName(`player${playerIndex}Score`).destroyChildren();
                this.getChildByName(`player${playerIndex}Score`).addChildren(...list);
            });
        }
        update(winnerIndex) {
            if(this.gameTimes===-1){
                return false
            }
            this.getChildByName(`player${winnerIndex}Score`).getChildAt(this.times).selected = true;
            this.judge();
        }
        judge() {
            let result = [0, 0];
            this.players.forEach((index) => {
                const currentPlayerScore = this.getChildByName(`player${index}Score`);
                const count = currentPlayerScore.numChildren;
                for (let i = 0; i < count; i++) {
                    // console.log()
                    if (currentPlayerScore.getChildAt(i).selected) {
                        result[index]++;
                    }
                }
            });
            const isWinAready=result[0]===Math.ceil(this.gameTimes/2)||result[1]===Math.ceil(this.gameTimes/2);
            if (this.times === this.gameTimes - 1||isWinAready ) {
                let winnerIndex = result[0] > result[1] ? 0 : 1;
                this.times = 0;
                // this.initScoreBoard()
                // alert('游戏结束')
                this.resultLabel.visible = true;
                this.resultLabel.getChildByName(`player${winnerIndex}`).dataSource = 'WINNER';
                this.resultLabel.getChildByName(`player${Math.abs(winnerIndex - 1)}`).dataSource = 'LOSER';
                this.resultLabel.getChildByName(`player${winnerIndex}`).color = '#ef332f';
                this.resultLabel.getChildByName(`player${Math.abs(winnerIndex - 1)}`).color = '#69dd1b';
                if(this.overCallback){
                    this.overCallback.run();
                }
            } else {
                this.times++;
            }
        }
    }

    class SettingModal extends Laya.Scene {

        constructor(updateSettingCallbackHandle) {
            super();
            this.updateSettingCallbackHandle = updateSettingCallbackHandle;
            this.loadScene("Component/SettingModal.scene");
            this.visible = false;
        }
        onEnable() {
            this.init();
        }
        init() {
            this.mode = 0;
            this.zOrder = 2;
            this.closeButton.on(Laya.Event.CLICK, this, this.close);
            this.okButton.on(Laya.Event.CLICK, this, this.onOkButtonClick);
            this.restartButton.on(Laya.Event.CLICK, this, this.onOkButtonClick);

            this.modeRadio.selectHandler = new Laya.Handler(this, (index) => {
                this.mode = index;
            });
        }
        close() {
            this.visible = false;
        }
        onOkButtonClick() {
            this.updateSettingCallbackHandle.runWith(this.mode);
            this.close();
        }
    }

    class MultiPlay extends Laya.Script {

        constructor() {
            super();
        }

        onEnable() {
            this.init();
        }

        init() {
            //TODO:
            this.owner.y = Laya.stage.height / 2 - this.owner.height / 2;
            this.mode = 0;
            this.players = ['0', '1'];
            this.gameStatus = false;
            this.currentGameResult = [-1, -1];
            //0：未出拳 1：已出拳 -1：等待对方出拳判断结果 
            this.playerStatus = [0, 0];
            this.timer = [0, 0];

            this.players.forEach((index) => {
                this.owner[`player${index}`].getChildByName('goButton').on(Laya.Event.CLICK, this, () => { this.onGoButtonClick(index); });
            });
            this.owner.backButton.on(Laya.Event.CLICK, this, this.onBackButtonClick);
            this.owner.restartButton.on(Laya.Event.CLICK, this, this.restart);

            const gameOverCallbackHandler = new Laya.Handler(this, () => {
                this.owner.restartButton.visible = true;
                this.setPlayerChildVisible('goButton', false);
            });

            this.scoreBoard = new ScoreBoard(0, gameOverCallbackHandler);
            this.owner.stage.addChild(this.scoreBoard);

            const updateSettingCallbackHandle = new Laya.Handler(this, this.changeMode);
            this.settingModal = new SettingModal(updateSettingCallbackHandle);
            this.owner.stage.addChild(this.settingModal);
            this.owner.settingButton.on(Laya.Event.CLICK, this, () => { this.settingModal.visible = true; });
        }

        changeMode(mode) {
            this.owner.restartButton.visible = false;
            this.setPlayerChildVisible('goButton', true);
            this.scoreBoard.changeMode(mode);
        }

        setPlayerChildVisible(childName, stauts, array = this.players) {
            array.forEach((index) => {
                this.owner[`player${index}`].getChildByName(childName).visible = stauts;
            });
        }

        restart() {
            this.gameStatus = false;
            this.currentGameResult = [-1, -1];
            //0：未出拳 1：已出拳 -1：等待对方出拳判断结果 
            this.playerStatus = [0, 0];
            this.timer = [0, 0];
            this.setPlayerChildVisible('result', false);
            this.setPlayerChildVisible('goButton', true);
            this.owner.restartButton.visible = false;
            this.scoreBoard.initScoreBoard(this.mode);
        }

        onGoButtonClick(playerIndex) {
            const index = playerIndex;
            const enemyStatus = this.playerStatus[Math.abs(index - 1)];
            const currentStatus = this.playerStatus[index];

            if (this.playerStatus[index] === 0) {
                this.owner[`player${index}`].getChildByName('goButton').label = 'Go!';
                Laya.timer.loop(120, this, this[`changeFinder${index}`]);
                this.playerStatus[index] = -1;
            } else if (this.playerStatus[index] === -1) {
                this.playerStatus[index] === -1;
                this.timer[index] = 0;
                Laya.timer.clear(this, this[`changeFinder${index}`]);
                const result = this.getRandomFingerIndex();
                this.currentGameResult[index] = result;
                this.owner[`player${index}`].getChildByName('finger').loadImage(`fingers/${result}.png`);
                this.owner[`player${index}`].getChildByName('goButton').label = 'Ready!';
                this.setPlayerChildVisible('goButton', false, [index]);
            }
            if (this.currentGameResult[0] !== -1 && this.currentGameResult[1] !== -1) {
                this.gameStatus = false;
            } else {
                this.gameStatus = true;
            }
            if (!this.gameStatus) {
                this.players.forEach((index) => {
                    this.playerStatus[index] = 0;
                    this.setPlayerChildVisible('goButton', true, [index]);
                });
                let currentWinnerIndex = this.getCurrentGameWinnerIndex();
                if (currentWinnerIndex !== -1) {
                    this.scoreBoard.update(currentWinnerIndex);

                    this.setPlayerChildVisible('result', true);

                    this.owner[`player${currentWinnerIndex}`].getChildByName('result').dataSource = 'WIN';
                    this.owner[`player${Math.abs(currentWinnerIndex - 1)}`].getChildByName('result').dataSource = 'LOSE';
                    this.owner[`player${currentWinnerIndex}`].getChildByName('result').color = '#ef332f';
                    this.owner[`player${Math.abs(currentWinnerIndex - 1)}`].getChildByName('result').color = '#69dd1b';

                } else {
                    this.owner.drawLabel.visible = true;
                    Laya.timer.once(1000, this, () => {
                        this.owner.drawLabel.visible = false;
                    });
                }
            } else {
                this.setPlayerChildVisible('result', false);
            }
        }

        getCurrentGameWinnerIndex() {
            const result = this.currentGameResult;
            this.currentGameResult = [-1, -1];
            const temp = result[0] - result[1];
            const isDrawn = result[0] === result[1];
            if (isDrawn) {
                return -1
            } else if (temp > 0) {
                if (temp === 1) {
                    return 0
                } else {
                    return 1
                }
            } else {
                if (temp === -1) {
                    return 1
                } else {
                    return 0
                }
            }
        }

        changeFinder0() {
            this.timer[0]++;
            this.owner.player0.getChildByName('finger').loadImage(`fingers/${this.timer[0] % 3}.png`);
        }

        changeFinder1() {
            this.timer[1]++;
            this.owner.player1.getChildByName('finger').loadImage(`fingers/${this.timer[1] % 3}.png`);
        }

        onBackButtonClick() {
            Laya.Scene.open('Main/Index.scene');
            this.scoreBoard.close();
        }
        getRandomFingerIndex() {
            const randomIndex = Math.round(Math.random() * 2);
            return randomIndex
        }
    }

    /**
     * 游戏控制脚本。定义了几个dropBox，bullet，createBoxInterval等变量，能够在IDE显示及设置该变量
     * 更多类型定义，请参考官方文档
     */
    class SinglePlay extends Laya.Script {

        constructor() {
            super();
        }

        onEnable() {
            this.init();
        }

        init() {
                    //TODO:
            this.owner.y = Laya.stage.height / 2 - this.owner.height / 2;
            this.status = false;
            this.owner.content.y=Laya.stage.height/2-this.owner.content.height/2;
            this.timer = 0;
            this.owner.backButton.on(Laya.Event.CLICK, this, this.onBackButtonClick);
            this.owner.goButton.on(Laya.Event.CLICK, this, this.onGoButtonClick);
        }

        onBackButtonClick() {
            Laya.Scene.open('Main/Index.scene');
        }

        onGoButtonClick() {
            if (this.status) {
                this.status = false;
                this.timer = 0;
                Laya.timer.clear(this, this.changeFinder);
                this.getRandomFinger();
                this.owner.goButton.label = 'Ready!';
            } else {
                this.status = true;
                this.owner.goButton.label = 'Go!';
                Laya.timer.loop(120, this, this.changeFinder);
            }
        }

        changeFinder() {
            this.timer++;
            this.owner.fingers.loadImage(`fingers/${this.timer % 3}.png`);
        }

        getRandomFinger() {
            // return 
            const randomIndex = Math.round(Math.random() * 2);
            this.owner.fingers.loadImage(`fingers/${randomIndex}.png`);
        }
    }

    class Index extends Laya.Script {
        constructor() {
            super();
        }
        onEnable() {
            this.init();
        }

        init() {
            //TODO:
            this.owner.y = Laya.stage.height / 2 - this.owner.height / 2;
            // console.log(this, this.owner.startButton)
            this.owner.singlePlayButton.on(Laya.Event.CLICK, this, this.onSinglePlayButtonClick);
            this.owner.multiPlayButton.on(Laya.Event.CLICK, this, this.onMultiPlayButtonClick);
        }

        onSinglePlayButtonClick() {
            Laya.Scene.open('Game/SinglePlay.scene');
        }

        onMultiPlayButtonClick() {
            Laya.Scene.open('Game/MultiPlay.scene');
        }
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("script/MultiPlay.js",MultiPlay);
    		reg("script/SinglePlay.js",SinglePlay);
    		reg("script/Index.js",Index);
        }
    }
    GameConfig.width = 720;
    GameConfig.height = 1280;
    GameConfig.scaleMode ="showall";
    GameConfig.screenMode = "vertical";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "Main/Index.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;

    GameConfig.init();

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig.scaleMode;
    		Laya.stage.screenMode = GameConfig.screenMode;
    		Laya.stage.alignV = GameConfig.alignV;
    		Laya.stage.alignH = GameConfig.alignH;
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig.stat) Laya.Stat.show();
    		Laya.alertGlobalError = true;

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    	}

    	onVersionLoaded() {
    		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    	}

    	onConfigLoaded() {
    		//加载IDE指定的场景
    		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
