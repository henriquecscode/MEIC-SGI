import { AbstractComponent } from "../components/AbstractComponent.js";
import { StaticSprite } from "../sprites/StaticSprite.js";

export class Leaderboard extends AbstractComponent {
    text = null;
    constructor(sceneGraph, game) {
        super('leaderboard', sceneGraph);
        this.game = game;
        this.sprite = new StaticSprite("leaderboard", this.sceneGraph, "", 0.3, 0.3, 10, -6);
        this.times = {
            'b': 0,
            'w': 0
        }
        this.playing = true;
        this.animations = 0;
        this.previousTime = this.sceneGraph.now;
        this.turnPlayer = this.getGameTurn();
    }

    getStats() {
        let turn = this.getGameTurn();
        if (turn == 'b') {
            turn = 'Black';
        }
        else {
            turn = 'White';
        }
        let p1TotalTime = this.times['b'].toFixed(2) + 's/' + this.game.game.state.TOTAL_TIME;
        let p2TotalTime = this.times['w'].toFixed(2) + 's/' + this.game.game.state.TOTAL_TIME;
        let turnTime = this.turnTime.toFixed(2);
        let p1TurnTime = (this.turnPlayer == 'b' ? (turnTime + 's/' + this.game.game.state.TURN_TIME) : ' ');
        let p2TurnTime = (this.turnPlayer == 'w' ? (turnTime + 's/' + this.game.game.state.TURN_TIME) : ' ');
        let [p1PieceScore, p2PieceScore, p1Games, p2Games] = this.getScores();

        return [turn, p1TotalTime, p2TotalTime, p1TurnTime, p2TurnTime, p1PieceScore, p2PieceScore, p1Games, p2Games];
    }

    getGameTurn() {
        return this.game.game.state.turn;
    }

    getScores() {
        return [this.game.game.state.blackPoints, this.game.game.state.whitePoints, this.game.game.state.blackGames, this.game.game.state.whiteGames];
    }

    getTableText(textArray, spacingArray) {
        let text = [];
        for (let i = 0; i < textArray.length; i++) {
            let lineText = '';
            for (let j = 0; j < textArray[i].length; j++) {
                lineText += textArray[i][j].toString().padEnd(spacingArray[i], ' ');
            }
            text.push(lineText)
        }
        text = text.join('\n');
        return text
    }
    setLeaderboardText() {
        let [turn, p1TotalTime, p2TotalTime, p1TurnTime, p2TurnTime, p1PieceScore, p2PieceScore, p1Games, p2Games] = this.getStats();
        let textArray = [[
            'State', 'Player 1', 'Player 2'
        ],
        [
            'Time', p1TotalTime, p2TotalTime
        ],
        [
            turn + ' Turn', p1TurnTime, p2TurnTime
        ],
        ['Score', p1PieceScore, p2PieceScore],
        ['Games', p1Games, p2Games]
        ]
        let spacingArray = [15, 15, 15, 15, 15];
        let text = this.getTableText(textArray, spacingArray);

        let gameMessage = this.game.game.state.errorMessage;

        if (gameMessage != '') {
            text += '\n' + gameMessage;
        }

        this.sprite.setText(text);
    }

    updateStateTime() {
        this.game.game.state.updateStateTime(this.turnPlayer, this.turnTime, this.times['b'], this.times['w']);
    }

    isGameOver() {
        return this.game.game.state.gameOver;
    }

    updateLeaderboard() {
        if (this.isGameOver()) {
            this.setLeaderboardText();
            return;
        }


        if (this.playing && this.animations == 0) {
            let time = this.sceneGraph.now - this.previousTime;
            this.times[this.turnPlayer] = this.times[this.turnPlayer] + time;
            this.turnTime += time;
            this.updateStateTime();
        }

        let turn = this.getGameTurn();
        if (turn != this.turnPlayer) {
            this.turnPlayer = turn;
            this.endTurn();
        }

        this.previousTime = this.sceneGraph.now;
        this.setLeaderboardText();
    }
    display(path, prevMaterial, prevTexture) {
        this.updateLeaderboard();
        this.sprite.display(path, prevMaterial, prevTexture);
    }

    reset() {
        this.times['b'] = 0;
        this.times['w'] = 0;
        this.turnTime = 0;
        this.previousTime = this.sceneGraph.now;
        this.animations = 0;
    }

    animationStarted() {
        this.animations += 1;
    }

    animationEnded() {
        this.animations -= 1;
    }

    pauseTime() {
        this.playing = false;
    }

    resumeTime() {
        this.playing = true;
    }

    endTurn() {
        this.turnTime = 0;
    }

}