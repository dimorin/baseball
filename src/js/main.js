import { Game } from './game.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  const ui = new UI(game);
  
  // 게임 시작 버튼 이벤트 리스너
  document.getElementById('start-button').addEventListener('click', () => {
    game.startGame();
    ui.updateUI();
  });
  
  // 타격 버튼 이벤트 리스너
  // 타격 버튼 이벤트 리스너
document.getElementById('hit-button').addEventListener('click', () => {
  const battingResult = game.playerBat();
  console.log("플레이어 타격 결과:", battingResult);
  
  if (!battingResult) {
    console.error("타격 결과가 없습니다.");
    return;
  }
  
  ui.updateUI();
  
  if (battingResult.result) {
    ui.updateBattingResult(battingResult.result, battingResult.message);
  }
  
  // 이닝이 끝났는지 확인
  if (game.isInningOver()) {
    console.log("이닝 종료, 전환 예정");
    setTimeout(() => {
      game.switchInning();
      ui.updateUI();
      ui.resetBattingResult(); // 타격 결과 초기화
      
      // 컴퓨터 차례라면 자동으로 진행
      if (!game.isPlayerTurn) {
        console.log("컴퓨터 턴 시작");
        ui.simulateComputerTurn();
      }
    }, 1000);
  }
});
  
  // 다시 하기 버튼 이벤트 리스너
  document.getElementById('replay-button').addEventListener('click', () => {
    game.resetGame();
    ui.updateUI();
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('game-over').classList.add('hidden');
  });
}); 