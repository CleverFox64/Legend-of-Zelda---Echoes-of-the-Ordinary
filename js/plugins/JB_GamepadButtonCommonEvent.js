//=============================================================================
// GamepadButtonToKey.js (name can be anything now)
//=============================================================================

var Imported = Imported || {};
Imported.GamepadButtonToKey = true;

var GamepadButtonToKey = GamepadButtonToKey || {};
GamepadButtonToKey.version = 1.04;

//=============================================================================
 /*:
 * @plugindesc [v1.0.4] Run a Common Event & simulate a keyboard key with a gamepad button. (Field only, cooldown-safe)
 * @author James Branford & ChatGPT
 *
 * @param Button Index
 * @type number
 * @min 0
 * @desc Gamepad button index (Xbox: 0=A, 1=B, 2=X, 3=Y).
 * @default 1
 *
 * @param Common Event
 * @type common_event
 * @desc Common Event to trigger when button is pressed.
 * @default 1
 *
 * @param Simulated Key
 * @type string
 * @desc Keyboard letter or key name to simulate (e.g. A, B, Shift, Control).
 * @default A
 *
 * @param Cooldown Frames
 * @type number
 * @min 0
 * @desc Frames to wait after leaving menus before button works again. (60 = 1s)
 * @default 10
 *
 * @help
 * ============================================================================
 * ■ Description
 * ============================================================================
 * - When you press the specified gamepad button on the field:
 *     • Runs the chosen Common Event.
 *     • Simulates a keyboard key press (like the "A" key).
 *
 * - Automatically ignores input while in menus or battles.
 * - Adds a cooldown period (default 10 frames) after leaving menus so it
 *   doesn’t instantly activate when you close a menu.
 *
 * ============================================================================
 * ■ Plugin Commands
 * ============================================================================
 *   SimulateKey <keyName>
 *       → Example: SimulateKey A
 *       → Example: SimulateKey Shift
 *       Simulates pressing the specified keyboard key for one frame.
 *
 *   ClearSimulatedKeys
 *       → Clears all simulated keys immediately.
 *
 * ============================================================================
 * ■ Notes
 * ============================================================================
 * - Works even if you rename this plugin file.
 * - Xbox button indices:
 *       0 = A, 1 = B, 2 = X, 3 = Y
 * - You can duplicate the plugin (rename the file) for multiple mappings.
 *
 * ============================================================================
 * ■ Version History
 * ============================================================================
 * v1.0.4 - Now independent of plugin file name
 * v1.0.3 - Fixed Common Event bug; added plugin commands
 * v1.0.2 - Added cooldown after menus
 * v1.0.1 - Restricted to Scene_Map only
 * v1.0.0 - Initial Release
 * ============================================================================
 */
//=============================================================================

(() => {
    // Dynamically detect this plugin’s parameter data regardless of file name
    const currentScript = document.currentScript.src.match(/([^\/]+)\.js$/);
    const pluginName = currentScript ? currentScript[1] : "GamepadButtonToKey";
    const params = PluginManager.parameters(pluginName);

    const buttonIndex = Number(params['Button Index'] || 1);
    const commonEventId = Number(params['Common Event'] || 1);
    const simKeyLetter = String(params['Simulated Key'] || 'A').toLowerCase();
    const simKeyCode = simKeyLetter.toUpperCase().charCodeAt(0);
    const cooldownFrames = Number(params['Cooldown Frames'] || 10);

    // Map single letters and known names
    Input.keyMapper[simKeyCode] = simKeyLetter;

    let lastPressed = false;
    let cooldown = 0;

    // Extend Input update
    const _updateGamepadState = Input._updateGamepadState;
    Input._updateGamepadState = function(gamepad) {
        _updateGamepadState.call(this, gamepad);
        if (!gamepad) return;

        // Only active on map scene
        if (!(SceneManager._scene instanceof Scene_Map)) {
            this._currentState[simKeyLetter] = false;
            lastPressed = false;
            cooldown = cooldownFrames;
            return;
        }

        // Cooldown after menus
        if (cooldown > 0) {
            cooldown--;
            this._currentState[simKeyLetter] = false;
            lastPressed = false;
            return;
        }

        const pressed = !!(gamepad.buttons[buttonIndex] && gamepad.buttons[buttonIndex].pressed);

        if (pressed) {
            this._currentState[simKeyLetter] = true;
            if (!lastPressed && $gameTemp) {
                $gameTemp.reserveCommonEvent(commonEventId);
            }
        } else {
            this._currentState[simKeyLetter] = false;
        }

        lastPressed = pressed;
    };

    // Plugin Commands
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (!command) return;
        const cmd = command.toLowerCase();

        // SimulateKey A
        if (cmd === 'simulatekey' && args[0]) {
            const keyName = args[0].toLowerCase();
            const keyCode = keyName.toUpperCase().charCodeAt(0);
            Input.keyMapper[keyCode] = keyName;
            Input._currentState[keyName] = true;
            // Auto release after 1 frame
            setTimeout(() => {
                Input._currentState[keyName] = false;
            }, 16);
        }

        // ClearSimulatedKeys
        if (cmd === 'clearsimulatedkeys') {
            for (const k in Input._currentState) {
                Input._currentState[k] = false;
            }
        }
    };

})();
