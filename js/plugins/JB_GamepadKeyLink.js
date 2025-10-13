//=============================================================================
// GamepadToKeyLink.js
//=============================================================================

var Imported = Imported || {};
Imported.GamepadToKeyLink = true;

var GamepadToKeyLink = GamepadToKeyLink || {};
GamepadToKeyLink.version = 1.00;

//=============================================================================
 /*:
 * @plugindesc [v1.0.0] B button on Xbox controller acts as keyboard A key.
 * @author James Branford & ChatGPT
 *
 * @help
 * ============================================================================
 * ■ Gamepad to Key Link
 * ============================================================================
 * This plugin makes the Xbox 360/One controller **B button** (button index 1)
 * simulate pressing the **keyboard A key** (keycode 65).
 *
 * Any event, plugin, or script checking for the A key will now also respond
 * when the B button is pressed.
 *
 * ============================================================================
 * ■ Notes
 * ============================================================================
 * - Works in both RPG Maker MV and MZ.
 * - Safely overrides Input._updateGamepadState.
 * - Does not modify rpg_core.js directly.
 *
 * ============================================================================
 * ■ Version History
 * ============================================================================
 * v1.0.0 - Initial Release
 * ============================================================================
 */
 //=============================================================================

(() => {

    const _updateGamepadState = Input._updateGamepadState;
    Input._updateGamepadState = function(gamepad) {
        _updateGamepadState.call(this, gamepad);

        // Xbox B button = index 1
        if (gamepad.buttons[1].pressed) {
            this._currentState[65] = true;  // Keycode 65 = 'A'
        } else {
            this._currentState[65] = false;
        }
    };

})();
