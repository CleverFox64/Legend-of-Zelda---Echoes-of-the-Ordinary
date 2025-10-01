/*:
 * @plugindesc v1.0 Allows you to change the Map Name window position (x, y) with plugin parameters. Default: Top-Center.
 * @author James Branford
 *
 * @param Position Mode
 * @type select
 * @option Top-Left
 * @value topleft
 * @option Top-Center
 * @value topcenter
 * @option Top-Right
 * @value topright
 * @option Bottom-Left
 * @value bottomleft
 * @option Bottom-Center
 * @value bottomcenter
 * @option Bottom-Right
 * @value bottomright
 * @option Custom (use offsets)
 * @value custom
 * @default topcenter
 *
 * @param X Offset
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc Adjusts the X position of the Map Name window.
 *
 * @param Y Offset
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc Adjusts the Y position of the Map Name window.
 *
 * @help
 * ============================================================================
 * Map Name Position
 * ============================================================================
 * This plugin allows you to move the Map Name window anywhere on screen.
 *
 * Choose a preset position (like Top-Center or Bottom-Right), and/or use
 * X Offset and Y Offset to nudge it further.
 *
 * Example: Top-Center with X Offset = 0, Y Offset = 50
 * → Moves the window down 50px from the top center.
 *
 * ============================================================================
 * Terms of Use: Free for commercial and non-commercial RPG Maker MV projects.
 * ============================================================================
 */
(function() {
    var parameters = PluginManager.parameters('MapNamePosition');
    var positionMode = String(parameters['Position Mode'] || 'topcenter');
    var xOffset = Number(parameters['X Offset'] || 0);
    var yOffset = Number(parameters['Y Offset'] || 0);

    Window_MapName.prototype.initialize = function() {
        var width = this.windowWidth();
        var height = this.windowHeight();
        var x = 0;
        var y = 0;

        switch (positionMode.toLowerCase()) {
            case 'topleft':
                x = 0;
                y = 0;
                break;
            case 'topcenter':
                x = (Graphics.boxWidth - width) / 2;
                y = 0;
                break;
            case 'topright':
                x = Graphics.boxWidth - width;
                y = 0;
                break;
            case 'bottomleft':
                x = 0;
                y = Graphics.boxHeight - height;
                break;
            case 'bottomcenter':
                x = (Graphics.boxWidth - width) / 2;
                y = Graphics.boxHeight - height;
                break;
            case 'bottomright':
                x = Graphics.boxWidth - width;
                y = Graphics.boxHeight - height;
                break;
            case 'custom':
            default:
                x = 0;
                y = 0;
                break;
        }

        x += xOffset;
        y += yOffset;

        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.opacity = 0;
        this.contentsOpacity = 0;
        this._showCount = 0;
        this.refresh();
    };
})();
