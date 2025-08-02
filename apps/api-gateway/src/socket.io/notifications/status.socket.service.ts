import { Injectable } from "@nestjs/common";

@Injectable()
export class PresenceService {
  private onlineUsers = new Map<string, string>();
  // private groupMembers = new Map<string, Set<string>>(); // groupId -> Set<userId>
  private socketToUser = new Map<string, string>(); // socketId -> userId (reverse mapping)
  private groupMembers = new Map<string, Set<string>>(); //

  setUserOnline(userId: string, socketId: string) {
    this.onlineUsers.set(userId, socketId);
    this.socketToUser.set(socketId, userId);
  }

  // removeUser(userId: string) {
  //   this.onlineUsers.delete(userId);
  // }
  removeUser(userId: string) {
    const socketId = this.onlineUsers.get(userId);
    if (socketId) {
      this.socketToUser.delete(socketId);
    }
    this.onlineUsers.delete(userId);
  }

  getSocketIdByUserId(userId: string): string | undefined {
    return this.onlineUsers.get(userId);
  }

  // getUserIdBySocketId(socketId: string): string | undefined {
  //   for (const [userId, sid] of this.onlineUsers.entries()) {
  //     if (sid === socketId) return userId;
  //   }
  //   return undefined;
  // }

  getUserIdBySocketId(socketId: string): string | undefined {
    return this.socketToUser.get(socketId); // More efficient lookup
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }

  getOnlineUserIds(): string[] {
    return Array.from(this.onlineUsers.keys());
  }

  addUserToGroup(groupId: string, userId: string) {
    if (!this.groupMembers.has(groupId)) {
      this.groupMembers.set(groupId, new Set());
    }
    this.groupMembers.get(groupId)!.add(userId);
  }

  getGroupMembers(groupId: string): string[] {
    return Array.from(this.groupMembers.get(groupId) || []);
  }

  removeUserFromGroup(groupId: string, userId: string) {
    this.groupMembers.get(groupId)?.delete(userId);
    if (this.groupMembers.get(groupId)?.size === 0) {
      this.groupMembers.delete(groupId);
    }
  }
}
