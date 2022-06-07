import { ICommand } from '../Command/ICommand';
import { StoreSchema } from '../Store/schema';

export type IpcMainStoreChanged = Event<
  'MAIN->OVERLAY::main-store-changed',
  {
    Store: StoreSchema;
  }
>;

export type IpcNotify = Event<
  'MAIN->OVERLAY::notify',
  { from: string; message: string }
>;

export type IpcMouseEnter = Event<
  'OVERLAY->MAIN::mouseEnter',
  {
    mouseEntered: boolean;
  }
>;

export type IpcMouseLeave = Event<
  'OVERLAY->MAIN::mouseLeave',
  {
    mouseLeft: boolean;
  }
>;

export type IpcWindowPositionChanged = Event<
  'OVERLAY->MAIN::window-pos-changed',
  { x: number; y: number }
>;

export type IpcSendMessage = Event<
  'OVERLAY->MAIN::sendMessage',
  {
    text: string;
    recipient: string;
  }
>;

export type IpcReadMessages = Event<
  'OVERLAY->MAIN::readMessages',
  { username: string }
>;

export type IpcDeleteChatHistory = Event<
  'OVERLAY->MAIN::deleteChatHistory',
  {
    username: string;
  }
>;

export type IpcFinishSetup = Event<
  'OVERLAY->MAIN::finishSetup',
  { path: string }
>;

export type IpcRepeatSetup = Event<'OVERLAY->MAIN::repeatSetup'>;

export type IpcSaveSettings = Event<
  'OVERLAY->MAIN::saveSettings',
  { settings: StoreSchema['settings'] }
>;

export type IpcSendCommand = Event<'OVERLAY->MAIN::sendCommand', ICommand>;

export type IpcEvent =
  | IpcMouseEnter
  | IpcMouseLeave
  | IpcSendMessage
  | IpcMainStoreChanged
  | IpcDeleteChatHistory
  | IpcFinishSetup
  | IpcNotify
  | IpcReadMessages
  | IpcSendCommand
  | IpcSaveSettings
  | IpcRepeatSetup
  | IpcWindowPositionChanged;

export type IpcEventPayload<
  Name extends IpcEvent['name'],
  T extends IpcEvent = IpcEvent
> = T extends { name: Name } ? T['payload'] : never;

interface Event<TName extends string, TPayload = undefined> {
  name: TName;
  payload: TPayload;
}
