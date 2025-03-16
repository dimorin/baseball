import { Team } from './team.js';
import { Utils } from './utils.js';

export class Game {
  constructor() {
    this.teamA = null; // 사용자 팀
    this.teamB = null; // 컴퓨터 팀
    this.currentInning = 1;
    this.isTopInning = true; // true: 초(공격: A팀), false: 말(공격: B팀)
    this.isPlayerTurn = true;
    this.strikes = 0;
    this.balls = 0;
    this.outs = 0;
    this.bases = [false, false, false]; // 1루, 2루, 3루
    this.scores = Array(9).fill().map(() => [0, 0]); // [A팀, B팀]의 이닝별 점수
    this.gameStarted = false;
    this.gameOver = false;
    this.currentBatter = null;
    this.currentPitcher = null;
  }
  
  startGame() {
    this.teamA = new Team('A팀', true);
    this.teamB = new Team('B팀', false);
    this.gameStarted = true;
    this.isPlayerTurn = true;
    this.currentBatter = this.teamA.getNextBatter();
    this.currentPitcher = this.teamB.pitcher;
    
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    document.getElementById('team-info').classList.remove('hidden');
    document.getElementById('hit-button').classList.remove('hidden');
  }
  
  resetGame() {
    this.teamA = null;
    this.teamB = null;
    this.currentInning = 1;
    this.isTopInning = true;
    this.isPlayerTurn = true;
    this.strikes = 0;
    this.balls = 0;
    this.outs = 0;
    this.bases = [false, false, false];
    this.scores = Array(9).fill().map(() => [0, 0]);
    this.gameStarted = false;
    this.gameOver = false;
    this.currentBatter = null;
    this.currentPitcher = null;
  }
  
  playerBat() {
    if (!this.gameStarted || this.gameOver) return;
    
    const result = this.getBattingResult();
    const resultData = this.processBattingResult(result);
    
    return resultData; // { result, message } 객체 반환
  }
  
  computerBat() {
    if (!this.gameStarted || this.gameOver || this.isPlayerTurn) {
      return { result: null, message: "컴퓨터 차례가 아닙니다." };
    }
    
    try {
      const result = this.getBattingResult();
      return this.processBattingResult(result);
    } catch (error) {
      console.error("컴퓨터 타격 중 오류 발생:", error);
      return { result: null, message: "오류가 발생했습니다." };
    }
  }
  
  getBattingResult() {
    // 랜덤으로 타격 결과 생성
    const results = ['1루타', '2루타', '3루타', '홈런', '파울', '플라이', '땅볼'];
    const weights = [15, 10, 5, 5, 25, 20, 20]; // 각 결과의 가중치
    
    return Utils.weightedRandom(results, weights);
  }
  
  processBattingResult(result) {
    let message = '';
    
    switch (result) {
      case '1루타':
        this.advanceRunners(1);
        this.resetCount();
        message = `${this.currentBatter.name}의 안타! 1루로 진루합니다.`;
        break;
      case '2루타':
        this.advanceRunners(2);
        this.resetCount();
        message = `${this.currentBatter.name}의 2루타! 2루로 진루합니다.`;
        break;
      case '3루타':
        this.advanceRunners(3);
        this.resetCount();
        message = `${this.currentBatter.name}의 3루타! 3루로 진루합니다.`;
        break;
      case '홈런':
        this.advanceRunners(4);
        this.resetCount();
        message = `${this.currentBatter.name}의 홈런! 모든 주자가 홈으로 들어옵니다!`;
        break;
      case '파울':
        if (this.strikes < 2) {
          this.strikes++;
        }
        message = `${this.currentBatter.name}의 파울! 스트라이크 ${this.strikes}`;
        // 파울은 타자 교체 없음
        return { result, message };
        break;
      case '플라이':
        this.outs++;
        this.resetCount();
        message = `${this.currentBatter.name}의 플라이 아웃! 아웃 ${this.outs}`;
        break;
      case '땅볼':
        this.outs++;
        this.resetCount();
        message = `${this.currentBatter.name}의 땅볼 아웃! 아웃 ${this.outs}`;
        break;
      default:
        message = "알 수 없는 타격 결과입니다.";
        break;
    }
    
    // 다음 타자로 교체 (파울이 아닌 모든 경우)
    const currentTeam = this.isPlayerTurn ? this.teamA : this.teamB;
    this.currentBatter = currentTeam.getNextBatter();
    
    // 게임 종료 체크
    this.checkGameOver();
    
    return { result, message };
  }
  
