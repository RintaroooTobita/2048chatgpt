// ゲームの状態を保存する2D配列 (4x4)
let board = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
];

// キーボードイベントの処理
document.addEventListener('keydown', function(event) {
    let isChanged = false;
    let prevBoard = JSON.parse(JSON.stringify(board));

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
    // タイルの更新や新しいタイルの追加などのその他のロジックをここに追加

    // boardが前の状態と変化しているかを確認
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (prevBoard[i][j] !== board[i][j]) {
                isChanged = true;
                break;
            }
        }
        if (isChanged) {
            break;
        }
    }

    if (isChanged) {
        addRandomTile();
    }

    updateTiles();
});

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

function updateTiles() {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        const value = board[row][col];

        // タイルの中身を削除
        while (tile.firstChild) {
            tile.removeChild(tile.firstChild);
        }

        if (value !== 0) {
            // 新しいタイル要素を作成
            const numTile = document.createElement("div");
            numTile.classList.add("num-tile", `tile-${value}`);
            numTile.textContent = value;
            tile.appendChild(numTile);
        }
    });
}



// moveTilesとcombineTilesの具体的な実装は、
// 実際のゲームの要件やTileクラスの詳細に応じて変わる可能性があります。

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

document.addEventListener("DOMContentLoaded", function() {
    // タイルの初期配置を行う関数
    function initializeTiles() {
        // 全ての数字タイルを削除
        const numTiles = document.querySelectorAll(".num-tile");
        numTiles.forEach(tile => tile.remove());

        // 2つのタイルを配置する
        for (let i = 0; i < 2; i++) {
            addRandomTile();
        }
    }

    function getPosition(tileElement) {
        const id = tileElement.id;
        const coordinates = id.split("-");
        const position = {
            row: parseInt(coordinates[1], 10),
            col: parseInt(coordinates[2], 10)
        };
        return position;
    }

    // ランダムな位置にタイルを配置する関数
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

            const position = getPosition(randomTile);
            board[position.row][position.col] = value;
            console.log(board);
        }
    }

    // タイルの初期配置を実行
    initializeTiles();

    // Retryボタンのクリックイベントを追加
    const retryButton = document.getElementById("retry-btn");
    retryButton.addEventListener("click", function() {
        initializeTiles();
    });
});

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

        const position = getPosition(randomTile);
        board[position.row][position.col] = value;
        console.log(board);
    }
}