enum Command {
  PartyInvite = '/invite',
  PartyKick = '/kick',
  TradeInvite = '/tradewith',
  JoinHideout = '/hideout',
  DoNotDisturb = '/dnd',
  WhoIs = '/whois',
}

export function isCommand(object: any): object is Command {
  return Object.values(Command).includes(object);
}

export default Command;
