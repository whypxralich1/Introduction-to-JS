let sound;
let isInitialised;
let isLoaded = false;
let amplitude;
let amplitudes = [];

let fft;
let volumeSlider;
let speedSlider;

function preload() {
    soundFormats('mp3', 'wav');
    sound = loadSound('assets/audio1.mp3', () => {
        console.log("sound is loaded!");
        isLoaded = true;
    });
    
    isInitialised = false;
    sound.setVolume(0.5);
}

function setup() {
    createCanvas(1024, 562);
    textAlign(CENTER);
    textSize(32);

    amplitude = new p5.Amplitude();

    for (let i = 0; i < 100; i++)
        amplitudes.push(0);

    fft = new p5.FFT();
    //ползунок громкости
    volumeSlider = createSlider(0, 1, 0.5, 0.01); // min, max, initial value, step
    volumeSlider.position(362, height - 40);
    volumeSlider.style('width', '300px');
    volumeSlider.style('#A9A9A9'); //цвет фона 

    //ползунок скорости
    speedSlider = createSlider(0.5, 4.0, 1.0, 0.1);
    speedSlider.position(362, height - 25);
    speedSlider.style('width', '300px');
    speedSlider.style('#A9A9A9'); //цвет фона 
}

function draw() {

    background(244);
    // регулировка громкости
    let volume = volumeSlider.value();
    sound.setVolume(volume);
    // рег-а скорости
    let playbackRate = speedSlider.value();
        sound.rate(playbackRate);


    if (isInitialised && !sound.isPlaying())
        text("press any key to play audio", width / 2, height / 2);
    else if (sound.isPlaying()) {
        let level = amplitude.getLevel();
        amplitudes.push(level);
        amplitudes.shift();
        text(level, width / 2, 40);

        fill(255);
        let size = map(level, 0, 0.20, 100, 200);
        ellipse(width / 2, height / 2, size, size);

        noFill();
        stroke("#DCDCDC");
        beginShape();
        for (let i = 0; i < amplitudes.length; i++) {
            let h = map(amplitudes[i], 0, 0.20, 0, 100);
            vertex(i * 10, height - h);
        }
        endShape();

        let freqs = fft.analyze();

        stroke(175, 238, 238);
        noFill();
        beginShape();
        for (let i = 0; i < freqs.length; i++) {
            let h = map(freqs[i], 0, 255, height, 0);
            vertex(i * (width / freqs.length), h);
        }
        endShape();

        noStroke();

        let energy = fft.getEnergy("bass");
        fill(192, 192, 192);
        ellipse(width / 4, height / 2, 50 + energy);
        fill(192, 192, 192, 75);
        ellipse(width / 4, height / 2, 60 + energy,);
        fill(192, 192, 192, 50);
        ellipse(width / 4, height / 2, 70 + energy,);
        fill(192, 192, 192, 25);
        ellipse(width / 4, height / 2, 80 + energy,);
        
        
        let high_energy = fft.getEnergy("highMid");
        fill(160, 160, 160);
        ellipse(width * 3 / 4, height / 2, 50 + high_energy);
        fill(160, 160, 160, 75);
        ellipse(width * 3 / 4, height / 2, 60 + high_energy);
        fill(160, 160, 160, 50);
        ellipse(width * 3 / 4, height / 2, 70 + high_energy);
        fill(160, 160, 160, 25);
        ellipse(width * 3 / 4, height / 2, 80 + high_energy);

        // полоса времени
        let currentTime = sound.currentTime();
        let duration = sound.duration();

        fill(255);
        rect(10, height - 70, width - 20, 20);
        fill(128, 128, 128);
        let progressWidth = map(currentTime, 0, duration, 0, width - 20);
        rect(10, height - 70, progressWidth, 20);
        textSize(16);
        fill(0);
        text(nf(currentTime, 1, 2), width / 2, height - 55);
    }
}

function keyPressed() {
    if (!isInitialised) {
        isInitialised = true;
                let r = map(mouseX, 0, width, 0.5, 4.0); // r - скорость воспроизведения звука

        if (isLoaded) {
            try {
                sound.loop(0, r); // loop - функция для зацикливания
            } catch (err) {
                console.log("Error occurred during sound loop: ", err);    
            }
        }

    } else {

        if (key == ' ') {
            if (sound.isPaused()) sound.play();
            else sound.pause();
        }

    }
}