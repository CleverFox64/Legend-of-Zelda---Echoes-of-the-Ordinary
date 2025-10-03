


/*
    //For compatibility with [Plugin name]
    Achievement_PopUp.prototype.[Missing methode] = function(text) {
        return Window_Base.prototype.[Missing methode].call(this, text);
    };
*/
//#region Olivia_OctoBattle
    if (Imported.Olivia_OctoBattle) {
        Achievement_PopUp.prototype.convertBPEscapeCharacters = function(text) {
            return Window_Base.prototype.convertBPEscapeCharacters.call(this, text);
        }
    };
//#region YEP_X_InBattleStatus
    if (Imported.YEP_X_InBattleStatus) {
        Achievement_PopUp.prototype.convertStateHelpText = function(text) {
            return Window_Base.prototype.convertStateHelpText.call(this, text);
        }
    };
//#region YEP_X_MessageMacros1
    if (Imported.YEP_X_MessageMacros1) {
        Achievement_PopUp.prototype.convertMacroText = function(text) {
            return Window_Base.prototype.convertMacroText.call(this, text);
        }
    };
//#region YEP_X_ExtMesPack1
    if (Imported.YEP_X_ExtMesPack1) {
        Achievement_PopUp.prototype.convertPlaytime = function(text) {
            return Window_Base.prototype.convertPlaytime.call(this, text);
        }

        Achievement_PopUp.prototype.convertMapName = function(text) {
            return Window_Base.prototype.convertMapName.call(this, text);
        }

        Achievement_PopUp.prototype.convertEnemyName = function(text) {
            return Window_Base.prototype.convertEnemyName.call(this, text);
        }

        Achievement_PopUp.prototype.convertDigitGrouping = function(text) {
            return Window_Base.prototype.convertDigitGrouping.call(this, text);
        }
    }

//#region YEP_X_ExtMesPack2
    if (Imported.YEP_X_ExtMesPack2) {
        Achievement_PopUp.prototype.convertItemQuantitiesCodes = function(text) {
            return Window_Base.prototype.convertItemQuantitiesCodes.call(this, text);
        }

        Achievement_PopUp.prototype.convertActorParameterCodes = function(text) {
            return Window_Base.prototype.convertActorParameterCodes.call(this, text);
        }

        Achievement_PopUp.prototype.convertEnemyParameterCodes = function(text) {
            return Window_Base.prototype.convertEnemyParameterCodes.call(this, text);
        }

        Achievement_PopUp.prototype.convertColorCompare = function(text) {
            return Window_Base.prototype.convertColorCompare.call(this, text);
        }

        Achievement_PopUp.prototype.convertCaseText = function(text) {
            return Window_Base.prototype.convertCaseText.call(this, text);
        }
    }
