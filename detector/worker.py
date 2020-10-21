import time
import pika, sys, os, json
import detector


def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters('mq'))

    send_channel = connection.channel()
    send_channel.queue_declare(queue='detection-response')

    def callback(ch, method, properties, body):
        detector.detect(json.loads(body), send_channel)

    receive_channel = connection.channel()
    receive_channel.queue_declare(queue='detection-request')
    receive_channel.basic_consume(queue='detection-request',
                                  auto_ack=True,
                                  on_message_callback=callback)

    print('Waiting for messages.')
    receive_channel.start_consuming()


time.sleep(10)
if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
