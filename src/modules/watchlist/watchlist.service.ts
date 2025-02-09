import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Watchlist } from "./models/watchlist.model";
import { CreateAssetResponse } from "./response";

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel(Watchlist)
    private readonly watchlistRepository: typeof Watchlist,
  ) {}

  async createAsset(
    user: { id: number },
    dto: { name: string; assetId: string },
  ): Promise<CreateAssetResponse> {
    try {
      const watchlist = {
        user: user.id,
        name: dto.name,
        assetId: dto.assetId,
      };
      await this.watchlistRepository.create(watchlist);
      return watchlist;
    } catch (error) {
      // eslint-disable-next-line
      throw new Error(error);
    }
  }

  async deleteAsset(userId: number, assetId: string): Promise<boolean> {
    try {
      await this.watchlistRepository.destroy({
        where: { id: assetId, user: userId },
      });
      return true;
    } catch (error) {
      // eslint-disable-next-line
      throw new Error(error);
    }
  }
}
