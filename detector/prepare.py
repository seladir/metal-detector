import os
import sys
import csv
import detector

genre = sys.argv[1]
dirname = './tracks/%s' % genre
filenames = os.listdir(dirname)

with open('%s.csv' % genre, 'w', newline='') as csv_file:
    writer = csv.writer(csv_file, delimiter=',')
    for filename in filenames:
        params = detector.detect(dirname + '/' + filename)
        params.insert(0, genre)
        params.insert(0, filename)
        print(params)
        writer.writerow(params)
