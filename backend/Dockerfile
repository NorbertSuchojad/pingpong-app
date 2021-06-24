FROM python:3-slim
RUN mkdir /app
WORKDIR /app
ADD . /app

COPY ./requirements.txt .
RUN python -m pip install --upgrade pip
RUN pip3 install -r requirements.txt
RUN chmod +x ./entrypoint.sh
EXPOSE 8080
ENTRYPOINT ["sh", "entrypoint.sh"]
