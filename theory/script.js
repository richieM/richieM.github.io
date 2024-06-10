const rootNoteSelect = document.getElementById('root-note');
const scaleNotesContainer = document.getElementById('scale-notes');
const songDisplay = document.getElementById('song-display');
const playButton = document.getElementById('play-song');
const clearButton = document.getElementById('clear-chords');
const exportButton = document.getElementById('export-midi');
const presetButtons = document.querySelectorAll('.preset-button');

const majorScales = {
    'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    'C#': ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'],
    'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    'D#': ['D#', 'E#', 'F##', 'G#', 'A#', 'B#', 'C##'],
    'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
    'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
    'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
    'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    'G#': ['G#', 'A#', 'B#', 'C#', 'D#', 'E#', 'F##'],
    'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    'A#': ['A#', 'B#', 'C##', 'D#', 'E#', 'F##', 'G##'],
    'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#']
};

const chordFormulas = {
    'major': [0, 4, 7],
    'minor': [0, 3, 7],
    '7': [0, 4, 7, 10],
    'major7': [0, 4, 7, 11],
    '9': [0, 4, 7, 10, 14],
    'minor7': [0, 3, 7, 10]
};

const chordOptions = {
    0: ['major', 'major7', '9'],
    1: ['minor', 'minor7', '9'],
    2: ['minor', 'minor7'],
    3: ['major', 'major7', '9'],
    4: ['major', '7', '9'],
    5: ['minor', 'minor7', '9'],
    6: [] // The VII chord is typically diminished and not used in major scales for these chord types
};

const noteIndex = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
};

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

let synth;
function updateScaleNotes() {
    const rootNote = rootNoteSelect.value;
    const scaleNotes = majorScales[rootNote];
    scaleNotesContainer.innerHTML = '';
    scaleNotes.forEach((note, index) => {
        const noteContainer = document.createElement('div');
        noteContainer.className = 'note-container';

        const noteLabel = document.createElement('span');
        noteLabel.className = 'note-label';
        noteLabel.innerText = note;
        noteContainer.appendChild(noteLabel);

        const chordButtons = document.createElement('div');
        chordButtons.className = 'chord-buttons';

        const options = chordOptions[index];
        options.forEach(type => {
            const noteButton = document.createElement('button');
            noteButton.innerText = type;
            noteButton.className = 'note-button';
            noteButton.addEventListener('click', () => addChordToSong(note, type));
            noteButton.addEventListener('mouseover', () => playHoverChord(note, type));
            noteButton.addEventListener('mouseout', stopHoverChord);
            chordButtons.appendChild(noteButton);
        });

        noteContainer.appendChild(chordButtons);
        scaleNotesContainer.appendChild(noteContainer);
    });
}

function playHoverChord(note, type) {
    const chord = createChord(note, chordFormulas[type]);
    if (!synth) {
        synth = new Tone.PolySynth(Tone.Synth).toDestination();
    }
    synth.triggerAttackRelease(chord, '2s');
}

function stopHoverChord() {
    if (synth) {
        synth.releaseAll();
    }
}

function addChordToSong(note, type, duration = 2) {
    const chord = createChord(note, chordFormulas[type]);
    const chordDiv = document.createElement('div');
    chordDiv.innerText = note + " " + type;
    chordDiv.className = 'chord';
    chordDiv.draggable = true;
    chordDiv.dataset.chord = JSON.stringify([note, type]);
    chordDiv.dataset.duration = duration;

    const durationInput = document.createElement('input');
    durationInput.type = 'number';
    durationInput.value = duration;
    durationInput.className = 'duration-input';
    durationInput.addEventListener('input', (event) => {
        chordDiv.dataset.duration = event.target.value;
    });

    chordDiv.appendChild(durationInput);
    chordDiv.addEventListener('dragstart', dragStart);
    chordDiv.addEventListener('dragover', dragOver);
    chordDiv.addEventListener('drop', drop);
    chordDiv.addEventListener('click', () => playChord(chord));
    songDisplay.appendChild(chordDiv);
}

function createChord(root, intervals, inversion = 0) {
    const rootIndex = noteIndex[root];
    let chord = intervals.map(interval => notes[(rootIndex + interval) % 12] + '4');

    // Apply inversion
    for (let i = 0; i < inversion; i++) {
        chord.push(chord.shift().replace('4', '5')); // Move the root up an octave
    }

    return chord;
}

function getClosestVoicing(prevChord, nextChord) {
    let minDistance = Infinity;
    let bestVoicing = createChord(nextChord[0], chordFormulas[nextChord[1]]);

    for (let i = 0; i < 3; i++) {
        const voicing = createChord(nextChord[0], chordFormulas[nextChord[1]], i);
        const distance = calculateDistance(prevChord, voicing);
        if (distance < minDistance) {
            minDistance = distance;
            bestVoicing = voicing;
        }
    }

    return bestVoicing;
}

