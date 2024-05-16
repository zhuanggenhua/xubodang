import { ApiFunc } from '../common'
import { Singleton } from '../common/common/base'
import Room from '../model/Room'
import PlayerManager from './PlayerManager'

export default class RoomManager extends Singleton {
  static get Instance() {
    return super.GetInstance<RoomManager>()
  }

  nextRoomId = 1
  rooms: Set<Room> = new Set()
  idMapRoom: Map<number, Room> = new Map()

  createRoom(roomOption: Room) {
    const room = new Room(this.nextRoomId++, roomOption.roomName, roomOption.pwd, roomOption.life, roomOption.mode)
    this.rooms.add(room)
    this.idMapRoom.set(room.id, room)
    return room
  }

  joinRoom(rid: number, uid: number) {
    const room = this.getRoomById(rid)
    if (room) {
      room.join(uid)
      return room
    }
  }

  leaveRoom(rid: number, uid: number) {
    const room = this.getRoomById(rid)
    if (room) {
      room.leave(uid)
    }
  }

  closeRoom(rid: number) {
    const room = this.getRoomById(rid)
    if (room) {
      room.close()
      this.rooms.delete(room)
      this.idMapRoom.delete(rid)
    }
  }

  startRoom(rid: number) {
    const room = this.getRoomById(rid)
    if (room) {
      room.start()
    }
  }

  getRoomById(id: number) {
    return this.idMapRoom.get(id)
  }

  syncRooms() {
    for (const player of PlayerManager.Instance.players) {
      player.connection.sendMsg(ApiFunc.RoomList, { rooms: this.getRoomsView() })
    }
  }

  syncRoom(rid: number) {
    const room = this.idMapRoom.get(rid)
    if (room) {
      room.sync()
    }
  }

  getRoomsView(rooms: Set<Room> = this.rooms) {
    return [...rooms].map((room) => this.getRoomView(room))
  }

  getRoomView({ id, players, roomName, life, mode, pwd, turn }: Room) {    
    let hasPwd = pwd === '' ? false : true
    return { id, roomName, life, mode, hasPwd, turn, players: PlayerManager.Instance.getPlayersView(players) }
  }
}
