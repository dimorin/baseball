export class UI {
    constructor(game) {
      this.game = game;
    }
    
    updateUI() {
      if (!this.game.gameStarted) return;
      
      this.updateScoreboard();
      this.updateInningDisplay();
      this.updateCountDisplay();
      this.updateBaseStatus();
      this.updateTeamInfo();
      this.updateCurrentBatter();
      
      // 게임이 끝났으면 히트 버튼 숨기기
      if (this.game.gameOver) {
        document.getElementById('hit-button').classList.add('hidden');
      } else if (this.game.isPlayerTurn) {
        document.getElementById('hit-button').classList.remove('hidden');
      } else {
        document.getElementById('hit-button').classList.add('hidden');
      }
    }
    
    updateScoreboard() {
      const teamARow = document.getElementById('team-a-score').children;
      const teamBRow = document.getElementById('team-b-score').children;
      
      // 이닝별 점수 업데이트
      for (let i = 0; i < this.game.scores.length; i++) {
        teamARow[i + 1].textContent = this.game.scores[i][0];
        teamBRow[i + 1].textContent = this.game.scores[i][1];
      }
      
      // 총점 업데이트
      teamARow[10].textContent = this.game.getTotalScore(0);
      teamBRow[10].textContent = this.game.getTotalScore(1);
    }
    
    updateInningDisplay() {
      document.getElementById('inning-display').textContent = this.game.getCurrentInningDisplay();
    }
    
    updateCountDisplay() {
      document.getElementById('strike-count').textContent = this.game.strikes;
      document.getElementById('ball-count').textContent = this.game.balls;
      document.getElementById('out-count').textContent = this.game.outs;
    }
    
    updateBaseStatus() {
      document.getElementById('first-base').classList.toggle('occupied', this.game.bases[0]);
      document.getElementById('second-base').classList.toggle('occupied', this.game.bases[1]);
      document.getElementById('third-base').classList.toggle('occupied', this.game.bases[2]);
    }
    
    updateTeamInfo() {
      if (!this.game.teamA || !this.game.teamB) return;
      
      const teamAList = document.getElementById('team-a-players');
      const teamBList = document.getElementById('team-b-players');
      const defenseTeam = document.getElementById('defense-team');
      
      // 팀 정보 초기화
      teamAList.innerHTML = '';
      teamBList.innerHTML = '';
      defenseTeam.innerHTML = '';
      
      // A팀 선수 목록
      this.game.teamA.players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.number}번 ${player.name} - ${player.position}`;
        teamAList.appendChild(li);
      });
      
      // B팀 선수 목록
      this.game.teamB.players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.number}번 ${player.name} - ${player.position}`;
        teamBList.appendChild(li);
      });
      
      // 수비팀 표시
      const defensePlayers = this.game.isTopInning ? this.game.teamB.players : this.game.teamA.players;
      defensePlayers.forEach(player => {
        const div = document.createElement('div');
        div.className = 'player-card';
        div.textContent = `${player.number}번 ${player.name}\n${player.position}`;
        defenseTeam.appendChild(div);
      });
      
      // 타격 버튼에 현재 투수 이름 표시
      document.getElementById('hit-button').textContent = 
        `${this.game.isPlayerTurn ? this.game.teamB.pitcher.name : this.game.teamA.pitcher.name} 투수에게 타격하기`;
    }
    
    updateCurrentBatter() {
      if (!this.game.currentBatter) return;
      
      const currentBatterElement = document.getElementById('current-batter');
      const teamName = this.game.isPlayerTurn ? 'A팀' : 'B팀';
      currentBatterElement.textContent = 
        `현재 타자: ${teamName} ${this.game.currentBatter.number}번 ${this.game.currentBatter.name}`;
      currentBatterElement.style.color = this.game.isPlayerTurn ? '#4285f4' : '#ea4335';
    }
    
    simulateComputerTurn() {
      if (this.game.gameOver || this.game.isPlayerTurn) return;
      
      const simulateBat = () => {
        if (this.game.outs < 3 && !this.game.gameOver) {
          const battingResult = this.game.computerBat();
          this.updateUI();
          this.updateBattingResult(battingResult.result, battingResult.message);
          
          // 이닝이 끝났는지 확인
          if (this.game.isInningOver()) {
            setTimeout(() => {
              const inningInfo = this.game.switchInning();
              this.updateUI();
              this.resetBattingResult(); // 타격 결과 초기화
              
              // 다음 이닝이 컴퓨터 차례라면 계속 진행
              if (!this.game.isPlayerTurn && !this.game.gameOver) {
                setTimeout(simulateBat, 1000);
              }
            }, 1000);
          } else {
            // 아웃이 아직 3개가 아니면 계속 진행
            setTimeout(simulateBat, 1000);
          }
        }
      };
      
      // 컴퓨터 차례 시작
      setTimeout(simulateBat, 1000);
    }
    
    updateBattingResult(result, message) {
        if (!result || !message) {
          console.warn("타격 결과 또는 메시지가 없습니다.");
          return;
        }
        
        const battingResult = document.getElementById('batting-result');
        battingResult.textContent = message;
        
        // 타격 결과에 따라 배경색 변경
        switch(result) {
          case '1루타':
          case '2루타':
          case '3루타':
            battingResult.style.backgroundColor = '#e6ffe6'; // 연한 녹색
            battingResult.style.color = '#006600';
            break;
          case '홈런':
            battingResult.style.backgroundColor = '#ffff99'; // 연한 노란색
            battingResult.style.color = '#cc6600';
            break;
          case '파울':
            battingResult.style.backgroundColor = '#f9f9f9'; // 연한 회색
            battingResult.style.color = '#666666';
            break;
          case '플라이':
          case '땅볼':
            battingResult.style.backgroundColor = '#ffe6e6'; // 연한 빨간색
            battingResult.style.color = '#cc0000';
            break;
          default:
            battingResult.style.backgroundColor = 'white';
            battingResult.style.color = '#333333';
        }
        
        // 애니메이션 효과 추가
        battingResult.style.transition = 'none';
        battingResult.style.transform = 'scale(1.1)';
        setTimeout(() => {
          battingResult.style.transition = 'transform 0.3s ease';
          battingResult.style.transform = 'scale(1)';
        }, 50);
        
        // 다음 타자 정보 업데이트
        this.updateCurrentBatter();
      }
    
    resetBattingResult() {
      const battingResult = document.getElementById('batting-result');
      const attackingTeam = this.game.isPlayerTurn ? 'A팀' : 'B팀';
      battingResult.textContent = `${attackingTeam}의 공격이 시작됩니다!`;
      battingResult.style.backgroundColor = '#f0f8ff'; // 연한 파란색
      battingResult.style.color = '#333333';
    }
  } 