  advanceRunners(bases) {
    // 홈런이면 모든 주자와 타자가 홈으로
    if (bases === 4) {
      let runs = 1; // 타자 자신
      for (let i = 0; i < this.bases.length; i++) {
        if (this.bases[i]) {
          runs++;
          this.bases[i] = false;
        }
      }
      this.addScore(runs);
      return;
    }
    
    // 일반 안타 처리
    for (let i = this.bases.length - 1; i >= 0; i--) {
      if (this.bases[i]) {
        const newPosition = i + bases;
        if (newPosition >= 3) {
          // 홈으로 들어옴
          this.addScore(1);
          this.bases[i] = false;
        } else {
          // 다음 베이스로 진루
          this.bases[newPosition] = true;
          this.bases[i] = false;
        }
      }
    }
    
    // 타자 진루
    this.bases[bases - 1] = true;
  }
  
  addScore(runs) {
    const inningIndex = this.currentInning - 1;
    const teamIndex = this.isTopInning ? 0 : 1;
    
    this.scores[inningIndex][teamIndex] += runs;
  }
  
  resetCount() {
    this.strikes = 0;
    this.balls = 0;
  }
  
  isInningOver() {
    return this.outs >= 3;
  }
  
  switchInning() {
    this.outs = 0;
    this.bases = [false, false, false];
    this.resetCount();
    
    if (this.isTopInning) {
      // 초 -> 말
      this.isTopInning = false;
      this.isPlayerTurn = false;
      // 이닝이 바뀌어도 B팀의 타순은 유지
      this.currentBatter = this.teamB.players[this.teamB.currentBatterIndex];
      this.currentPitcher = this.teamA.pitcher;
    } else {
      // 말 -> 다음 이닝 초
      this.isTopInning = true;
      this.isPlayerTurn = true;
      this.currentInning++;
      // 이닝이 바뀌어도 A팀의 타순은 유지
      this.currentBatter = this.teamA.players[this.teamA.currentBatterIndex];
      this.currentPitcher = this.teamB.pitcher;
      
      // 9회 말이 끝나면 게임 종료
      if (this.currentInning > 9) {
        this.gameOver = true;
      }
    }
    
    // 타격 결과 초기화 (DOM 조작은 UI 클래스에서 처리)
    return {
      inningChanged: true,
      newInning: this.currentInning,
      isTopInning: this.isTopInning,
      attackingTeam: this.isPlayerTurn ? 'A팀' : 'B팀'
    };
  }
  
  checkGameOver() {
    if (this.currentInning === 9 && !this.isTopInning && this.isInningOver()) {
      this.gameOver = true;
      
      document.getElementById('game-container').classList.add('hidden');
      document.getElementById('team-info').classList.add('hidden');
      document.getElementById('game-over').classList.remove('hidden');
      
      const teamATotal = this.getTotalScore(0);
      const teamBTotal = this.getTotalScore(1);
      let resultMessage = '';
      
      if (teamATotal > teamBTotal) {
        resultMessage = `A팀 승리! ${teamATotal} : ${teamBTotal}`;
      } else if (teamBTotal > teamATotal) {
        resultMessage = `B팀 승리! ${teamBTotal} : ${teamATotal}`;
      } else {
        resultMessage = `무승부! ${teamATotal} : ${teamBTotal}`;
      }
      
      document.getElementById('final-score').textContent = resultMessage;
    }
  }
  
  getTotalScore(teamIndex) {
    return this.scores.reduce((total, inning) => total + inning[teamIndex], 0);
  }
  
  getCurrentInningDisplay() {
    return `${this.currentInning}회 ${this.isTopInning ? '초' : '말'} 공격: ${this.isTopInning ? 'A팀' : 'B팀'}`;
  }
} 