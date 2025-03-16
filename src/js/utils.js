export class Utils {
    static weightedRandom(items, weights) {
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      let random = Math.random() * totalWeight;
      
      for (let i = 0; i < items.length; i++) {
        if (random < weights[i]) {
          return items[i];
        }
        random -= weights[i];
      }
      
      return items[items.length - 1];
    }
  } 