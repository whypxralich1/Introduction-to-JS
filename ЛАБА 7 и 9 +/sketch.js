let sound;
let isInitialised;
let isLoaded = false;
let amplitude;
let amplitudes = [];

let fft;
let volumeSlider;
let speedSlider;

let strokeRangeX = 100; 
let strokeRangeY = 100; 
let direction; 

let nextButton;
let prevButton;
let pauseButton;
let volumeButton;
let speedButton;
let decreaseVolumeButton;
let decreaseSpeedButton;

let playIcon, pauseIcon, volumeIcon, speedIcon;

let tracks = [
    'assets/audio1.mp3',
    'assets/audio2.mp3',
    'assets/audio3.mp3',
    'assets/audio4.mp3',
    'assets/audio5.mp3',
    'assets/audio6.mp3',
    'assets/audio7.mp3',
    'assets/audio8.mp3'
];

let covers = [
    'assets/cover1.jpg',
    'assets/cover2.jpg',
    'assets/cover3.jpg',
    'assets/cover4.jpg',
    'assets/cover5.jpg',
    'assets/cover6.jpg',
    'assets/cover7.jpg',
    'assets/cover8.jpg'
];

let trackNames = [
    'Zell - iPhone',
    'Osamason - Nothing',
    'Murdah - Switchin Hoes' ,
    'Jace! - Gostyle! 2023',
    'Luke Blovad - Findin Out',
    'Molly Santana - North Pole',
    'YoungBoy NBA - No Smoke',
    '800pts - Trust Issues'
];

let currentTrackIndex = 0; // индекс текущей песни
let coverImage;
let currentTrackName = ''; // переменная для хранения названия текущей песни

