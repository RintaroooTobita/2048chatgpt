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
