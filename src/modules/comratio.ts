export interface ComputedRatio {
  width: number;
  height: number;
  top: number;
  left: number;
  ratio: number;
  offset: boolean;
}

/**
  CSS cover, contain JavaScript support
*/
export function cover(ow: number, oh: number, tw: number, th: number, offsetX: number = 0.5, offsetY: number = 0.5) {
  const originalAspectRatio = ow / oh;
  const targetAspectRatio = tw / th;
  
  return originalAspectRatio < targetAspectRatio 
    ? ({
      width: oh * targetAspectRatio,
      height: oh,
      top: 0,
      left: (ow - oh * targetAspectRatio) * offsetX,
      ratio: oh/th,
      offset: true,
    })
    :
    ({
      width: ow,
      height: ow / targetAspectRatio,
      top: (oh - ow / targetAspectRatio) * offsetY,
      left: 0,
      ratio: ow/tw,
      offset: false,
    });
}

export function contain(ow: number, oh: number, tw: number, th: number, offsetX: number = 0.5, offsetY: number = 0.5) {
  const originalAspectRatio = ow / oh;
  const targetAspectRatio = tw / th;
  return originalAspectRatio > targetAspectRatio
    ? ({
      width: oh * targetAspectRatio,
      height: oh,
      top: 0,
      left: (ow - oh * targetAspectRatio) * offsetX,
      ratio: oh/th,
      offset: true,
    })
    :
    ({
      width: ow,
      height: ow / targetAspectRatio,
      top: (oh - ow / targetAspectRatio) * offsetY,
      left: 0,
      ratio: ow/tw,
      offset: false
    });
}

export function maxRatio(rw: number, rh: number, sw: number = rw, sh: number = rh) {
  const resolutionAspectRatio = rw / rh;
  const screenAspectRatio = sw / sh;
  
  return resolutionAspectRatio > screenAspectRatio 
  // 스크린 종횡비가 더 작으면  해상도의 세로를 기준으로 길이 계산
    ? ({
      width: rh * screenAspectRatio,
      height: rh,
    })
    :
  // 해상도 종횡비가 더 작으면 해상도의 가로를 기준으로 길이 계산
    ({
      width: rw,
      height: rw / screenAspectRatio,
    });
}
