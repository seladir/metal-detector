FROM python:3.7.9-buster

WORKDIR /usr/src/app

#RUN apt-get update && apt-get install -y libblas3 liblapack3 liblapack-dev libblas-dev gfortran libatlas-base-dev
RUN apt-get update && apt-get install -y libsndfile1 ffmpeg

ADD requirements.txt /usr/src/app

RUN pip install --no-cache-dir -r requirements.txt

#RUN pip install numpy
#RUN pip install matplotlib
#RUN pip install librosa
#RUN pip install redis
#RUN pip install gunicorn
#RUN pip install Flask
#RUN pip install pandas
#RUN pip install scikit-learn
#RUN pip freeze

CMD ["gunicorn", "--reload", "-t 24000", "-w 2", "-b", "0.0.0.0:7000", "main:app"]