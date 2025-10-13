/*:
 * @plugindesc v1.0.1 Real-time Playtime counter that works per save file (accumulates playtime only while running). 
 * Compatible with TSR_Save. Inspired by Yanfly-style plugin structure.
 * @author James Branford & ChatGPT
 *
 * @param PauseInMenus
 * @type boolean
 * @on Yes
 * @off No
 * @desc Should the playtime pause while in menus (like RPG Maker default)? 
 * ON = Pauses in menus, OFF = Always counts real time
 * @default true
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * By default, RPG Maker MV playtime is tied to frames, not real-world time,
 * and TSR_Save only displays that value. This plugin replaces the playtime
 * logic with a real-time counter that accumulates per save file.
 *
 * Features:
 * - Tracks true real-world seconds (not frames).
 * - Saves per save file (not global).
 * - Optionally pauses in menus like the vanilla timer.
 * - TSR_Save displays the correct playtime without modification.
 *
 * ============================================================================
 * How It Works
 * ============================================================================
 * - When starting a new game, the timer begins at 0.
 * - While the game runs, playtime accumulates in seconds.
 * - When you save, the current session is added to the save data.
 * - On load, the saved playtime resumes and keeps adding.
 * - Optional: pause playtime while in menus.
 *
 * ============================================================================
 * Compatibility
 * ============================================================================
 * - Place this plugin BELOW TSR_Save in the Plugin Manager.
 * - Should be compatible with YEP_SaveCore replacements as well.
 *
 * ============================================================================
 * Technical Notes
 * ============================================================================
 * - On save: elapsed time is added to _realPlaytime.
 * - On load: resume time is reset.
 * - If PauseInMenus = true, playtime halts when entering Scene_Menu,
 *   Scene_Item, Scene_Status, etc. and resumes when returning to map/battle.
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * Free to use in any RPG Maker MV/MZ project, commercial or non-commercial.
 * Credit is appreciated.
 * ============================================================================
 */

var Imported = Imported || {};
Imported.RealTimePlaytime = true;

var RealTimePlaytime = RealTimePlaytime || {};

(function($) {
    "use strict";

    var parameters = PluginManager.parameters('RealTimePlaytime');
    $.pauseInMenus = parameters['PauseInMenus'] === 'true';

    // ---------------------------
    // New Game
    // ---------------------------
    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        $gameSystem._realPlaytime = 0;
        $gameSystem._resumeTime = Date.now();
    };

    // ---------------------------
    // Save contents
    // ---------------------------
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        $gameSystem._updateRealPlaytime();
        const contents = _DataManager_makeSaveContents.call(this);
        contents.realPlaytime = $gameSystem._realPlaytime;
        return contents;
    };

    // ---------------------------
    // Load contents
    // ---------------------------
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        $gameSystem._realPlaytime = contents.realPlaytime || 0;
        $gameSystem._resumeTime = Date.now();
    };

    // ---------------------------
    // Core Logic
    // ---------------------------
    Game_System.prototype._updateRealPlaytime = function() {
        if (!this._resumeTime) this._resumeTime = Date.now();
        const elapsed = Math.floor((Date.now() - this._resumeTime) / 1000);
        this._realPlaytime = (this._realPlaytime || 0) + elapsed;
        this._resumeTime = Date.now();
    };

    Game_System.prototype.playtime = function() {
        if (!this._resumeTime) this._resumeTime = Date.now();
        const elapsed = Math.floor((Date.now() - this._resumeTime) / 1000);
        return (this._realPlaytime || 0) + elapsed;
    };

    Game_System.prototype.playtimeText = function() {
        const sec = this.playtime();
        const h = Math.floor(sec / 3600).padZero(2);
        const m = Math.floor((sec % 3600) / 60).padZero(2);
        const s = (sec % 60).padZero(2);
        return `${h}:${m}:${s}`;
    };

    // ---------------------------
    // Scene Hooks for Pausing
    // ---------------------------
    const pauseScenes = [
        Scene_Menu, Scene_Item, Scene_Skill, Scene_Equip,
        Scene_Status, Scene_Options, Scene_File, Scene_Save,
        Scene_Load, Scene_GameEnd, Scene_Shop, Scene_Name,
        Scene_Debug
    ];

    function sceneIsPauseScene(scene) {
        return pauseScenes.some(sc => scene instanceof sc);
    }

    const _SceneManager_update = SceneManager.update;
    SceneManager.update = function() {
        const lastScene = this._scene;
        _SceneManager_update.call(this);
        if ($.pauseInMenus && lastScene) {
            if (sceneIsPauseScene(this._scene) && $gameSystem._resumeTime) {
                // Pause: freeze total playtime
                $gameSystem._updateRealPlaytime();
                $gameSystem._resumeTime = null;
            } else if (!sceneIsPauseScene(this._scene) && !$gameSystem._resumeTime) {
                // Resume: restart timer
                $gameSystem._resumeTime = Date.now();
            }
        }
    };

})(RealTimePlaytime);