function preload() {
    soundFormats('mp3', 'wav');
    sound = loadSound(tracks[currentTrackIndex], () => {
        console.log("Sound is loaded!");
        isLoaded = true;
    });
    
    coverImage = loadImage(covers[currentTrackIndex]);
    playIcon = loadImage('assets/play.png');
    pauseIcon = loadImage('assets/pause.png');
    volumeIcon = loadImage('assets/volume.png'); 
    speedIcon = loadImage('assets/speed.png');
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
    
    // ползунок громкости
    volumeSlider = createSlider(0, 1, 0.5, 0.01);
    volumeSlider.position(665, height - 65);
    volumeSlider.style('width', '150px');

    // ползунок скорости
    speedSlider = createSlider(0.5, 4.0, 1.0, 0.1);
    speedSlider.position(665, height - 45);
    speedSlider.style('width', '150px');
    
    // кнопка "следующая песня"
    nextButton = createButton('');
    nextButton.position(width / 2 + 52 , height - 70);
    nextButton.size(50, 50);
    nextButton.style('border-radius', '50%');
    nextButton.style('background-color', '#0a0a0a');
    nextButton.mousePressed(playNextSong);
    nextButton.mouseOver(() => nextButton.style('background-color', '#050505'));
    nextButton.mouseOut(() => nextButton.style('background-color', '#0a0a0a'));

    // кнопка "предыдущая песня"
    prevButton = createButton(''); 
    prevButton.position(width / 2 - 80, height - 70);
    prevButton.size(50, 50);
    prevButton.style('border-radius', '50%');
    prevButton.style('background-color', '#0a0a0a');
    prevButton.mousePressed(playPrevSong); 
    prevButton.mouseOver(() => prevButton.style('background-color', '#050505'));
    prevButton.mouseOut(() => prevButton.style('background-color', '#0a0a0a'));

    // кнопка "пауза"
    pauseButton = createButton('');
    pauseButton.position(width / 2 - 15, height - 70);
    pauseButton.size(50, 50);
    pauseButton.style('border-radius', '50%');
    pauseButton.style('background-color', '#0a0a0a');
    pauseButton.mousePressed(togglePause);
    pauseButton.mouseOver(() => pauseButton.style('background-color', '#050505'));
    pauseButton.mouseOut(() => pauseButton.style('background-color', '#0a0a0a'));

    // кнопка "увеличить громкость"
    volumeButton = createButton('+ Volume');
    volumeButton.position(950, height - 70);
    volumeButton.size(50, 50);
    volumeButton.style('border-radius', '50%');
    volumeButton.style('background-color', '#0a0a0a');
    volumeButton.style('color', 'white');
    
    // обработчик нажатия для кнопки громкости
    volumeButton.mousePressed(() => {
        let newVolume = constrain(volumeSlider.value() + 0.1, 0, 1);
        volumeSlider.value(newVolume);
        sound.setVolume(newVolume);
    });

    // обработчик наведения для кнопки громкости
    volumeButton.mouseOver(() => {
        volumeButton.style('background-color', '#050505');
        volumeButton.html('Increase Volume');
        volumeButton.style('color', 'white');
    });
    volumeButton.mouseOut(() => {
        volumeButton.style('background-color', '#0a0a0a');
        volumeButton.html('+ Volume');
        volumeButton.style('color', 'white');
    });

    // кнопка "увеличить скорость"
    speedButton = createButton('+ Speed');
    speedButton.position(100, height - 70);
    speedButton.size(50, 50);
    speedButton.style('border-radius', '50%');
    speedButton.style('background-color', '#0a0a0a');
    speedButton.style('color', 'white');
    
    speedButton.mousePressed(() => {
        let newSpeed = constrain(speedSlider.value() + 0.1, 0.5, 4.0);
        speedSlider.value(newSpeed);
        sound.rate(newSpeed);
    });
    speedButton.mouseOver(() => {
        speedButton.style ('background-color', '#050505');
        speedButton.html('Increase Speed'); 
        speedButton.style('color', 'white');
    });
    speedButton.mouseOut(() => {
        speedButton.style('background-color', '#0a0a0a');
        speedButton.html('+ Speed');
        speedButton.style('color', 'white');
    });
    
    //кнопка "уменьшить громкость"
    decreaseVolumeButton = createButton('- Volume');
    decreaseVolumeButton.position(890, height - 70);
    decreaseVolumeButton.size(50, 50);
    decreaseVolumeButton.style('border-radius', '50%');
    decreaseVolumeButton.style('background-color', '#0a0a0a');
    decreaseVolumeButton.style('color', 'white');
    decreaseVolumeButton.mousePressed(() => {
        let newVolume = constrain(volumeSlider.value() - 0.1, 0, 1);
        volumeSlider.value(newVolume);
        sound.setVolume(newVolume);
    });
    decreaseVolumeButton.mouseOver(() => {
        decreaseVolumeButton.style('background-color', '#050505');
        decreaseVolumeButton.html('Decrease Volume');
        decreaseVolumeButton.style('color', 'white');
    });
    decreaseVolumeButton.mouseOut(() => {
        decreaseVolumeButton.style('background-color', '#0a0a0a');
        decreaseVolumeButton.html('- Volume');
        decreaseVolumeButton.style('color', 'white');
    });
    
    //кнопка "уменьшить скорость"
    decreaseSpeedButton = createButton('- Speed');
    decreaseSpeedButton.position(38, height - 70);
    decreaseSpeedButton.size(50, 50);
    decreaseSpeedButton.style('border-radius', '50%');
    decreaseSpeedButton.style('background-color', '#0a0a0a');
    decreaseSpeedButton.style('color', 'white');
    decreaseSpeedButton.mousePressed(() => {
        let newSpeed = constrain(speedSlider.value() - 0.1, 0.5, 4.0);
        speedSlider.value(newSpeed);
        sound.rate(newSpeed);
    });
    decreaseSpeedButton.mouseOver(() => {
        decreaseSpeedButton.style('background-color', '#050505');
        decreaseSpeedButton.html('Decrease Speed');
        decreaseSpeedButton.style('color', 'white');
    });
    decreaseSpeedButton.mouseOut(() => {
        decreaseSpeedButton.style('background-color', '#0a0a0a');
        decreaseSpeedButton.html('- Speed');
        decreaseSpeedButton.style('color', 'white');
    });
    

}

