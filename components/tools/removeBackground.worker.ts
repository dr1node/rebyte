type MaskResult = {
  data: ArrayBuffer;
  width: number;
  height: number;
};

type WorkerMessage = {
  type: 'process';
  image: Blob;
};

// eslint-disable-next-line no-unused-vars
type Segmenter = (...args: [Blob]) => Promise<Array<{ mask: { data: ArrayLike<number>; width: number; height: number } }>>;

const MODEL_ID = 'briaai/RMBG-1.4';
let segmenterPromise: Promise<Segmenter> | null = null;
let segmenterDevice: 'webgpu' | 'wasm' | null = null;

const postStatus = (message: string) => self.postMessage({ type: 'status', message });

const canUseWebGpu = async () => {
  const workerNavigator = self.navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown> } };
  if (!workerNavigator.gpu) return false;
  try {
    return Boolean(await workerNavigator.gpu.requestAdapter());
  } catch {
    return false;
  }
};

// eslint-disable-next-line no-unused-vars
const createSegmenter = async (device: 'webgpu' | 'wasm', pipeline: (...args: [string, string, Record<string, unknown>]) => Promise<Segmenter>) => pipeline('image-segmentation', MODEL_ID, {
  device,
  progress_callback: (progress: { status?: string; progress?: number }) => {
    if (progress.status === 'progress' && typeof progress.progress === 'number') {
      postStatus(`${device === 'webgpu' ? 'Loading AI model...' : 'Loading AI model with WASM...'} ${Math.round(progress.progress)}%`);
    }
  },
});

const getSegmenter = async () => {
  const { env, pipeline } = await import('@huggingface/transformers');
  env.useBrowserCache = true;
  env.allowLocalModels = false;
  // eslint-disable-next-line no-unused-vars
  const createPipeline = pipeline as unknown as (...args: [string, string, Record<string, unknown>]) => Promise<Segmenter>;
  const device = (await canUseWebGpu()) ? 'webgpu' : 'wasm';
  postStatus(device === 'webgpu' ? 'Loading AI model with WebGPU...' : 'Loading AI model with WASM...');

  if (!segmenterPromise || segmenterDevice !== device) {
    segmenterDevice = device;
    segmenterPromise = createSegmenter(device, createPipeline);
  }

  try {
    return await segmenterPromise;
  } catch (error) {
    segmenterPromise = null;
    segmenterDevice = null;
    if (device !== 'webgpu') throw error;
    postStatus('Loading AI model with WASM...');
    segmenterDevice = 'wasm';
    segmenterPromise = createSegmenter('wasm', createPipeline);
    return segmenterPromise;
  }
};

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  if (event.data.type !== 'process') return;

  try {
    const segmenter = await getSegmenter();
    postStatus('Removing background...');
    const output = await segmenter(event.data.image);
    const mask = output[0]?.mask;
    if (!mask) throw new Error('The AI model did not return a mask');

    const data = new Float32Array(mask.width * mask.height);
    for (let index = 0; index < data.length; index += 1) data[index] = Number(mask.data[index]);
    const result: MaskResult = { data: data.buffer, width: mask.width, height: mask.height };
    // eslint-disable-next-line no-unused-vars
    const postTransfer = self.postMessage.bind(self) as unknown as (message: unknown, transfer: ArrayBuffer[]) => void;
    postTransfer({ type: 'result', result }, [data.buffer as ArrayBuffer]);
  } catch {
    self.postMessage({ type: 'error' });
  }
};
