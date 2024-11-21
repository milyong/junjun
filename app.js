function loadTexture(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
    });
}

window.onload = async () => {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    // Load images
    const spaceImg = await loadTexture('assets/starBackground.png'); // 배경 이미지 (우주)
    const heroImg = await loadTexture('assets/player.png');
    const enemyImg = await loadTexture('assets/enemyShip.png');

    // Create background pattern
    const spacePattern = ctx.createPattern(spaceImg, 'repeat'); // 반복 패턴 생성
    ctx.fillStyle = spacePattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height); // 배경 채우기

    // Draw main hero spaceship
    const heroX = canvas.width / 2 - 45; // Main spaceship X position
    const heroY = canvas.height - (canvas.height / 4); // Main spaceship Y position
    ctx.drawImage(heroImg, heroX, heroY);

    // Draw smaller left spaceship
    const smallWidth = heroImg.width * 0.5; // Scale width to 50%
    const smallHeight = heroImg.height * 0.5; // Scale height to 50%
    const leftX = heroX - smallWidth - 20; // Position to the left of main spaceship
    const leftY = heroY + heroImg.height / 4; // Slightly lower than main spaceship
    ctx.drawImage(heroImg, leftX, leftY, smallWidth, smallHeight);

    // Draw smaller right spaceship
    const rightX = heroX + heroImg.width + 20; // Position to the right of main spaceship
    ctx.drawImage(heroImg, rightX, leftY, smallWidth, smallHeight);


    // Create and draw enemies in reverse pyramid
    createEnemies2(ctx, canvas, enemyImg);
};

function createEnemies(ctx, canvas, enemyImg) {
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;

    for (let x = START_X; x < STOP_X; x += enemyImg.width) {
        for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
            ctx.drawImage(enemyImg, x, y);
        }
    }
}

function createEnemies2(ctx, canvas, enemyImg) {
    const ROWS = 5; // 피라미드의 행 개수
    const START_Y = 0; // 첫 번째 행의 Y 좌표
    const GAP = 2; // 우주선 사이 간격

    for (let row = 0; row < ROWS; row++) {
        const numEnemies = ROWS - row; // 현재 행의 우주선 개수 (맨 위부터 5, 4, 3, 2, 1)
        const rowWidth = numEnemies * enemyImg.width + (numEnemies - 1) * GAP; // 현재 행의 전체 폭
        const startX = (canvas.width - rowWidth) / 2; // 현재 행의 시작 X 좌표

        for (let col = 0; col < numEnemies; col++) {
            const x = startX + col * (enemyImg.width + GAP); // 현재 우주선의 X 좌표
            const y = START_Y + row * (enemyImg.height + GAP); // 현재 행의 Y 좌표
            ctx.drawImage(enemyImg, x, y); // 우주선 그리기
        }
    }
}
