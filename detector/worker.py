import pika, sys, os


def main():
    def callback(ch, method, properties, body):
        print("Received %r" % body)

    connection = pika.BlockingConnection(pika.ConnectionParameters('mq'))
    channel = connection.channel()
    channel.queue_declare(queue='detection-request')
    channel.basic_consume(queue='detection-request',
                          auto_ack=True,
                          on_message_callback=callback)

    print('Waiting for messages.')
    channel.start_consuming()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