function calculateDistance(chordA, chordB) {
    const getMidi = (note) => Tone.Frequency(note).toMidi();
    const midiA = chordA.map(getMidi);
    const midiB = chordB.map(getMidi);

    let distance = 0;
    for (let i = 0; i < midiA.length; i++) {
        distance += Math.abs(midiA[i] - midiB[i]);
    }

    return distance;
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.innerText);
    event.dataTransfer.effectAllowed = 'move';
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const draggedChord = event.dataTransfer.getData('text/plain');
    const target = event.target;
    if (target.className === 'chord') {
        const newChord = document.createElement('div');
        newChord.innerText = draggedChord;
        newChord.className = 'chord';
        newChord.draggable = true;
        newChord.dataset.chord = target.dataset.chord;
        newChord.addEventListener('dragstart', dragStart);
        newChord.addEventListener('dragover', dragOver);
        newChord.addEventListener('drop', drop);
        newChord.addEventListener('click', () => playChord(JSON.parse(target.dataset.chord)));
        songDisplay.insertBefore(newChord, target.nextSibling);
        target.remove();
    }
}

function playChord(chord) {
    if (!synth) {
        synth = new Tone.PolySynth(Tone.Synth).toDestination();
    }
    synth.triggerAttackRelease(chord, '2s');
}

function playSong() {
    const chords = Array.from(songDisplay.children).map(chordDiv => JSON.parse(chordDiv.dataset.chord));
    const durations = Array.from(songDisplay.children).map(chordDiv => parseFloat(chordDiv.dataset.duration));

    // Set the BPM to 130
    Tone.Transport.bpm.value = 130;

    // Use PolySynth for the chords
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const drum = new Tone.MembraneSynth().toDestination();

    let time = 0;

    // Stop and clear any previous events in the transport
    Tone.Transport.stop();
    Tone.Transport.cancel();

    let prevChord = null;

    chords.forEach((chord, index) => {
        const chordVoicing = prevChord ? getClosestVoicing(prevChord, chord) : createChord(chord[0], chordFormulas[chord[1]]);
        prevChord = chordVoicing;

        Tone.Transport.schedule((t) => {
            synth.triggerAttackRelease(chordVoicing, durations[index] + 's', t);
        }, time);

        // Schedule drum beat for every beat in the duration of the chord
        for (let beatTime = 0; beatTime < durations[index]; beatTime += 0.5) { // 0.5 corresponds to an 8th note
            Tone.Transport.schedule((t) => {
                drum.triggerAttackRelease('C2', '8n', t);
            }, time + beatTime);
        }

        time += durations[index]; // Move to the next time slot
    });

    // Start the transport
    Tone.Transport.start();
}

function exportToMidi() {
    const chords = Array.from(songDisplay.children).map(chordDiv => JSON.parse(chordDiv.dataset.chord));
    const durations = Array.from(songDisplay.children).map(chordDiv => parseFloat(chordDiv.dataset.duration));

    const midi = new Tone.Midi();
    const track = midi.addTrack();

    let time = 0;

    chords.forEach((chord, index) => {
        const chordVoicing = createChord(chord[0], chordFormulas[chord[1]]);
        chordVoicing.forEach(note => {
            track.addNote({
                midi: Tone.Frequency(note).toMidi(),
                time: time,
                duration: durations[index]
            });
        });
        time += durations[index];
    });

    const midiData = midi.toArray();
    const blob = new Blob([midiData], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'progression.mid';
    a.click();
    URL.revokeObjectURL(url);
}

// Add event listeners
exportButton.addEventListener('click', exportToMidi);
presetButtons.forEach(button => {
    button.addEventListener('click', () => {
        const progression = button.dataset.progression.split('-');
        const rootNote = rootNoteSelect.value;
        const scaleNotes = majorScales[rootNote];
        songDisplay.innerHTML = ''; // Clear the current song
        progression.forEach(step => {
            const index = romanToIndex(step);
            const note = scaleNotes[index];
            const type = getDefaultChordType(index);
            addChordToSong(note, type);
        });
    });
});

function romanToIndex(roman) {
    switch (roman) {
        case 'I': return 0;
        case 'ii': return 1;
        case 'iii': return 2;
        case 'IV': return 3;
        case 'V': return 4;
        case 'vi': return 5;
        default: return 0;
    }
}

function getDefaultChordType(index) {
    switch (index) {
        case 0: return 'major';
        case 1: return 'minor';
        case 2: return 'minor';
        case 3: return 'major';
        case 4: return 'major';
        case 5: return 'minor';
        default: return 'major';
    }
}

clearButton.addEventListener('click', () => {
    songDisplay.innerHTML = '';
});

playButton.addEventListener('click', playSong);
rootNoteSelect.addEventListener('change', updateScaleNotes);

// Initialize the scale notes on page load
updateScaleNotes();
