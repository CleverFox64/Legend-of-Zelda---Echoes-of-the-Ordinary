/*:
 * @plugindesc Real-time Playtime Counter
 * @author James Branford & ChatGPT
 */

(function() {
    // Store the start time in real seconds
    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        $gameSystem._realStartTime = Date.now();
    };

    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.realStartTime = $gameSystem._realStartTime;
        return contents;
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        $gameSystem._realStartTime = contents.realStartTime || Date.now();
    };

    Game_System.prototype.playtime = function() {
        if (!this._realStartTime) return 0;
        const now = Date.now();
        return Math.floor((now - this._realStartTime) / 1000); // in seconds
    };

    Game_System.prototype.playtimeText = function() {
        const sec = this.playtime();
        const h = Math.floor(sec / 3600);
        const m = Math.floor(sec % 3600 / 60);
        const s = sec % 60;
        return h.padZero(2) + ':' + m.padZero(2) + ':' + s.padZero(2);
    };
})();
