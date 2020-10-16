import warnings
import os
import sys
import csv
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn import metrics
from sklearn import preprocessing
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.gaussian_process import GaussianProcessClassifier
from sklearn.gaussian_process.kernels import RBF
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis

warnings.filterwarnings("ignore")

count = 100
df = pd.read_csv('data123455.csv', header=0)
y = df['Genre']
X = df[['Duration', 'Tempo', 'Strength', 'Contrast', 'Fore_Diff', 'Fore_Position']]

min_max_scaler = preprocessing.MinMaxScaler()
X = min_max_scaler.fit_transform(X)

names = ["Nearest Neighbors", "Linear SVM", "RBF SVM", "Gaussian Process",
         "Decision Tree", "Random Forest", "Neural Net", "AdaBoost",
         "Naive Bayes", "QDA"]

classifiers = [
    KNeighborsClassifier(3),
    SVC(kernel="linear", C=0.025),
    SVC(gamma=2, C=1),
    GaussianProcessClassifier(1.0 * RBF(1.0)),
    DecisionTreeClassifier(max_depth=5),
    RandomForestClassifier(max_depth=5, n_estimators=10, max_features=1),
    MLPClassifier(alpha=1, max_iter=1000),
    AdaBoostClassifier(),
    GaussianNB(),
    QuadraticDiscriminantAnalysis()]

accuracies = []

for i in range(1, count + 1):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.67, random_state=i, shuffle=True)
    for n, classifier in enumerate(classifiers):
        classifier.fit(X_train, y_train)
        y_pred = classifier.predict(X_test)
        accuracy = metrics.accuracy_score(y_test, y_pred)
        if len(accuracies) > n:
            accuracies[n] += accuracy
        else:
            accuracies.append(accuracy)

for n, name in enumerate(names):
    print(name + ': {:.1f}'.format(accuracies[n] * 100 / count))
