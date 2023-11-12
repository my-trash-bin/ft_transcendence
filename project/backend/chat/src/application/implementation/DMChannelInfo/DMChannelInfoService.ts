import { Resolver } from "@ft_transcendence/common/di/Container";
import { ApplicationImports } from "../../ApplicationImports";
import { RequestContext } from "../../RequestContext";
import { ChatUserId } from "../../interface/ChatUser/view/ChatUserView";
import { IDMChannelInfoService } from "../../interface/DMChannelInfo/IDMChannelInfoService";
import { DMChannelInfoId, DMChannelInfoView, } from "../../interface/DMChannelInfo/view/DMChannelInfoView";
import { IRepository } from "../../interface/IRepository";
import { mapPrismaDMChannelInfoToDMChannelInfoView } from "./mapTo";

export class DMChannelInfoService implements IDMChannelInfoService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;


  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }

  async findOrCreate(
    fromId: ChatUserId,
    toId: ChatUserId,
    channelId: DMChannelInfoId,
    name = "DM Channel"
  ): Promise<DMChannelInfoView> {
    const dmChannelInfo = await this.repository.client.dMChannelInfo.upsert({
      where: {
        fromId_toId: {
          fromId: fromId.value,
          toId: toId.value
        }
      },
      update: {
      },
      create: {
        fromId: fromId.value,
        toId: toId.value,
        channelId: channelId.value,
        name
      }
    })
    return mapPrismaDMChannelInfoToDMChannelInfoView(dmChannelInfo);
  }
  async delete(
    fromId: ChatUserId,
    toId: ChatUserId
  ): Promise<DMChannelInfoView> {
    const dmChannelInfo = await this.repository.client.dMChannelInfo.delete({
      where: {
        fromId_toId: {
          fromId: fromId.value,
          toId: toId.value,
        }
      }
    });
    return mapPrismaDMChannelInfoToDMChannelInfoView(dmChannelInfo);
  }
}