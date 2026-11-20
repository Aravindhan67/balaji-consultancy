// Web Audio API Synthesizer for Authentic 4-Cylinder Diesel Tractor Engine Cold-Start & Idle
class EngineSoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.nodes = [];
    this.timer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  start(onStopCallback) {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Master Volume
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.linearRampToValueAtTime(0.35, now + 0.3); // Smooth ramp up
    masterGain.connect(ctx.destination);
    this.nodes.push(masterGain);

    // 1. Starter Motor Crank (0.0s to 0.6s)
    const starterOsc = ctx.createOscillator();
    const starterGain = ctx.createGain();
    starterOsc.type = 'sawtooth';
    starterOsc.frequency.setValueAtTime(120, now);
    starterOsc.frequency.exponentialRampToValueAtTime(160, now + 0.5);

    starterGain.gain.setValueAtTime(0.15, now);
    starterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    starterOsc.connect(starterGain);
    starterGain.connect(masterGain);
    starterOsc.start(now);
    starterOsc.stop(now + 0.6);
    this.nodes.push(starterOsc, starterGain);

    // 2. Diesel Cylinder Thump / Combustion (4-cylinder firing at 750 RPM ~ 25 Hz)
    const baseFreq = 26; // Deep diesel thrum
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(baseFreq * 0.8, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.6);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(baseFreq * 2, now); // Harmonics

    // Sub-bass filter for heavy tractor exhaust note
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(140, now);
    lowpass.Q.setValueAtTime(2.5, now);

    // Mechanical Tappet Rattle (Bandpass filter over noise)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, now);
    noiseFilter.Q.setValueAtTime(3.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.02, now);
    noiseGain.gain.linearRampToValueAtTime(0.06, now + 0.6);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    whiteNoise.start(now);
    this.nodes.push(whiteNoise, noiseFilter, noiseGain);

    osc1.connect(lowpass);
    osc2.connect(lowpass);
    lowpass.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    this.nodes.push(osc1, osc2, lowpass);

    // Auto stop after 6 seconds with smooth fade out
    const playDuration = 6.0;
    masterGain.gain.setValueAtTime(0.35, now + playDuration - 0.5);
    masterGain.gain.linearRampToValueAtTime(0.001, now + playDuration);

    this.timer = setTimeout(() => {
      this.stop();
      if (onStopCallback) onStopCallback();
    }, playDuration * 1000);
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);

    this.nodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // Ignored if already disconnected
      }
    });
    this.nodes = [];
  }
}

export const engineSound = new EngineSoundSynthesizer();
