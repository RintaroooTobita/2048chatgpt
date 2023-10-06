function addRandomTile() {
    const tiles = document.querySelectorAll(".tile");
    const emptyTiles = [...tiles].filter(tile => !tile.firstChild); // まだ数字がないタイルを取得

    if (emptyTiles.length) { // まだ数字がないタイルが存在する場合
        const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        const value = (Math.random() < 0.9) ? 2 : 4; // 2か4のいずれかの数字を生成(2が90%の確率で、4が10%の確率で生成される)

        // タイル要素を作成してランダムな位置に配置する
        const numTile = document.createElement("div");
        numTile.classList.add("num-tile", `tile-${value}`);
        numTile.textContent = value;
        randomTile.appendChild(numTile);

        const position = getTilePosition(randomTile);
        board[position.row][position.col] = value;
    }
}

function getTilePosition(tileElement) {
    const tiles = document.querySelectorAll(".tile");
    const index = [...tiles].indexOf(tileElement);
    return {
        row: Math.floor(index / 4),
        col: index % 4
    }
}

function initializeTiles() {
    // 全ての数字タイルを削除
    const numTiles = document.querySelectorAll(".num-tile");
    numTiles.forEach(tile => tile.remove());

    // 2つのタイルを配置する
    for (let i = 0; i < 2; i++) {
        addRandomTile();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // タイルの初期配置を実行
    initializeTiles();
});


class Tile {
    constructor(x, y, value) {
        this.x = x;        // タイルの列位置
        this.y = y;        // タイルの行位置
        this.value = value; // タイルの数字
    }

    // 移動メソッド
    moveTo(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    // タイルの結合メソッド
    mergeWith(otherTile) {
        // 2つのタイルの値を合計
        this.value += otherTile.value;
        otherTile.value = 0;  // 結合後、他方のタイルは値0にして非活性化 (ゲームロジックにより)
    }
}

// ゲームの状態を保存する2D配列 (4x4)
let board = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
];

// キーボードイベントの処理
document.addEventListener('keydown', function(event) {

    const previousBoard = board.map(row => row.slice());

    switch(event.key) {
        case 'ArrowUp':
            moveTiles('UP');
            combineTiles('UP');
            moveTiles('UP');
            break;
        case 'ArrowDown':
            moveTiles('DOWN');
            combineTiles('DOWN');
            moveTiles('DOWN');
            break;
        case 'ArrowLeft':
            moveTiles('LEFT');
            combineTiles('LEFT');
            moveTiles('LEFT');
            break;
        case 'ArrowRight':
            moveTiles('RIGHT');
            combineTiles('RIGHT');
            moveTiles('RIGHT');
            break;
    }

    updateTiles();

    const hasChanged = board.some((row, rowIndex) => {
        return row.some((value, colIndex) => value !== previousBoard[rowIndex][colIndex]);
    });

    if (hasChanged) {
        addRandomTile();
        checkGameStatus();
        if (isGameOver()) {
            document.getElementById("game-over-screen").style.display = "flex";
            document.getElementById("game-over-retry").style.display = "block";
        }
    }
    console.log(board);
    // タイルの更新や新しいタイルの追加などのその他のロジックをここに追加

});

function combineTiles(direction) {
    switch(direction) {
        case 'UP':
            for(let j = 0; j < 4; j++) {
                for(let i = 0; i < 3; i++) {
                    if(board[i][j] !== null && board[i+1][j] === board[i][j]) {
                        board[i][j] *= 2;
                        board[i+1][j] = null;
                        i++;  // 同じタイルを複数回結合しないようにするためにインクリメント
                    }
                }
            }
            break;
        case 'DOWN':
            for(let j = 0; j < 4; j++) {
                for(let i = 3; i > 0; i--) {
                    if(board[i][j] !== null && board[i-1][j] === board[i][j]) {
                        board[i][j] *= 2;
                        board[i-1][j] = null;
                        i--;  // 同じタイルを複数回結合しないようにするためにデクリメント
                    }
                }
            }
            break;
        case 'LEFT':
            for(let i = 0; i < 4; i++) {
                for(let j = 0; j < 3; j++) {
                    if(board[i][j] !== null && board[i][j+1] === board[i][j]) {
                        board[i][j] *= 2;
                        board[i][j+1] = null;
                        j++;  // 同じタイルを複数回結合しないようにするためにインクリメント
                    }
                }
            }
            break;
        case 'RIGHT':
            for(let i = 0; i < 4; i++) {
                for(let j = 3; j > 0; j--) {
                    if(board[i][j] !== null && board[i][j-1] === board[i][j]) {
                        board[i][j] *= 2;
                        board[i][j-1] = null;
                        j--;  // 同じタイルを複数回結合しないようにするためにデクリメント
                    }
                }
            }
            break;
    }
}


