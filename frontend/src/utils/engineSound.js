// Web Audio API Synthesizer for Authentic 4-Cylinder Diesel Tractor Engine Cold-Start & Idle
class EngineSoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.nodes = [];
    this.timer = null;
  }

  // Support both boolean property and method invocation
  isPlayingSound() {
    return !!this.isPlaying;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  start(onProgressCallback) {
    this.init();
    if (!this.ctx) return;
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

    // 2. Heavy Diesel 4-Cylinder Combustion Pulses (Idle ~750 RPM -> 12.5 Hz base stroke)
    // Create brown-like filtered noise buffer for compression detonations
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain boost
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Bandpass to emphasize low tractor cylinder roar (45Hz - 180Hz)
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(65, now);
    noiseFilter.Q.setValueAtTime(3.0, now);

    // Amplitude modulation for 4 strokes per 2 revolutions
    const pulseGain = ctx.createGain();
    pulseGain.gain.setValueAtTime(0.0, now);
    pulseGain.gain.setValueAtTime(0.4, now + 0.6);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(pulseGain);
    pulseGain.connect(masterGain);
    noiseSource.start(now + 0.5);
    this.nodes.push(noiseSource, noiseFilter, pulseGain);

    // 3. Low-Frequency Sub-Bass Engine Thrum (Piston strokes)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const lowpass = ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(25, now + 0.6); // 750 RPM idle fundamental

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(50, now + 0.6); // 1st harmonic

    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(110, now + 0.6);

    osc1.connect(lowpass);
    osc2.connect(lowpass);
    lowpass.connect(masterGain);

    osc1.start(now + 0.6);
    osc2.start(now + 0.6);
    this.nodes.push(osc1, osc2, lowpass);

    // Dynamic RPM reporting for visual dial
    let rpm = 0;
    const rpmInterval = setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(rpmInterval);
        return;
      }
      rpm = Math.min(750, rpm + 150);
      const jitter = Math.floor((Math.random() * 20) - 10);
      if (onProgressCallback) onProgressCallback(rpm + jitter);
    }, 200);

    // Auto stop after 7 seconds with smooth fade out
    const playDuration = 7.0;
    masterGain.gain.setValueAtTime(0.35, now + playDuration - 0.6);
    masterGain.gain.linearRampToValueAtTime(0.001, now + playDuration);

    this.timer = setTimeout(() => {
      this.stop();
      clearInterval(rpmInterval);
      if (onProgressCallback) onProgressCallback(750);
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
