import { Player } from './player.js';
import { Utils } from './utils.js';

export class Team {
  constructor(name, isPlayerTeam) {
    this.name = name;
    this.isPlayerTeam = isPlayerTeam;
    this.players = this.generatePlayers();
    this.pitcher = this.players[0]; // 첫 번째 선수를 투수로 지정
    this.currentBatterIndex = 0;
  }
  
  generatePlayers() {
    const players = [];
    const positions = [
      '투수', '포수', '1루수', '2루수', '3루수', 
      '유격수', '좌익수', '중견수', '우익수'
    ];
    
    const firstNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
    const lastNames = ['민준', '서준', '예준', '도윤', '시우', '주원', '하준', '지호', '준서', '준우'];
    
    for (let i = 0; i < 9; i++) {
      const name = firstNames[Math.floor(Math.random() * firstNames.length)] + 
                  lastNames[Math.floor(Math.random() * lastNames.length)];
      const position = positions[i];
      const number = Math.floor(Math.random() * 99) + 1;
      
      players.push(new Player(name, position, number));
    }
    
    return players;
  }
  
  getNextBatter() {
    const batter = this.players[this.currentBatterIndex];
    this.currentBatterIndex = (this.currentBatterIndex + 1) % 9;
    return batter;
  }
} 