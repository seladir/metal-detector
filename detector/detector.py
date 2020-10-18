import warnings
import os
import sys
import csv
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn import preprocessing
from sklearn.gaussian_process import GaussianProcessClassifier
from sklearn.gaussian_process.kernels import RBF
import pika

import analyzer

# warnings.filterwarnings("ignore")

df = pd.read_csv('data.csv', header=0)
y = df['Genre']
X = df[['Duration', 'Tempo', 'Strength', 'Contrast', 'Fore_Diff', 'Fore_Position']]

sc = preprocessing.MinMaxScaler(feature_range=(-1,1), copy=False)
X = sc.fit_transform(X)

classifier = GaussianProcessClassifier(1.0 * RBF(1.0))

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.67, random_state=27, shuffle=True)
classifier.fit(X_train, y_train)


def detect(data, channel):
    response = {
        'id': data['id'],
        'status': 'processing',
        'result': {},
        'fullname': data['fullname'],
    }
    channel.basic_publish(exchange='', routing_key='detection-response', body=json.dumps(response))

    print(data)

    file_params = analyzer.analyze(data['fullname'])
    params_array = np.array(file_params, dtype=np.float32).reshape(1, -1)
    transformed_params = sc.transform(params_array)

    # prediction = classifier.predict(transformed_params)

    probs = classifier.predict_proba(transformed_params)
    best_n = np.argsort(probs, axis=1)
    print(probs)
    print(best_n)

    response = {
        'id': data['id'],
        'status': 'finished',
        'result': {
            "probs": probs[0].tolist(),
        },
        'fullname': data['fullname'],
    }
    channel.basic_publish(exchange='', routing_key='detection-response', body=json.dumps(response))