function draw() {
    background(46);
    fill(18);
    rect(10, 10, width - 20, height - 20, 40);
    
    // регулировка громкости 
    let volume = volumeSlider.value();
    sound.setVolume(volume);
    // регулировка скорости  
    let playbackRate = speedSlider.value();
    sound.rate(playbackRate); 
    
    fill(255);
    if (isInitialised && !sound.isPlaying())
        text("press any key to play audio", width / 2, height / 2);
    else if (sound.isPlaying()) {
        let level = amplitude.getLevel();
        amplitudes.push(level);
        amplitudes.shift();
        text(level, width / 2, 40);
   
        fill(163, 242, 160);  // круг посередине
        let size = map(level, 0, 0.20, 100, 200);
        ellipse(width / 2, height / 2 - 35, size, size);
  
        noFill();
        stroke("#DCDCDC");  
        beginShape();
        for (let i = 0; i < amplitudes.length; i++) {
            let h = map(amplitudes[i], 0, 0.20, 0, 100);
            vertex(i * 10, height - h); 
        }
        endShape();

        let freqs = fft.analyze();

        stroke(144, 242, 141);
        noFill();
        beginShape();
        for (let i = 0; i < freqs.length; i++) {
            let h = map(freqs[i], 0, 255, height, 0);
            vertex(i * (width / freqs.length), h);
        }
        endShape();

        noStroke(); 

        let energy = fft.getEnergy("bass"); // круг справа
        fill(144, 242, 141);
        ellipse(width / 2 - 320, height / 2 - 35, 50 + energy);
        fill(144, 242, 141, 75);
        ellipse(width / 2 - 320, height / 2 - 35, 60 + energy);
        fill(144, 242, 141, 50); 
        ellipse(width / 2 - 320, height / 2 - 35, 70 + energy);
        fill(144, 242, 141, 25);  
        ellipse(width / 2 - 320, height / 2 - 35, 80 + energy);
        
        let high_energy = fft.getEnergy("highMid"); // круг слева
        fill(144, 242, 141);
        ellipse(width / 2 + 320, height / 2 - 35, 50 + high_energy);
        fill(144, 242, 141, 75);
        ellipse(width / 2 + 320, height / 2 - 35, 60 + high_energy);
        fill(144, 242, 141, 50);
        ellipse(width / 2 + 320, height / 2 - 35, 70 + high_energy);
        fill(144, 242, 141, 25);
        ellipse(width / 2 + 320, height / 2 - 35, 80 + high_energy);

        // случайная полоска
        if (frameCount % 30 === 0) {
            direction = random([1, -1]);
        }
        noStroke();
        stroke(18); 
        let xOffset = random(-strokeRangeX, strokeRangeX) * direction;
        let yOffset = random(-strokeRangeY, strokeRangeY) * direction;
        line(width / 2, height / 2 - 35 , width / 2 + xOffset, height / 2 + yOffset);

        // полоса времени
        let currentTime = sound.currentTime();
        let duration = sound.duration();

        fill(255);
        rect(20 , height - 100 , width - 40, 10, 40);
        fill(144, 242, 141);
        let progressWidth = map(currentTime, 0, duration, 0, width - 20);
        rect(20, height - 100, progressWidth, 10, 40);  

        //обложка
        if (coverImage) {
            image(coverImage, width / 2 - 160, height / 2 + 202, 50, 50);
        }
        
        // отображение названия текущей песни
        fill(255);
        textSize(15);
        text(currentTrackName, width / 2 - 270, height / 2 + 235); // название песни
    }
    
    // отображение иконок громкости и скорости
    image(volumeIcon, 630, 488, 20, 20);
    image(speedIcon, 630, 508, 20, 20);
    
    // иконка паузы
    if (sound.isPlaying()) {
        image(pauseIcon, pauseButton.x - 3, pauseButton.y - 70, 40, 40); // пауза
    } else {
        image(playIcon, pauseButton.x - 3, pauseButton.y - 70, 40, 40); // воспроизведение
    }
}

function keyPressed() {
    if (!isInitialised) {
        isInitialised = true;
        let r = map(mouseX, 0, width, 0.5, 4.0); // r - скорость воспроизведения звука
        if (isLoaded) {
            try {
                sound.loop(0, r); // loop - функция для зацикливания
                currentTrackName = trackNames[currentTrackIndex]; // Обновляем название текущей песни
            } catch (err) {
                console.log("Error occurred during sound loop: ", err);    
            }
        }
    } else {
        if (key == ' ') {
            togglePause();
        } else if (keyCode === UP_ARROW) { // стрелка вверх
            let newVolume = constrain(volumeSlider.value() + 0.1, 0, 1);
            volumeSlider.value(newVolume);
            sound.setVolume(newVolume);
        } else if (keyCode === DOWN_ARROW) { // стрелка вниз
            let newVolume = constrain(volumeSlider.value() - 0.1, 0, 1);
            volumeSlider.value(newVolume);
            sound.setVolume(newVolume);
        }
    }
}
 
function playNextSong() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length; // переход к следующей песне
    loadAndPlayTrack();
}

function playPrevSong() { 
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length; // переход к предыдущей песне
    loadAndPlayTrack();
}

// текущая песня 
function loadAndPlayTrack() {
    sound.stop();
    sound = loadSound(tracks[currentTrackIndex], () => {
        console.log("Playing: " + tracks[currentTrackIndex]);
        sound.play();
        coverImage = loadImage(covers[currentTrackIndex]); // загрузка обложки
        currentTrackName = trackNames[currentTrackIndex]; // Обновляем название текущей песни
    });
}

function togglePause() {
    if (sound.isPlaying()) {
        sound.pause();
    } else {
        sound.play();
    }
}
