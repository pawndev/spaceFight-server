var playerMask = require("./../infosMasks/playerInfosMask.js");
var ennemyMask = require("./../infosMasks/ennemyInfosMask.js");

var Game = function()
{
    this.players = [];
    this.state = null;
    this.turn = { number : 0, player : null};
}

Game.prototype = {
    launchGame : function()
    {
        this.state = "positioning";
        var playersInfos = this.createPlayersInfos();
        var ennemyInfos = this.createEnnemyInfos();
        this.players.forEach(function(player, index){
            var toSendPlayersInfos = {};
            toSendPlayersInfos.players = [];
            toSendPlayersInfos.players[index] = playersInfos[index];
            toSendPlayersInfos.index = index;
            ennemyInfos.forEach(function(ennemy,indexEnnemy){
                if(index != indexEnnemy)
                {
                    ennemy.index = indexEnnemy;
                    toSendPlayersInfos.players[indexEnnemy] = ennemy;
                }
            });
            player.remote.sendPlayersInfos(toSendPlayersInfos, player.playerId);
        });
    },
    nextTurn : function(id)
    {
        var indexChoose = 0;
        var self = this;
        var playerIndex = this.players.findIndex(function(elem){
            return elem == self.turn.player;
        });
        if((playerIndex + 1) < this.players.length)
        {
            indexChoose = playerIndex + 1;
        }
        else
        {
            indexChoose = 0;
        }
        this.turn.player = this.players[indexChoose];
        return indexChoose;
    },
    gamePhase : function()
    {
        this.state = "game";
        if(this.turn.player == null)
        {
            this.turn.player = this.players[0];
        }
        return true;
    },
    refreshPlayersInfos : function()
    {
        var playersInfos = this.createPlayersInfos();
        var ennemyInfos = this.createEnnemyInfos();
        this.players.forEach(function(player, index){
            var toSendPlayersInfos = {};
            toSendPlayersInfos.players = [];
            toSendPlayersInfos.players[index] = playersInfos[index];
            toSendPlayersInfos.index = index;
            ennemyInfos.forEach(function(ennemy,indexEnnemy){
                if(index != indexEnnemy)
                {
                    ennemy.index = indexEnnemy;
                    toSendPlayersInfos.players[indexEnnemy] = ennemy;
                }
            });
            player.remote.refreshPlayersInfos(toSendPlayersInfos);
        });
    },
    nextPlayer : function(rewind)
    {
        if(this.turn.player == null)
        {
            if(typeof this.players[0] !== "undefined" && this.players[0] !== null)
            {
                this.turn.player = this.players[0];
            }        
            return this.turn.player;
        }
        if(typeof this.players[this.turn.player.number + 1] !== "undefined" && this.players[this.turn.player.number + 1] !== null)
        {
            this.turn.player = this.players[this.turn.player.number + 1];
        }
        else
        {
            if(typeof rewind == "undefined" || rewind == true)
            {
                this.turn.player = this.players[0];
            }
            else
            {
                this.turn.player = null;
            }
        }
        return this.turn.player;
    },
    createEnnemyInfos : function()
    {
        var ennemyInfos = [];
        this.players.forEach(function(player, index){
            var ennemyInfo = {};
            ennemyInfo = player.createPlayerInfos(ennemyMask);
            ennemyInfos.push(ennemyInfo);
        });
        return ennemyInfos;
    },
    createPlayersInfos : function()
    {
        var playersInfos = [];
        this.players.forEach(function(player, index){
            var playerInfos = {};
            playerInfos = player.createPlayerInfos(playerMask);
            playersInfos.push(playerInfos);
        });
        return playersInfos;
    }
};

module.exports = Game;
