import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Chat,
  Group,
  GroupChat,
  GroupMember,
  User,
} from "../../../../apps/lib/entities";
import { Repository } from "typeorm";
import {
  CreateGroupDto,
  GroupMessageDto,
} from "../../../../apps/lib/dtos/chats";
import {
  PaginatedResponseData,
  ResponseData,
} from "../../../../apps/lib/interface/response.interface";
import { PaginatedQueryDto } from "../../../../apps/lib/dtos/paginated-query.dto";

@Injectable()
export class GroupChatMicroserviceService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupChat)
    private readonly groupChatRepository: Repository<GroupChat>,
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}
  async createGroup(
    user: User,
    createGroupDto: CreateGroupDto,
  ): Promise<ResponseData> {
    const newGroup = this.groupRepository.create({
      ...createGroupDto,
      ownerId: user.userId,
    });
    await this.groupRepository.save(newGroup);
    //after creating group, add the user as the admin
    const member = this.groupMemberRepository.create({
      groupId: newGroup.groupId,
      memberId: user.userId,
      role: "admin",
      creator: true,
    });
    await this.groupMemberRepository.save(member);
    return {
      success: true,
      message: "New group created successfully",
      data: newGroup,
    };
  }

  async joinGroup(user: User, groupId: string): Promise<ResponseData> {
    //check if group exist
    const group = await this.groupExist(groupId);
    if (!group) {
      return {
        success: false,
        message: `Group with groupId: ${groupId} not found`,
        statusCode: 404,
      };
    }
    //check if user has already joined
    const alreadyJoined = await this.canJoinGroup(user, groupId);
    if (!alreadyJoined) {
      return {
        success: false,
        message: `You are a member of this group`,
        statusCode: 400,
      };
    }
    const groupMember = this.groupMemberRepository.create({
      groupId: groupId,
      memberId: user.userId,
    });
    await this.groupMemberRepository.save(groupMember);
    //increase group members
    const newMembers = group.numOfMembers + 1;
    await this.groupRepository.update(
      { groupId: groupId },
      { numOfMembers: newMembers },
    );
    return {
      success: true,
      message: "Successfully joined group",
      data: groupMember,
    };
  }

  async groupMembers(groupId: string, user: User): Promise<ResponseData> {
    //check if group exist
    const group = await this.groupExist(groupId);
    if (!group) {
      return {
        success: false,
        message: `Group with groupId: ${groupId} not found`,
        statusCode: 404,
      };
    }
    const hasPermission = await this.canViewGroup(user, groupId);
    if (!hasPermission) {
      return {
        success: false,
        message: "You are not authorized to view this group members",
        statusCode: 403,
      };
    }
    // Fetch members and their user data
    const groupMembers = await this.groupMemberRepository.find({
      where: { groupId },
      relations: ["member"],
    });
    // Map to required fields
    const members = groupMembers.map((gm) => ({
      userId: gm.member.userId,
      name: gm.member.name,
      joinedAt: gm.createdAt,
    }));
    // Sort alphabetically by name (case-insensitive)
    members.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
    return {
      success: true,
      message: "Group members retrieved successfully",
      data: members,
    };
  }

  async sendGroupMessage(
    user: User,
    groupId: string,
    groupMessageDto: GroupMessageDto,
  ): Promise<ResponseData> {
    //check if group exist
    const group = await this.groupExist(groupId);
    if (!group) {
      return {
        success: false,
        message: `Group with groupId: ${groupId} not found`,
        statusCode: 404,
      };
    }
    //check if user is in the group
    const hasPermission = await this.canViewGroup(user, groupId);
    if (!hasPermission) {
      return {
        success: false,
        message: "You are not authorized to send message to this group",
        statusCode: 403,
      };
    }
    const message = this.groupChatRepository.create({
      ...groupMessageDto,
      groupId: groupId,
      senderId: user.userId,
    });
    await this.groupChatRepository.save(message);
    return {
      success: true,
      message: "Message sent to group successfully",
      data: message,
    };
  }

  async groupChatsHistory(
    user: User,
    groupId: string,
    query: PaginatedQueryDto,
  ): Promise<PaginatedResponseData<GroupChat> | ResponseData> {
    //check if group exist
    const group = await this.groupExist(groupId);
    if (!group) {
      return {
        success: false,
        message: `Group with groupId: ${groupId} not found`,
        statusCode: 404,
      };
    }
    // Check permission
    const hasPermission = await this.canViewGroup(user, groupId);
    if (!hasPermission) {
      return {
        success: false,
        message: "You are not authorized to view this group chats",
        statusCode: 403,
      };
    }
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    // Query builder
    const queryBuilder = this.groupChatRepository
      .createQueryBuilder("groupChat")
      .leftJoin("groupChat.sender", "sender")
      .select([
        "groupChat.groupChatId",
        "groupChat.message",
        "groupChat.createdAt",
        "sender.userId",
        "sender.name",
      ])
      .where("groupChat.groupId = :groupId", { groupId })
      .orderBy("groupChat.createdAt", "ASC")
      .skip(skip)
      .take(limit);

    const [items, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    const responseResult: PaginatedResponseData<GroupChat> = {
      success: true,
      message: "Group chats retrieved successfully",
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalItems,
        totalPages: totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
      data: items,
    };
    return responseResult;
  }

  async getRecentChats(user: User): Promise<ResponseData> {
    //Get most recent group chats
    const groupSubQuery = this.groupChatRepository
      .createQueryBuilder("gc")
      .select("gc.groupId", "groupId")
      .addSelect("MAX(gc.createdAt)", "maxDate")
      .innerJoin(
        GroupMember,
        "gm",
        "gm.groupId = gc.groupId AND gm.memberId = :userId",
        { userId: user.userId },
      )
      .groupBy("gc.groupId");

    const groupSubQueryString = groupSubQuery.getQuery();
    const recentGroupChats = await this.groupChatRepository
      .createQueryBuilder("gc")
      .innerJoin(
        `(${groupSubQueryString})`,
        "latest",
        `gc."groupId" = latest."groupId" AND gc."createdAt" = latest."maxDate"`,
      )
      .setParameters(groupSubQuery.getParameters())
      .leftJoinAndSelect("gc.group", "group")
      .leftJoinAndSelect("gc.sender", "sender")
      .getMany();

    // Get most recent personal chats
    const personalChatsQuery = await this.chatRepository
      .createQueryBuilder("c")
      .leftJoinAndSelect("c.sender", "sender")
      .leftJoinAndSelect("c.receiver", "receiver")
      .where("c.senderId = :userId OR c.receiverId = :userId", {
        userId: user.userId,
      })
      .orderBy("c.createdAt", "DESC")
      .getMany();

    // Group by conversation pair and take the latest
    const personalChatsMap = new Map<string, Chat>();
    personalChatsQuery.forEach((chat) => {
      const key = [chat.senderId, chat.receiverId].sort().join("-");
      if (!personalChatsMap.has(key)) {
        personalChatsMap.set(key, chat);
      }
    });
    const recentPersonalChats = Array.from(personalChatsMap.values());

    // Format the results
    const formatGroupChat = (gc: GroupChat) => ({
      id: gc.groupId,
      type: "group",
      name: gc.group?.groupName || "Unknown Group",
      message: gc.message,
      createdAt: gc.createdAt,
      sender: {
        id: gc.sender?.userId || null,
        name: gc.sender?.name || "Unknown",
      },
      isGroup: true,
    });
    const formatPersonalChat = (pc: Chat) => {
      const isCurrentUserSender = pc.senderId === user.userId;
      const otherUser = isCurrentUserSender ? pc.receiver : pc.sender;
      return {
        id: isCurrentUserSender ? pc.receiverId : pc.senderId,
        type: "personal",
        name: otherUser?.name || "Unknown",
        message: pc.message,
        createdAt: pc.createdAt,
        sender: {
          id: pc.sender?.userId || null,
          name: isCurrentUserSender ? "You" : pc.sender?.name || "Unknown",
        },
        isGroup: false,
      };
    };

    const combined = [
      ...recentGroupChats.map(formatGroupChat),
      ...recentPersonalChats.map(formatPersonalChat),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return {
      success: true,
      message: "Recent chats retrieved successfully",
      data: combined,
    };
  }

  private async groupExist(groupId: string): Promise<Group | null> {
    const group = await this.groupRepository.findOne({
      where: { groupId: groupId },
    });
    if (!group) {
      return null;
    } else {
      return group;
    }
  }

  private async canViewGroup(user: User, groupId: string): Promise<boolean> {
    const group = await this.groupMemberRepository.findOne({
      where: { groupId: groupId, memberId: user.userId },
    });
    if (!group) {
      return false;
    } else {
      return true;
    }
  }

  private async canJoinGroup(user: User, groupId: string): Promise<boolean> {
    const group = await this.groupMemberRepository.findOne({
      where: { groupId: groupId, memberId: user.userId },
    });
    if (!group) {
      return true;
    } else {
      return false;
    }
  }
}
