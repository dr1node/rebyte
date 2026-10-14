import { Mp3Encoder } from '@breezystack/lamejs';

export async function decodeAudioFile(file: File): Promise<AudioBuffer> {
  const context = new AudioContext();
  try {
    return await context.decodeAudioData(await file.arrayBuffer());
  } finally {
    await context.close();
  }
}

function getSampleRange(audioBuffer: AudioBuffer, startSeconds: number, endSeconds: number) {
  const startSample = Math.max(0, Math.floor(startSeconds * audioBuffer.sampleRate));
  const endSample = Math.min(audioBuffer.length, Math.floor(endSeconds * audioBuffer.sampleRate));
  if (endSample <= startSample) throw new Error('The selected audio range is empty.');
  return { startSample, endSample };
}

export function formatAudioTime(seconds: number) {
  const wholeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = wholeSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function encodeAudioAsWav(audioBuffer: AudioBuffer, startSeconds = 0, endSeconds = audioBuffer.duration) {
  const { startSample, endSample } = getSampleRange(audioBuffer, startSeconds, endSeconds);
  const channelCount = audioBuffer.numberOfChannels;
  const frameCount = endSample - startSample;
  const bytesPerSample = 2;
  const dataLength = frameCount * channelCount * bytesPerSample;
  const output = new ArrayBuffer(44 + dataLength);
  const view = new DataView(output);
  const writeText = (offset: number, text: string) => {
    for (let index = 0; index < text.length; index += 1) view.setUint8(offset + index, text.charCodeAt(index));
  };

  writeText(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeText(8, 'WAVE');
  writeText(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channelCount, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(28, audioBuffer.sampleRate * channelCount * bytesPerSample, true);
  view.setUint16(32, channelCount * bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeText(36, 'data');
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let frame = startSample; frame < endSample; frame += 1) {
    for (let channel = 0; channel < channelCount; channel += 1) {
      const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[frame]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += bytesPerSample;
    }
  }

  return new Blob([output], { type: 'audio/wav' });
}

export async function encodeAudioAsMp3(
  audioBuffer: AudioBuffer,
  startSeconds = 0,
  endSeconds = audioBuffer.duration,
  bitRate = 192,
) {
  if (audioBuffer.numberOfChannels > 2) {
    throw new Error('MP3 export supports mono or stereo audio.');
  }

  const { startSample, endSample } = getSampleRange(audioBuffer, startSeconds, endSeconds);
  const channels = Array.from({ length: audioBuffer.numberOfChannels }, (_, index) =>
    audioBuffer.getChannelData(index).slice(startSample, endSample),
  );
  const encoder = new Mp3Encoder(channels.length, audioBuffer.sampleRate, bitRate);
  const chunks: Uint8Array[] = [];
  const chunkSize = 1152 * 32;

  for (let offset = 0; offset < channels[0].length; offset += chunkSize) {
    const end = Math.min(offset + chunkSize, channels[0].length);
    const convertSamples = (samples: Float32Array) => {
      const converted = new Int16Array(end - offset);
      for (let index = offset; index < end; index += 1) {
        const sample = Math.max(-1, Math.min(1, samples[index]));
        converted[index - offset] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      }
      return converted;
    };

    const left = convertSamples(channels[0]);
    const frame = channels.length > 1 ? encoder.encodeBuffer(left, convertSamples(channels[1])) : encoder.encodeBuffer(left);
    if (frame.length) chunks.push(frame);
    if (end < channels[0].length) await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }

  const tail = encoder.flush();
  if (tail.length) chunks.push(tail);
  return new Blob(chunks, { type: 'audio/mpeg' });
}