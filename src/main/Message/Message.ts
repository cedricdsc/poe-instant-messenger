import { Direction } from '../Message/Direction';
import { IMessage } from '../Message/IMessage';

export function instanceOfMessage(object: any): object is Message {
  return (
    'direction' in object &&
    'timestamp' in object &&
    'text' in object &&
    'username' in object
  );
}

export class Message implements IMessage {
  direction: Direction;

  timestamp: Date;

  text: string;

  username: string;

  constructor(data: string, username: string) {
    const { direction, timestamp, text } = this.parseData(data);
    this.direction = direction;
    this.timestamp = timestamp;
    this.text = text;
    this.username = username;
  }

  parseData(data: string) {
    let direction, timestamp, text;

    const startOfMessage = data.indexOf(': ');
    const closingClientInfoPosition = data.indexOf('] ');

    if (
      data.substring(closingClientInfoPosition, startOfMessage).includes('@To')
    ) {
      direction = Direction.Outgoing;
    } else {
      direction = Direction.Incoming;
    }

    timestamp = this.parseTimestamp(data);

    text = data.substring(startOfMessage + 2);

    return { direction, timestamp, text };
  }

  parseTimestamp(data: string) {
    const poeTime = data.substring(0, 19);
    const year = poeTime.substring(0, 4);
    const month = poeTime.substring(5, 7);
    const day = poeTime.substring(8, 10);
    const hour = poeTime.substring(11, 13);
    const minute = poeTime.substring(14, 16);
    const milli = poeTime.substring(17, 19);
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${milli}`);
  }
}