// moveTilesとcombineTilesの具体的な実装は、
// 実際のゲームの要件やTileクラスの詳細に応じて変わる可能性があります。
function moveTiles(direction) {
    switch(direction) {
        case 'UP':
            for(let j = 0; j < 4; j++) {
                let emptyRow = -1;  // 空の行を追跡
                for(let i = 0; i < 4; i++) {
                    if(board[i][j] !== null) {
                        if(emptyRow !== -1) {
                            board[emptyRow][j] = board[i][j];
                            board[i][j] = null;
                            i = emptyRow;
                            emptyRow = -1;
                        }
                    } else if(emptyRow === -1) {
                        emptyRow = i;
                    }
                }
            }
            break;
        case 'DOWN':
            for(let j = 0; j < 4; j++) {
                let emptyRow = -1;  // 空の行を追跡
                for(let i = 3; i >= 0; i--) {
                    if(board[i][j] !== null) {
                        if(emptyRow !== -1) {
                            board[emptyRow][j] = board[i][j];
                            board[i][j] = null;
                            i = emptyRow;
                            emptyRow = -1;
                        }
                    } else if(emptyRow === -1) {
                        emptyRow = i;
                    }
                }
            }
            break;
        case 'LEFT':
            for(let i = 0; i < 4; i++) {
                let emptyCol = -1;  // 空の列を追跡
                for(let j = 0; j < 4; j++) {
                    if(board[i][j] !== null) {
                        if(emptyCol !== -1) {
                            board[i][emptyCol] = board[i][j];
                            board[i][j] = null;
                            j = emptyCol;
                            emptyCol = -1;
                        }
                    } else if(emptyCol === -1) {
                        emptyCol = j;
                    }
                }
            }
            break;
        case 'RIGHT':
            for(let i = 0; i < 4; i++) {
                let emptyCol = -1;  // 空の列を追跡
                for(let j = 3; j >= 0; j--) {
                    if(board[i][j] !== null) {
                        if(emptyCol !== -1) {
                            board[i][emptyCol] = board[i][j];
                            board[i][j] = null;
                            j = emptyCol;
                            emptyCol = -1;
                        }
                    } else if(emptyCol === -1) {
                        emptyCol = j;
                    }
                }
            }
            break;
    }
}

function updateTiles() {
    // 全てのタイルを一旦削除
    const tiles = document.querySelectorAll(".num-tile");
    tiles.forEach(tile => {
        tile.remove();
    });

    const gridTiles = document.querySelectorAll(".tile");

    // board変数に基づいてタイルを更新
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] !== null) {
                const tile = document.createElement('div');
                tile.classList.add('num-tile', `tile-${board[i][j]}`);
                tile.textContent = board[i][j];
                
                // 適切な.tile要素の中に.num-tileを追加する
                const parentTile = gridTiles[i * 4 + j];
                parentTile.appendChild(tile);
            }
        }
    }
}

function isGameClear() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 2048) {
                return true;
            }
        }
    }
    return false;
}

// タイルが動いた後など、ゲームの進行に合わせて呼び出します。
function checkGameStatus() {
    if (isGameClear()) {
        // ゲームクリアの画面を表示
        document.getElementById('game-clear-screen').style.display = 'flex';

        // タイルの動きやキー入力などを無効にする追加のロジックが必要な場合はここに実装
    }
}

// Retryボタンにイベントを追加
document.getElementById('retry-btn-end').addEventListener('click', function() {
    document.getElementById('game-clear-screen').style.display = 'flex';
    // その他のゲームのリセットロジック（タイルの初期化など）もここに追加
    initializeGame();
});

function initializeGame() {
    // 1. ゲームボードを初期状態に戻す
    const numTiles = document.querySelectorAll(".num-tile");
    numTiles.forEach(tile => tile.remove());

    // 2. board変数を初期状態にリセット
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            board[i][j] = null;
        }
    }

    // 初期タイルを2つランダムに設置
    addRandomTile();
    addRandomTile();

    // 3. ゲームクリアメッセージを非表示にする
    document.getElementById("game-clear-screen").style.display = "none";

    // 4. スコアを0にリセットする
    const scoreElement = document.getElementById("score-value");
    scoreElement.textContent = '0';
}

function isGameOver() {
    // 全てのタイルが数字で埋まっているかチェック
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === null) {
                return false; // 空きタイルがあるので、ゲームオーバーではない
            }
        }
    }

    // 隣接するタイルが全て異なる数字かチェック
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // 右, 下, 左, 上
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            for (const [dx, dy] of directions) {
                const x = i + dx;
                const y = j + dy;
                if (x >= 0 && x < 4 && y >= 0 && y < 4 && board[i][j] === board[x][y]) {
                    return false; // 隣接する同じ数字のタイルがあるので、ゲームオーバーではない
                }
            }
        }
    }

    return true; // 上記の条件を満たす場合、ゲームオーバー
}

document.getElementById("game-over-retry").addEventListener("click", function() {
    document.getElementById("game-over-screen").style.display = "none";
    initializeGame();
});
