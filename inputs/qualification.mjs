export function stripe(input, index, copy = 0) {
  const [height, width, channels] = input.shapes;
  const { stripeRows, brightRect, brightAmplitude, normalAmplitude, seed } = input;
  const start = index * stripeRows;
  const end = Math.min(start + stripeRows, height);
  const values = new Float32Array((end - start) * width * channels);
  for (let row = start; row < end; row += 1) {
    for (let column = 0; column < width; column += 1) {
      for (let channel = 0; channel < channels; channel += 1) {
        const origin = (row * width + column) * channels + channel;
        const noise = (Math.imul(origin + seed, 1597334677) >>> 16) / 65536;
        const [left, top, right, bottom] = brightRect;
        const underLamp = column >= left && column < right && row >= top && row < bottom;
        const amplitude = underLamp ? brightAmplitude : normalAmplitude;
        values[(row - start) * width * channels + column * channels + channel] =
          (noise - 0.5) * amplitude + (copy && column === left ? copy : 0);
      }
    }
  }
  return values;
}
