export class Player {
    constructor(name, position, number) {
      this.name = name;
      this.position = position;
      this.number = number;
      
      // 추후 확장을 위한 능력치
      this.battingPower = Math.floor(Math.random() * 100) + 1;
      this.battingAccuracy = Math.floor(Math.random() * 100) + 1;
      this.pitchingPower = Math.floor(Math.random() * 100) + 1;
      this.pitchingAccuracy = Math.floor(Math.random() * 100) + 1;
    }
  } 