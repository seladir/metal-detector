import numpy as np
import librosa
import librosa.display as display
import matplotlib.pyplot as plt
import warnings

warnings.filterwarnings("ignore")


def detect_duration(filename):
    duration = librosa.get_duration(filename=filename)
    return duration


def detect_tempo(y, sr):
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    return tempo


def detect_strength(y, sr):
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    strength = sum(onset_env) / len(onset_env)
    return strength


def detect_constrast(y, sr):
    S_M = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=8, n_fft=512)

    contrast = 0
    for row in S_M:
        prev = 0
        for value in row:
            curr = abs(value)
            if prev != 0 and curr != 0:
                if curr > prev:
                    contrast = contrast + (curr / prev - 1)
                else:
                    contrast = contrast + (prev / curr - 1)
            prev = curr
    return contrast


def detect_fore(y, sr):
    S_full, phase = librosa.magphase(librosa.stft(y))
    S_filter = librosa.decompose.nn_filter(S_full,
                                           aggregate=np.median,
                                           metric='cosine',
                                           width=int(librosa.time_to_frames(2, sr=sr)))
    S_filter = np.minimum(S_full, S_filter)
    margin_v = 200
    power = 2

    mask_v = librosa.util.softmask(S_full - S_filter,
                                   margin_v * S_filter,
                                   power=power)
    S_foreground = mask_v * S_full

    aggregations = []
    for i, row in enumerate(S_foreground):
        if 12 < i < 100:
            sum_row = 0
            for value in row:
                sum_row = sum_row + value
            aggregations.append(sum_row / len(row))

    S_foreground = []
    S_full = []
    S_filter = []

    sorted_aggs = aggregations.copy()
    sorted_aggs.sort()
    top_aggs = sorted_aggs[-6:]
    bottom_aggs = sorted_aggs[0:6]
    top_aggs_sum = sum(top_aggs)
    bottom_aggs_sum = sum(bottom_aggs)
    diff = 1
    if bottom_aggs_sum != 0:
        diff = top_aggs_sum / bottom_aggs_sum

    threshold = top_aggs[0]
    aggs_len = len(aggregations)
    positions_sum = 0
    counter = 0
    for i, value in enumerate(aggregations):
        if value >= threshold:
            positions_sum = positions_sum + (i / aggs_len * 100)
            counter = counter + 1
    position = 0
    if counter > 0:
        position = positions_sum / counter
    return diff, position


def detect(filename):
    duration = detect_duration(filename)

    y, sr = librosa.load(filename, duration=duration/2, offset=duration/4)

    tempo = detect_tempo(y, sr)
    strength = detect_strength(y, sr)
    contrast = detect_constrast(y, sr) / duration
    fore_diff, fore_position = detect_fore(y, sr)

    return [
        duration,
        tempo,
        strength,
        contrast,
        fore_diff,
        fore_position
    ]
